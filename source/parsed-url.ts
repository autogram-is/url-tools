import { URL } from 'node:url';
import { getDomain, getPublicSuffix, getSubdomain } from 'tldts';

export type UrlMutator = (url: ParsedUrl) => ParsedUrl;
export type UrlFilter = (url: ParsedUrl) => boolean;

export class ParsedUrl extends URL {
  get domain(): string {
    return getDomain(this.hostname) ?? '';
  }

  set domain(value: string) {
    this.hostname = [this.subdomain, value].join('.');
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
    return this.pathname.split('/');
  }

  get properties(): Record<
    string,
    string | string[] | Record<string, string | string[]>
  > {
    const searchParameters: Record<string, string | string[]> = {};
    for (const [key, value] of super.searchParams) {
      searchParameters[key] = value;
    }

    return {
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
      searchParams: searchParameters,
      username: super.username,
    };
  }

  serialize(): string {
    return JSON.stringify(this.properties);
  }
}
