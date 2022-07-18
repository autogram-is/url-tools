import {ParsedUrlSet} from '../src';
import * as fixtures from '../src/test-urls';

test('parsed url set normalizes duplicates', () => {
  const set = new ParsedUrlSet(fixtures.NORMALIZED_URL.variations);
  expect(set.size).toBe(1);
});

test('parsed url ignores invalid URLs', () => {
  const set = new ParsedUrlSet(fixtures.UNPARSEABLE_URLS);
  console.log([...set]);
  expect(set.size).toBe(0);
});
