import {ParsedUrl} from './parsed-url';
import {UrlMutator, Mutators} from './mutations';
import {UrlFilter} from './filters';

export class ParsedUrlSet extends Set<string> {
  static DefaultNormalizer: UrlMutator = Mutators.DefaultNormalizer;
  readonly unparseable: Set<string> = new Set<string>();

  public constructor(
    values: Array<string | ParsedUrl> = [],
    public normalizer: UrlMutator = ParsedUrlSet.DefaultNormalizer
  ) {
    super();
    this.addItems(values);
  }

  override add(value: string | ParsedUrl, strict = false): this {
    const parsed = this.parseAndNormalize(value, strict);
    if (parsed) {
      super.add(parsed.href);
    } else {
      this.unparseable.add(value as string);
    }
    return this;
  }

  override has(value: string | ParsedUrl, strict = false): boolean {
    const parsed = this.parseAndNormalize(value, strict);
    if (parsed) return super.has(parsed.href);
    else return false;
  }

  override delete(value: string | ParsedUrl, strict = false): boolean {
    const parsed = this.parseAndNormalize(value, strict);
    if (parsed) return super.delete(parsed.href);
    else return false;
  }

  override clear(): void {
    this.unparseable.clear();
    super.clear();
  }

  addItems(
    values: Array<string | ParsedUrl>,
    errorOnParseFailure = false
  ): this {
    values.forEach(v => {
      this.add(v, errorOnParseFailure);
    });
    return this;
  }

  private parseAndNormalize(
    value: string | ParsedUrl,
    strict = false
  ): ParsedUrl | void {
    try {
      let parsed = value instanceof ParsedUrl ? value : new ParsedUrl(value);
      parsed = this.normalizer(parsed);
      return parsed;
    } catch (e: unknown) {
      if (strict || e! instanceof TypeError) throw e;
    }
  }

  filter(filterFunction: UrlFilter): ParsedUrlSet {
    let urls: ParsedUrl[] = [...this.hydrate()];
    urls = urls.filter(u => filterFunction(u));
    return new ParsedUrlSet(urls);
  }

  hydrate(): ParsedUrl[] {
    return [...this].map(u => new ParsedUrl(u)) as ParsedUrl[];
  }
}
