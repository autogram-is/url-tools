import {URL, URLSearchParams} from 'node:url';
import * as tld from 'tldjs';
const mimer = require('mimer');

export class ParsedUrl extends URL {
  private _mime?: string;

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

  get extension(): string {
    return this.pathname.lastIndexOf('.') > -1
      ? <string>this.pathname.split('.').pop()
      : '';
  }

  get mime(): string {
    return this.extension.length > 0 ? mimer(this.extension) : '';
  }

  get path(): string[] {
    if (this.pathname === '/') return [];
    else return this.pathname.split('/');
  }

  get properties(): Record<string, string | string[] | URLSearchParams> {
    return {
      hash: super.hash,
      host: super.host,
      hostname: super.hostname,
      domain: this.domain,
      subdomain: this.subdomain,
      publicSuffix: this.publicSuffix,
      href: super.href,
      mime: this.mime,
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
  }

  override toJSON(): string {
    return JSON.parse(JSON.stringify(this.properties));
  }
}
