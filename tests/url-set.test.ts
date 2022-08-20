import anyTest, { TestFn } from 'ava';
import {ParsedUrlSet, NormalizedUrlSet} from '../source/index.js';

const test = anyTest as TestFn<Record<string, string[]>>

test('ignores invalid URLs', (t) => {
  const set = new ParsedUrlSet(t.context.UNPARSABLE_URLS);
  t.is(set.size, 0);
});

test('track unparsable rejections', (t) => {
  const set = new NormalizedUrlSet([
    t.context.NORMALIZED_URL[0],
    ...t.context.UNPARSABLE_URLS,
  ]);

  t.is(set.unparsable.size, t.context.UNPARSABLE_URLS.length);
  t.is(set.size, 1);
});

test('cull duplicates', (t) => {
  const set = new NormalizedUrlSet(t.context.NORMALIZED_URL_VARIATIONS);
  t.is(set.size, 1);
});
