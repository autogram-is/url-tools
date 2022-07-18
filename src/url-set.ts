import {URL} from 'node:url';
import * as _ from 'lodash';

import {ParsedUrl} from './parsed-url';
import {UrlMutator, Mutators} from './mutations';

export class ParsedUrlSet extends Set<string> {
  static DefaultNormalizer:UrlMutator = Mutators.DefaultNormalizer

  public constructor(public normalizer:UrlMutator = ParsedUrlSet.DefaultNormalizer) {
    super();
  }

  override add(value: string|ParsedUrl, errorOnParseFailure:boolean = false): this {
    const parsed = this.parseAndNormalize(value);
    if (parsed) super.add(parsed.href);
    return this;
  }

  override has(value: string|ParsedUrl, strict:boolean = false): boolean {
    const parsed = this.parseAndNormalize(value);
    if (parsed) return super.has(parsed.href);
    else return false;
  }

  override delete(value: string|ParsedUrl, strict:boolean = false): boolean {
    const parsed = this.parseAndNormalize(value);
    if (parsed) return super.delete(parsed.href);
    else return false;
  }

  addItems(values: Array<string|ParsedUrl>, errorOnParseFailure:boolean = false): this {
    values.forEach((v) => { this.add(v, errorOnParseFailure) })
    return this;
  }

  private parseAndNormalize(value: string|ParsedUrl, errorOnParseFailure:boolean = false): ParsedUrl|void {
    try {
      let parsed = (value instanceof ParsedUrl) ? value : new ParsedUrl(value);
      parsed = this.normalizer(parsed);
      return parsed;
    } catch (e:unknown) {
      if (errorOnParseFailure || e !instanceof TypeError) throw(e);
    }
  }

  hydrate(): ParsedUrl[] {
    return [...this].map(u => new ParsedUrl(u)) as ParsedUrl[];
  }
}
