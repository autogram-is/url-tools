import test from 'ava';
import { ParsedUrlSet, NormalizedUrlSet } from '../source/index.js';
import { TEST_URLS } from './parsed-url.test.js';

test('ignores invalid URLs', (t) => {
  const set = new ParsedUrlSet(TEST_URLS.UNPARSABLE_URLS);
  t.is(set.size, 0);
});

test('track unparsable rejections', (t) => {
  const set = new NormalizedUrlSet([
    TEST_URLS.NORMALIZED_URL,
    ...TEST_URLS.UNPARSABLE_URLS,
  ]);

  t.is(set.unparsable.size, TEST_URLS.UNPARSABLE_URLS.length);
  t.is(set.size, 1);
});

test('cull duplicates', (t) => {
  const set = new NormalizedUrlSet(TEST_URLS.NORMALIZED_URL_VARIATIONS);
  t.is(set.size, 1);
});
