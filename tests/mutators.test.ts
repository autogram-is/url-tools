import test from 'ava';
import { ParsedUrl, UrlMutators } from '../source/index.js';
import { TEST_URLS } from './parsed-url.test.js';

test('default normalizer works', (t) => {
  const url = TEST_URLS.NORMALIZED_URL;
  const referenceUrl = new ParsedUrl(url);
  TEST_URLS.NORMALIZED_URL_VARIATIONS.forEach(u => {
    t.is(
      UrlMutators.DefaultNormalizer(new ParsedUrl(u)).href,
      referenceUrl.href
    );
  });
});
