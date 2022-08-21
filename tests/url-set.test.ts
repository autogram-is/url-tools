import test from 'ava';
import { ParsedUrlSet, NormalizedUrlSet } from '../source/index.js';
import { testUrls } from './parsed-url.test.js';

test('ignores invalid URLs', (t) => {
  const set = new ParsedUrlSet(testUrls.unparsableUrls);
  t.is(set.size, 0);
});

test('track unparsable rejections', (t) => {
  const set = new NormalizedUrlSet([
    testUrls.normalizedUrl,
    ...testUrls.unparsableUrls,
  ]);

  t.is(set.unparsable.size, testUrls.unparsableUrls.length);
  t.is(set.size, 1);
});

test('cull duplicates', (t) => {
  const set = new NormalizedUrlSet(testUrls.normalizedUrlVariations);
  t.is(set.size, 1);
});
