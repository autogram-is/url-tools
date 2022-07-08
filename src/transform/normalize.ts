import { ParsedURL } from '../parsed_url'
import { TransformInterface } from '../url_tool'

export type NormalizeOptions = {
  forceProtocol?: 'https' | 'http',
  lowercaseHostname?: boolean,
  removeWWWSubdomain?: boolean,
  removeAnchors?: boolean,
  removeTrailingSlash?: boolean,
  removeUTMParameters?: boolean,
  removeSourceParameters?: boolean,
  sortQueryParameters?: boolean,
}

export class Normalize implements TransformInterface {
  public readonly options:NormalizeOptions = {
    forceProtocol: 'https',
    lowercaseHostname: true,
    removeWWWSubdomain: true,
    removeAnchors: true,
    removeTrailingSlash: true, // this one is iffy; see notes below.
    removeUTMParameters: true,
    removeSourceParameters: true,
    sortQueryParameters: true,
  }
  name: string = 'Normalize URLs for the entire crawl'
  description: string = 'Filters out some of the most common issues, but may be too optimistic for some sites.'

  constructor(options:NormalizeOptions = {}) {
    this.options = {
      ... this.options,
      ... options
    }
  }

  transform(url: ParsedURL) : ParsedURL {
    // Nearly everything on the internet works fine with SSL, but many sites
    // are littered with mixed protocol links to the same pages. This ensures
    // they don't get counted as double-links.
    if (this.options.forceProtocol) {
      url.protocol = this.options.forceProtocol
    }

    // Hostnames in particular should never be case-sensitive but the question ends up being
    // complicated. See https://serverfault.com/questions/261341/is-the-hostname-case-sensitive
    // — we're leaving it on by default but it's a candidate for toggling if things seem odd.
    if (this.options.lowercaseHostname) {
      url.host = url.host.toLowerCase()
    }

    // Most sites us their top level domain as an alias for the www subdomain, but (again)
    // internal links are often inconsistent.
    if (this.options.removeWWWSubdomain) {
      if (url.subdomain.toString().toLowerCase() == 'www') url.hostname = url.domain.toString()
    }

    // Although some sites still use the anchor to power javascript page rebuilding,
    // most just use it for quick jumping to the header and so on. Strip it to avoid
    // tons of duplicate pages.
    if (this.options.removeAnchors) {
      url.hash = ''
    }

    // Ensure query parameters always appear in the same order
    if (this.options.sortQueryParameters) {
      url.searchParams.sort()
    }

    // Strip Google campaign tracking URL parameters.
    if (this.options.removeUTMParameters) {
      url.searchParams.forEach((value:string, key:string, params:URLSearchParams) => {
        if (key.toLowerCase().startsWith('utm_')) params.delete(key)
      })
    }

    // Strip referral URLs; we record them in the URLAppearance, not the ParsedURL itself.
    if (this.options.removeSourceParameters) {
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
    if (this.options.removeTrailingSlash) {
      if (url.pathname.endsWith('/')) url.pathname = url.pathname.substring(0, url.pathname.length-1)
    }

    return url
  }
}
