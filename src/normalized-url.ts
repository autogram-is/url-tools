import {URL} from 'node:url';
import {ParsedUrl} from './parsed-url';
import {Mutators, UrlMutator} from './mutations';

export class NormalizedUrl extends ParsedUrl {
  static normalizer: UrlMutator = Mutators.DefaultNormalizer;
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
}
