import * as hash from 'object-hash'
import * as tld from 'tldjs'

export class ParsedURL extends URL {
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

  public override toJSON() : string {
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
}


