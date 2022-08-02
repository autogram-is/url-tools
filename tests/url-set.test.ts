import {UrlSet, ParsedUrl, NormalizedUrl} from '../src';
import * as fixtures from './setup';

test('url ignores invalid URLs', () => {
  const set = new UrlSet<ParsedUrl>(ParsedUrl, fixtures.UNPARSABLE_URLS);
  expect(set.size).toBe(0);
});

test('url set tracks unparsable rejections', () => {
  const set = new UrlSet<NormalizedUrl>(
    NormalizedUrl,
    [fixtures.NORMALIZED_URL.normalized, ...fixtures.UNPARSABLE_URLS],
  );

  console.log(set.unparsable);

  expect(set.unparsable.size).toBe(fixtures.UNPARSABLE_URLS.length);
  expect(set.size).toBe(1);
});

test('url set culls duplicates', () => {
  const set = new UrlSet<NormalizedUrl>(
    NormalizedUrl,
    fixtures.NORMALIZED_URL.variations
  );
  expect(set.size).toBe(1);
});

