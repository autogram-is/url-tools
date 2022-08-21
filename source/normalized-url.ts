import { URL } from 'node:url';
import { ParsedUrl } from './parsed-url.js';
import { UrlMutators, UrlMutator } from './mutations.js';

export class NormalizedUrl extends ParsedUrl {
  static normalizer: UrlMutator = UrlMutators.DefaultNormalizer;

  constructor(
    input: string,
    base?: URL | string,
    normalizer: UrlMutator = NormalizedUrl.normalizer,
  ) {
    super(input, base);
    normalizer(this);
  }
}
