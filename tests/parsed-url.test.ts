import {ParsedUrl} from '../src';
import * as fixtures from './setup';

test('serialization lifecycle works', () => {
  const url = new ParsedUrl(fixtures.URL_WITH_ALL_FEATURES);
  expect((JSON.parse(JSON.stringify(url)) as ParsedUrl).href).toBe(url.href);
});

test('subdomain alteration works', () => {
  const url = new ParsedUrl('https://subdomain.www.domain.com');
  url.subdomain = 'test';
  expect(url.href).toBe('https://test.domain.com/');
});

test('subdomain stripping works', () => {
  const url = new ParsedUrl('https://subdomain.www.domain.com/');
  url.subdomain = '';
  expect(url.href).toBe('https://domain.com/');
});
