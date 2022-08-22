import test from 'ava';
import { ParsedUrl } from '../source/index.js';
import { testUrls } from './fixtures/urls.js';

test('serialization lifecycle', (t) => {
  const url = new ParsedUrl(testUrls.urlWithAllFeatures);
  t.is((JSON.parse(url.serialize()) as ParsedUrl).href, url.href);
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
