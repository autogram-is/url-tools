import {URL} from 'node:url';
import {UrlMutator} from './mutations.js';
import {NormalizedUrl} from './normalized-url.js';
import {ParsedUrl} from './parsed-url.js';

abstract class UrlTypeSet<T extends URL> extends Set<T> {
  verifier = new Set<string>();
  unparsable = new Set<string>();

  public constructor(
    values?: T[] | string[],
    readonly defaultBase?: string | URL,
    readonly strict: boolean = false
  ) {
    super();
    if (values !== undefined) this.addItems(values);
  }

  override add(value: T | string): this {
    const incoming = typeof value === 'string' ? this.parse(value) : value;
    if (incoming) {
      if (!this.has(incoming)) {
        super.add(incoming);
        this.verifier.add(incoming.href);
      }
    } else {
      this.unparsable.add(value as string);
    }
    return this;
  }

  override has(value: T | string): boolean {
    const incoming = typeof value === 'string' ? this.parse(value) : value;
    if (!incoming) return false;
    return this.verifier.has(incoming.href);
  }

  override delete(value: T | string): boolean {
    const incoming = typeof value === 'string' ? this.parse(value) : value;
    if (incoming) {
      if (this.verifier.delete(incoming.href)) {
        this.forEach(v => {
          if (v.href === incoming.href) super.delete(v);
        });
        return true;
      }
    }
    return false;
  }

  override clear(): void {
    this.verifier.clear();
    this.unparsable.clear();
    super.clear();
  }

  addItems(values: T[] | string[]): this {
    values.forEach(v => {
      this.add(v);
    });
    return this;
  }

  protected abstract parse(input: string, base?: string | URL): T | false;
}

export class UrlSet extends UrlTypeSet<URL> {
  protected override parse(
    input: string,
    base?: string | URL,
    recursing = false
  ): URL | false {
    try {
      return new URL(input, base);
    } catch (e: unknown) {
      if (!recursing && base === undefined && this.defaultBase !== undefined) {
        try {
          return this.parse(input, this.defaultBase, true);
        } catch {
          this.unparsable.add(input);
          return false;
        }
      } else {
        if (e! instanceof TypeError || this.strict) {
          throw e;
        }
      }
      this.unparsable.add(input);
      return false;
    }
  }
}

export class ParsedUrlSet extends UrlTypeSet<ParsedUrl> {
  protected override parse(
    input: string,
    base?: string | URL,
    recursing = false
  ): ParsedUrl | false {
    try {
      return new ParsedUrl(input, base);
    } catch (e: unknown) {
      if (!recursing && base === undefined && this.defaultBase !== undefined) {
        try {
          return this.parse(input, this.defaultBase, true);
        } catch {
          this.unparsable.add(input);
          return false;
        }
      } else {
        if (e! instanceof TypeError || this.strict) {
          throw e;
        }
      }
      this.unparsable.add(input);
      return false;
    }
  }
}

export class NormalizedUrlSet extends UrlTypeSet<NormalizedUrl> {
  public constructor(
    values?: NormalizedUrl[] | string[],
    readonly normalizeer: UrlMutator = NormalizedUrl.normalizer,
    readonly defaultBase?: string | URL,
    strict = false
  ) {
    super(values, defaultBase, strict);
    if (values !== undefined) this.addItems(values);
  }

  protected override parse(
    input: string,
    base?: string | URL,
    recursing = false
  ): NormalizedUrl | false {
    try {
      return new NormalizedUrl(input, base);
    } catch (e: unknown) {
      if (!recursing && base === undefined && this.defaultBase !== undefined) {
        try {
          return this.parse(input, this.defaultBase, true);
        } catch {
          this.unparsable.add(input);
          return false;
        }
      } else {
        if (e! instanceof TypeError || this.strict) {
          throw e;
        }
      }
      this.unparsable.add(input);
      return false;
    }
  }
}
