import test from 'ava';
import { ParsedUrl, UrlMutators } from '../source/index.js';
import { testUrls } from './parsed-url.test.js';

test('default normalizer works', (t) => {
  const url = testUrls.normalizedUrl;
  const referenceUrl = new ParsedUrl(url);
  for (const u of testUrls.normalizedUrlVariations) {
    t.is(
      UrlMutators.DefaultNormalizer(new ParsedUrl(u)).href,
      referenceUrl.href,
    );
  }
});
