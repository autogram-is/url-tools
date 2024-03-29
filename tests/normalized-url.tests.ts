import test from 'ava';
import { NormalizedUrl, UrlMutators } from '../source/index.js';
import { testUrls } from './fixtures/urls.js';

test('normalizer is applied correctly', (t) => {
  // 'https://user:password@subdomain.subdomain.domain.com:8080/directory/filename.html?firstParam=1&secondParam=2#anchor';
  NormalizedUrl.normalizer = UrlMutators.stripQueryParameters;
  const url = new NormalizedUrl(testUrls.urlWithAllFeatures);

  t.is(
    url.href,
    'https://user:password@subdomain.subdomain.domain.com:8080/directory/filename.html?firstParam=1&secondParam=2#anchor',
  );

  const url2 = new NormalizedUrl(
    testUrls.urlWithAllFeatures,
    undefined,
    (u) => u,
  );
  t.is(url2.href, testUrls.urlWithAllFeatures);
});

test('setting href applies normalizer', (t) => {
  const n = new NormalizedUrl('HTTP://WWW.EXAMPLE.COM');
  t.is(n.href, 'http://www.example.com/');

  n.href = 'HTTP://WWW.EXAMPLE.COM';
  t.is(n.href, 'http://www.example.com/');
});
