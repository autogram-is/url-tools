import { URL } from 'node:url';
import { getDomain, getPublicSuffix, getSubdomain, parse } from 'tldts';

export type UrlData = {
  [property: string]: string | string[] | Record<string, string | string[]>;
  href: string;
};
export class ParsedUrl extends URL {
  static revive(key: string | undefined, value: string | UrlData) {
    if (key === undefined && typeof value !== 'string') {
      return new ParsedUrl(value);
    }

    return value;
  }

  constructor(input: string | UrlData, base?: string | URL) {
    if (typeof input === 'string') {
      super(input, base);
    } else {
      super(input.href, base);
    }
  }

  get domain(): string {
    return getDomain(this.hostname) ?? '';
  }

  set domain(value: string) {
    this.hostname = [this.subdomain, value].join('.');
  }

  get domainWithoutSuffix(): string {
    return parse(this.href).domainWithoutSuffix ?? '';
  }

  get subdomain(): string {
    return getSubdomain(this.hostname) ?? '';
  }

  set subdomain(value: string) {
    this.hostname =
      value.length > 0 ? [value, this.domain].join('.') : this.domain;
  }

  get publicSuffix(): string {
    return getPublicSuffix(this.hostname) ?? '';
  }

  get path(): string[] {
    if (this.pathname === '/') return [];
    return this.pathname.slice(1).split('/');
  }

  get properties(): UrlData {
    const searchParameters: Record<string, string | string[]> = {};
    for (const [key, value] of this.searchParams) {
      searchParameters[key] = value;
    }

    return {
      hash: this.hash,
      host: this.host,
      hostname: this.hostname,
      domain: this.domain,
      domainWithoutSuffix: this.domainWithoutSuffix,
      subdomain: this.subdomain,
      publicSuffix: this.publicSuffix,
      href: this.href,
      origin: this.origin,
      password: this.password,
      pathname: this.pathname,
      path: this.path,
      port: this.port,
      protocol: this.protocol,
      search: this.search,
      searchParams: searchParameters,
      username: this.username,
    };
  }

  serialize(): string {
    return JSON.stringify(this.properties);
  }
}
