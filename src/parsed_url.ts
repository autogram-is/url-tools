import * as _ from "lodash";
import * as hash from 'object-hash'
import * as tld from 'tldjs'

export type FilterFunction = (url: ParsedUrl) => boolean
export type TransformFunction = (url: ParsedUrl) => ParsedUrl

export type UrlNormalizerOptions = {
  forceProtocol?: 'https' | 'http',
  lowercaseHostname?: boolean,
  removeWWWSubdomain?: boolean,
  removeAnchors?: boolean,
  removeTrailingSlash?: boolean,
  removeUTMParameters?: boolean,
  removeSourceParameters?: boolean,
  sortQueryParameters?: boolean,
}

export class ParsedUrl extends URL {
  normalized:boolean = false

  get domain():string {
    return tld.getDomain(this.hostname) ?? ''
  }

  get subdomain(): string {
    return tld.getSubdomain(this.hostname) ?? ''
  }

  get publicSuffix(): string {
    return tld.getPublicSuffix(this.hostname) ?? ''
  }

  get path(): string[] {
    // strip leading and trailing slashes
    let path = this.pathname.split('/')
    if (this.pathname.endsWith('/')) path.pop()
    if (this.pathname.startsWith('/')) path.shift()
    return path
  }

  get fingerprint(): string {
    return hash(this.href)
  }

  override toJSON() : string {
    const properties = {
      hash: super.hash,
      host: super.host,
      hostname: super.hostname,
      domain: this.domain,
      subdomain: this.subdomain,
      publicSuffix: this.publicSuffix,
      href: super.href,
      origin: super.origin,
      password: super.password,
      pathname: super.pathname,
      path: this.path,
      port: super.port,
      protocol: super.protocol,
      search: super.search,
      searchParams: super.searchParams,
      username: super.username,
      normalized: this.normalized
    }
    return JSON.parse(JSON.stringify(properties))
  }

  normalize(): ParsedUrl {
    if (!this.normalized) {
      let newUrl = ParsedUrl.normalize(this).toString()
      this.href = newUrl
      this.normalized = true
    }
    return this
  }

  /*
   * Take a string URL (or an already-constructed URL object) and return a ParsedURL.
   * If one can't be created we throw an error; we probably want to figure out how
   * this can be made more robust.
   */
  public static parse(url: string, baseUrl?: string | URL, normalize: boolean = true, strict:boolean = false) : ParsedUrl | undefined {
    try {
      let parsed = new ParsedUrl(url, baseUrl)
      parsed = this.normalize(parsed)
      return parsed
    } catch (e) {
      if (e instanceof TypeError && !strict) {
        return undefined
      } else {
        throw(e)
      }
    }
  }
  
  /*
   * Generating a consistent hash from a URL is important, because we firehose UniqueURL
   * instances at the database constantly, using the hash of the normalized URL as an
   * ID to ensure that duplicates are ignored.
   */
  public static fingerprint(url: string | ParsedUrl): string {
    if (typeof(url) == 'string') return hash(url)
    else return url.fingerprint
  }
  
  static separate(urls: ParsedUrl[], filter: FilterFunction): { matched: ParsedUrl[], unmatched: ParsedUrl[] } {
    let results = ParsedUrl.group(urls, { matched: filter })
    return {
      matched: results.matched,
      unmatched: results.unmatched
    }
  }

  // Given a list of ParsedURLs and a dictionary of filters, return a
  // dictionary containing all URLs that match each filter,
  public static group(urls: ParsedUrl[], filters: { [key: string]: FilterFunction }, includeUnmatched: boolean = true): { [key: string]: ParsedUrl[] } {
    let remainingUrls = urls
    let groupedUrls: { [key:string]: ParsedUrl[] } = {}

    for (let key in filters) {
      groupedUrls[key] = remainingUrls.filter(u => filters[key](u))
      remainingUrls = _.difference(remainingUrls, groupedUrls[key])
    }
    if (includeUnmatched) groupedUrls.unmatched = remainingUrls
    return groupedUrls
  }

  static normalizerOptions: UrlNormalizerOptions = {
    forceProtocol: 'https',
    lowercaseHostname: true,
    removeWWWSubdomain: true,
    removeAnchors: true,
    removeTrailingSlash: true,
    removeUTMParameters: true,
    removeSourceParameters: true,
    sortQueryParameters: true,
  }

  static normalize(url: ParsedUrl, customOptions: UrlNormalizerOptions = {}) : ParsedUrl {
    let options = {
      ... ParsedUrl.normalizerOptions,
      ... customOptions
    }
  
    if (url.normalized) return url

    // Nearly everything on the internet works fine with SSL, but many sites
    // are littered with mixed protocol links to the same pages. This ensures
    // they don't get counted as double-links.
    if (options.forceProtocol) {
      url.protocol = options.forceProtocol
    }

    // Hostnames in particular should never be case-sensitive but the question ends up being
    // complicated. See https://serverfault.com/questions/261341/is-the-hostname-case-sensitive
    // — we're leaving it on by default but it's a candidate for toggling if things seem odd.
    if (options.lowercaseHostname) {
      url.host = url.host.toLowerCase()
    }

    // Most sites us their top level domain as an alias for the www subdomain, but (again)
    // internal links are often inconsistent.
    if (options.removeWWWSubdomain) {
      if (url.subdomain.toString().toLowerCase() == 'www') url.hostname = url.domain.toString()
    }

    // Although some sites still use the anchor to power javascript page rebuilding,
    // most just use it for quick jumping to the header and so on. Strip it to avoid
    // tons of duplicate pages.
    if (options.removeAnchors) {
      url.hash = ''
    }

    // Ensure query parameters always appear in the same order
    if (options.sortQueryParameters) {
      url.searchParams.sort()
    }

    // Strip Google campaign tracking URL parameters.
    if (options.removeUTMParameters) {
      url.searchParams.forEach((value:string, key:string, params:URLSearchParams) => {
        if (key.toLowerCase().startsWith('utm_')) params.delete(key)
      })
    }

    // Strip referral URLs; we record them in the URLAppearance, not the ParsedUrl itself.
    if (options.removeSourceParameters) {
      const cruft:string[] = ['source', 'ref', 'referrer']
      url.searchParams.forEach((value:string, key:string, params:URLSearchParams) => {
        if (cruft.includes(key.toLowerCase())) params.delete(key)
      })
    }

    // This one's touch and go; by the RFC, a trailing slash makes for a different
    // URL entirely. Many CMSs (cough Wordpress cough), however, use redirects to make
    // them functionally synonymous. This and the 'strip leading www' option are good
    // candidates for domain-specific customization.
    //
    // Also, note that the standard URL object will always append a trailing slash
    // to a top level domain name request with no path. Why? ¯\_(ツ)_/¯
    if (options.removeTrailingSlash) {
      if (url.pathname.endsWith('/')) url.pathname = url.pathname.substring(0, url.pathname.length-1)
    }

    url.normalized = true

    return url
  }
}


