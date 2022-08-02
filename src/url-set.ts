import {URL} from 'node:url';

export class UrlSet<T extends URL> extends Set<string> {
  unparsable: Set<string> = new Set<string>();
  duplicates: Set<string> = new Set<string>();

  public constructor(
    private typeConstructor: Constructor<T>,
    values: string[],
    public strict: boolean = false
  ) {
    super();
    this.addItems(values);
  }

  override add(value: string): this {
    const u = this.parse(value);
    if (u) {
      if (super.has(u.href)) {
        this.duplicates.add(value);
      } else {
        super.add(u.href);
      }
    } else {
      this.unparsable.add(value);
    }
    return this;
  }

  override has(value: string): boolean {
    const parsed = this.parse(value);
    if (parsed) return super.has(parsed.href);
    else return false;
  }

  override delete(value: string): boolean {
    const parsed = this.parse(value);
    if (parsed) return super.delete(parsed.href);
    else return false;
  }

  override clear(): void {
    this.unparsable.clear();
    this.duplicates.clear();
    super.clear();
  }

  addItems(values: Array<string>): this {
    values.forEach(v => {
      this.add(v);
    });
    return this;
  }

  hydrate(): T[] {
    return [...this].map(u => new this.typeConstructor(u)) as T[];
  }

  parse(value: string): T | false {
    try {
      return new this.typeConstructor(value);
    } catch (e: unknown) {
      if (this.strict) {
        throw e;
      } else {
        return false;
      }
    }
  }
}

type Constructor<T> = new (input: string, base?: string | T) => T;
