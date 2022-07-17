import {ParsedUrl} from './parsed-url';
import {UrlMutator} from './mutations';

import * as _ from 'lodash';

export class UrlSet extends Array<ParsedUrl> {
  constructor(items?: ParsedUrl[]) {
    super();
    items && this.addItems(items);
  }

  private addItems(items: ParsedUrl[]) {
    items.forEach(item => this.push(item));
  }

  public parseAndPush(url: string, baseUrl?: string | URL): boolean {
    try {
      const parsed = new ParsedUrl(url, baseUrl);
      this.push(parsed);
    } catch {
      return false;
    }
    return true;
  }

  normalize(normalizer?: UrlMutator, deduplicate:boolean = true): UrlSet {
    let normalizedUrls = new UrlSet();
    if (normalizer) {
      this.forEach(url => {
        normalizedUrls.push(normalizer(url));
      });
    }
    if (deduplicate) {
      normalizedUrls = _.uniqBy(normalizedUrls, 'href') as UrlSet
    }
    return normalizedUrls;
  }
}
