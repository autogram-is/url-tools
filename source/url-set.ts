import { URL } from 'node:url';
import { NormalizedUrl } from './normalized-url.js';
import { ParsedUrl, UrlFilter } from './parsed-url.js';
import { UrlMutator } from './index.js';

type UrlSetOptions = {
  [key: string]: unknown;
  strict: boolean;
  base?: string | URL;
  filter: (url: URL) => boolean;
};

export class UrlSet<T extends URL = URL> extends Set<T> {
  verifier = new Set<string>();
  unparsable = new Set<string>();
  rejected = new Set<string>();
  options: UrlSetOptions;

  public constructor(
    values?: T[] | string[],
    options: Partial<UrlSetOptions> = {},
  ) {
    super();
    this.options = {
      strict: false,
      base: undefined,
      filter: () => true,
      ...options,
    };
    if (values !== undefined) this.addItems(values);
  }

  override add(value: T | string): this {
    const incoming = typeof value === 'string' ? this.parse(value) : value;
    if (incoming) {
      if (!this.options.filter(incoming)) {
        this.rejected.add(incoming.href);
        return this;
      }

      if (!this.verifier.has(incoming.href)) {
        super.add(incoming as T);
        this.verifier.add(incoming.href);
      }
    } else {
      this.unparsable.add(value as string);
    }

    return this;
  }

  override has(value: T | string): boolean {
    const incoming =
      typeof value === 'string' ? (this.parse(value) as T) : value;
    if (!incoming) return false;
    return this.verifier.has(incoming.href);
  }

  override delete(value: T | string): boolean {
    const incoming =
      typeof value === 'string' ? (this.parse(value) as T) : value;
    if (incoming && this.verifier.delete(incoming.href)) {
      for (const v of this) {
        if (v.href === incoming.href) super.delete(v);
      }

      return true;
    }

    return false;
  }

  override clear(): void {
    this.verifier.clear();
    this.unparsable.clear();
    super.clear();
  }

  addItems(values: T[] | string[]): this {
    for (const v of values) {
      this.add(v);
    }

    return this;
  }

  protected parse<T>(
    input: string,
    base?: string | URL,
    recursing?: boolean,
  ): URL | false {
    try {
      return new URL(input, base);
    } catch (error: unknown) {
      if (!recursing && this.options.base !== undefined) {
        try {
          return this.parse(input, this.options.base, true);
        } catch {
          this.unparsable.add(input);
          return false;
        }
      } else if (!(error instanceof TypeError) || this.options.strict) {
        throw error;
      }

      this.unparsable.add(input);
      return false;
    }
  }
}

type ParsedUrlSetOptions = UrlSetOptions & {
  filter: UrlFilter;
};
export class ParsedUrlSet extends UrlSet<ParsedUrl> {
  rejected = new Set<string>();

  public constructor(
    values?: ParsedUrl[] | string[],
    options: Partial<ParsedUrlSetOptions> = {},
  ) {
    super(values, options);
  }

  protected override parse(
    input: string,
    base?: string | URL,
    recursing = false,
  ): ParsedUrl | false {
    const url = super.parse(input, base, recursing);
    if (url) return new ParsedUrl(url.href);
    return false;
  }
}

type NormalizedUrlSetOptions = ParsedUrlSetOptions & {
  filter: UrlFilter;
  normalizer: UrlMutator;
};

export class NormalizedUrlSet extends UrlSet<NormalizedUrl> {
  options!: NormalizedUrlSetOptions;
  public constructor(
    values?: NormalizedUrl[] | string[],
    options: Partial<NormalizedUrlSetOptions> = {},
  ) {
    super(values, options);
    if (values !== undefined) this.addItems(values);
  }

  protected override parse(
    input: string,
    base?: string | URL,
    recursing = false,
  ): NormalizedUrl | false {
    const url = super.parse(input, base, recursing);
    if (url) return new NormalizedUrl(url.href);
    return false;
  }
}
