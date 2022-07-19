import {ParsedUrlSet} from '../src';
import * as fixtures from './setup';

test('parsed url set normalizes duplicates', () => {
  const set = new ParsedUrlSet(fixtures.NORMALIZED_URL.variations);
  expect(set.size).toBe(1);
});

test('parsed url ignores invalid URLs', () => {
  const set = new ParsedUrlSet(fixtures.UNPARSEABLE_URLS);
  expect(set.size).toBe(0);
});

test('parsed url set is filterable', () => {
  const set = new ParsedUrlSet([
    fixtures.NORMALIZED_URL.normalized,
    ...fixtures.NON_WEB_URLS,
  ]);

  expect(set.filter(u => u.domain === 'example.com').size).toBe(1);
});

test('parsed url set tracks unparseable rejections', () => {
  const set = new ParsedUrlSet([
    fixtures.NORMALIZED_URL.normalized,
    ...fixtures.UNPARSEABLE_URLS,
  ]);

  expect(set.unparseable.size).toBe(fixtures.UNPARSEABLE_URLS.length);
  expect(set.size).toBe(1);
});
