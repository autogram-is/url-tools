import test from 'ava';
import minimatch from 'minimatch';
import {
  NormalizedUrl,
  NormalizedUrlSet,
  ParsedUrl,
  UrlMutators,
} from '../source/index.js';
import { testUrls } from './fixtures/urls.js';

test('default normalizer', (t) => {
  const url = testUrls.normalizedUrl;
  const referenceUrl = new ParsedUrl(url);
  for (const u of testUrls.normalizedUrlVariations) {
    t.is(
      UrlMutators.defaultNormalizer(new ParsedUrl(u)).href,
      referenceUrl.href,
    );
  }
});

test('wildcard querystrings', (t) => {
  const url = testUrls.normalizedUrl;
  const referenceUrl = new ParsedUrl(url);
  referenceUrl.search = '';

  const compareUrl = new NormalizedUrl(url, undefined, (url) =>
    UrlMutators.stripQueryParameters(url, '*'),
  );

  t.is(compareUrl.href, referenceUrl.href);
});

test('index stripping', (t) => {
  const urls = testUrls.indexes;
  const nus = new NormalizedUrlSet(urls, {
    normalizer: UrlMutators.stripIndexPages,
  });

  for (const url of nus.values()) {
    t.is(url.href, 'https://example.com/');
  }
});
