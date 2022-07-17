import {URL} from 'node:url';
import * as tld from 'tldjs';
export class ParsedUrl extends URL {
  normalized = false;

  get domain(): string {
    return tld.getDomain(this.hostname) ?? '';
  }
  set domain(value: string) {
    this.hostname = [this.subdomain, value].join('.');
  }

  get subdomain(): string {
    return tld.getSubdomain(this.hostname) ?? '';
  }
  set subdomain(value: string) {
    if (value.length > 0) this.hostname = [value, this.domain].join('.');
    else this.hostname = this.domain;
  }

  get publicSuffix(): string {
    return tld.getPublicSuffix(this.hostname) ?? '';
  }

  get path(): string[] {
    if (this.pathname === '/') return [];
    else return this.pathname.split('/');
  }

  override toJSON(): string {
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
    };
    return JSON.parse(JSON.stringify(properties));
  }
}
