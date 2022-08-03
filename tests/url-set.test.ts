import {ParsedUrlSet, NormalizedUrlSet} from '../src';
import * as fixtures from './setup';

test('url ignores invalid URLs', () => {
  const set = new ParsedUrlSet(fixtures.UNPARSABLE_URLS);
  expect(set.size).toBe(0);
});

test('url set tracks unparsable rejections', () => {
  const set = new NormalizedUrlSet([
    fixtures.NORMALIZED_URL.normalized,
    ...fixtures.UNPARSABLE_URLS,
  ]);

  expect(set.unparsable.size).toBe(fixtures.UNPARSABLE_URLS.length);
  expect(set.size).toBe(1);
});

test('url set culls duplicates', () => {
  const set = new NormalizedUrlSet(fixtures.NORMALIZED_URL.variations);
  expect(set.size).toBe(1);
});
