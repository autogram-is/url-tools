import { ParsedUrl, UrlData } from './parsed-url.js';
import { UrlMutators } from './index.js';

export class NormalizedUrl extends ParsedUrl {
  static normalizer: UrlMutators.UrlMutator = UrlMutators.defaultNormalizer;

  static revive(key: string | undefined, value: string | UrlData) {
    if (key === undefined && typeof value !== 'string') {
      const n = new NormalizedUrl(value);
      if ('original' in value) {
        n.original = value.original as string;
      }

      return n;
    }

    return value;
  }

  original: string;

  constructor(
    input: string | UrlData,
    base?: URL | string,
    normalizer: UrlMutators.UrlMutator = NormalizedUrl.normalizer,
  ) {
    super(input, base);
    this.original = super.href;
    normalizer(this);
  }

  get properties(): UrlData {
    const p = super.properties;
    p.original = this.original;
    return p;
  }
}
