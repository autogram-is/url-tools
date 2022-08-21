import { URL } from 'node:url';
import { ParsedUrl } from './parsed-url.js';
import { UrlMutators, UrlMutator } from './mutations.js';

export class NormalizedUrl extends ParsedUrl {
  static normalizer: UrlMutator = UrlMutators.DefaultNormalizer;
  original: string;

  constructor(
    input: string,
    base?: URL | string,
    normalizer: UrlMutator = NormalizedUrl.normalizer,
  ) {
    super(input, base);
    this.original = super.href;
    normalizer(this);
  }

  get properties(): Record<
    string,
    string | string[] | Record<string, string | string[]>
  > {
    const p = super.properties;
    p.original = this.origin;
    return p;
  }
}
