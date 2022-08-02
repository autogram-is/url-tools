import {URL} from 'url';

export class UrlSet<T extends URL> extends Set<string> {
  readonly unparsable: Set<string> = new Set<string>();
  readonly duplicates: string[] = [];

  public constructor(
    private typeConstructor: Constructor<T>,
    values: Array<string | T> = []
  ) {
    super();
    this.addItems(values);
  }

  override add(value: string | T, strict = false): this {
    if (typeof value === 'string') {
      const u = this.parseAndInstantiate(value, strict);
      if (u) {
        if (super.has(u.href)) {
          this.duplicates.push(value);
        } else {
          super.add(u.href);
        }
      } else {
        this.unparsable.add(value);
      }
    } else {
      if (super.has(value.href)) {
        this.duplicates.push(value.href);
      } else {
        super.add(value.href);
      }
    }
    return this;
  }

  override has(value: string | T, strict = false): boolean {
    const parsed = this.parseAndInstantiate(value, strict);
    if (parsed) return super.has(parsed.href);
    else return false;
  }

  override delete(value: string | T, strict = false): boolean {
    const parsed = this.parseAndInstantiate(value, strict);
    if (parsed) return super.delete(parsed.href);
    else return false;
  }

  override clear(): void {
    this.unparsable.clear();
    super.clear();
  }

  addItems(values: Array<string | T>, errorOnParseFailure = false): this {
    values.forEach(v => {
      this.add(v, errorOnParseFailure);
    });
    return this;
  }

  hydrate(): T[] {
    return [...this].map(u => new this.typeConstructor(u)) as T[];
  }

  parseAndInstantiate(value: string | T, strict = false): T | false {
    try {
      if (typeof value === 'string') {
        return new this.typeConstructor(value);
      } else {
        return value;
      }
    } catch (e: unknown) {
      if (strict || e! instanceof TypeError) {
        throw e;
      } else {
        return false;
      }
    }
  }
}

type Constructor<T> = new (input: string, base?: string | T) => T;
