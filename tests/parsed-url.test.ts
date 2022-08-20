import anyTest, { TestFn } from 'ava';
import {ParsedUrl} from '../source/index.js';

const test = anyTest as TestFn<Record<string, string[]>>

test('serialization lifecycle', (t) => {
  const url = new ParsedUrl(t.context.URL_WITH_ALL_FEATURES[0]);
  t.is(
    (JSON.parse(JSON.stringify(url)) as ParsedUrl).href,
    url.href
  );
});

test('subdomain alteration', (t) => {
  const url = new ParsedUrl('https://subdomain.www.domain.com');
  url.subdomain = 'test';
  t.is(url.href, 'https://test.domain.com/');
});

test('subdomain stripping', (t) => {
  const url = new ParsedUrl('https://subdomain.www.domain.com/');
  url.subdomain = '';
  t.is(url.href, 'https://domain.com/');
});
