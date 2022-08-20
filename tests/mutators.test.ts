import anyTest, { TestFn } from 'ava';
import {ParsedUrl, UrlMutators} from '../source/index.js';

const test = anyTest as TestFn<Record<string, string[]>>

test('default normalizer works', (t) => {
  const referenceUrl = new ParsedUrl(t.context.NORMALIZED_URL[0]);
  t.context.NORMALIZED_URL_VARIATIONS.forEach(u => {
    t.is(
      UrlMutators.DefaultNormalizer(new ParsedUrl(u)).href,
      referenceUrl.href
    );
  });
});
