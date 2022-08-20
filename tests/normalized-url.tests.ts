import anyTest, { TestFn } from 'ava';
import {NormalizedUrl} from '../source/index.js';

const test = anyTest as TestFn<Record<string, string[]>>

test('normalizer is applied correctly', (t) => {
  // 'https://user:password@subdomain.subdomain.domain.com:8080/directory/filename.html?firstParam=1&secondParam=2#anchor';

  const url = new NormalizedUrl(t.context.URL_WITH_ALL_FEATURES[0]);

  t.is(
    url.href,
    'https://subdomain.subdomain.domain.com/directory/filename.html?firstParam=1&secondParam=2'
  );

  const url2 = new NormalizedUrl(
    t.context.URL_WITH_ALL_FEATURES[0],
    undefined,
    u => u
  );
  t.is(url2.href, t.context.URL_WITH_ALL_FEATURES[0]);
});
