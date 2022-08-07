import {URL, URLSearchParams} from 'node:url';
import {ParsedUrl} from './parsed-url';
import {UrlMutators, UrlMutator} from './mutations';

export class NormalizedUrl extends ParsedUrl {
  static normalizer: UrlMutator = UrlMutators.DefaultNormalizer;
  raw: string;
  parsed: string;

  constructor(
    input: string,
    base?: URL | string,
    normalizer: UrlMutator = NormalizedUrl.normalizer
  ) {
    super(input, base);
    this.raw = input;
    this.parsed = this.href;
    normalizer(this);
  }

  get properties(): Record<string, string | string[] | URLSearchParams> {
    return {
      ...super.properties,
      ...{
        raw: this.raw,
        parsed: this.parsed,
      },
    };
  }
}
