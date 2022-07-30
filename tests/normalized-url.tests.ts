import {NormalizedUrl} from '../src';

import * as fixtures from './setup';

test('normalizer is applied correctly', () => {
  // 'https://user:password@subdomain.subdomain.domain.com:8080/directory/filename.html?firstParam=1&secondParam=2#anchor';

  const url = new NormalizedUrl(fixtures.URL_WITH_ALL_FEATURES);

  expect(url.raw).toEqual(fixtures.URL_WITH_ALL_FEATURES);
  expect(url.href).toEqual(
    'https://subdomain.subdomain.domain.com/directory/filename.html?firstParam=1&secondParam=2'
  );

  const url2 = new NormalizedUrl(
    fixtures.URL_WITH_ALL_FEATURES,
    undefined,
    u => u
  );
  expect(url2.href).toEqual(fixtures.URL_WITH_ALL_FEATURES);
});
