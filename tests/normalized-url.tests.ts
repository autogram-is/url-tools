import test from 'ava';
import { NormalizedUrl, UrlFilters, UrlMutators } from '../source/index.js';
import { TEST_URLS } from './parsed-url.test.js';

test('normalizer is applied correctly', (t) => {
  // 'https://user:password@subdomain.subdomain.domain.com:8080/directory/filename.html?firstParam=1&secondParam=2#anchor';
  NormalizedUrl.normalizer = UrlMutators.StripQueryParams;
  const url = new NormalizedUrl(TEST_URLS.URL_WITH_ALL_FEATURES);

  t.is(
    url.href,
    'https://user:password@subdomain.subdomain.domain.com:8080/directory/filename.html?firstParam=1&secondParam=2#anchor'
  );

  const url2 = new NormalizedUrl(
    TEST_URLS.URL_WITH_ALL_FEATURES,
    undefined,
    u => u
  );
  t.is(url2.href, TEST_URLS.URL_WITH_ALL_FEATURES);
});
