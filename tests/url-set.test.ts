import test from 'ava';
import { ParsedUrl, ParsedUrlSet, NormalizedUrlSet, UrlMutators } from '../source/index.js';
import { testUrls } from './fixtures/urls.js';

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

test('custom normalizer', (t) => {
  const normalizer: UrlMutators.UrlMutator = url => {
    url.href = 'https://forced-url.com/';
    return url;
  }

  const set = new NormalizedUrlSet(testUrls.normalizedUrlVariations, { normalizer });
  t.is(set.size, 1);
  t.is([...set].pop()?.href, 'https://forced-url.com/');
});