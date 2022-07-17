import {ParsedUrl} from '../src';

const LONG_URL =
  'https://staging.www.example.com:8080/parent/path?param=1&anotherParam=2';

test('serialization lifecycle works', () => {
  const url = new ParsedUrl(LONG_URL);
  expect((JSON.parse(JSON.stringify(url)) as ParsedUrl).href).toBe(url.href);
});

test('subdomain alteration works', () => {
  const url = new ParsedUrl(LONG_URL);
  url.subdomain = 'test';
  expect(url.href).toBe(
    'https://test.example.com:8080/parent/path?param=1&anotherParam=2'
  );
});

test('subdomain stripping works', () => {
  const url = new ParsedUrl(LONG_URL);
  url.subdomain = '';
  expect(url.href).toBe(
    'https://example.com:8080/parent/path?param=1&anotherParam=2'
  );
});
