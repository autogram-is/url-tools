import {ParsedUrl} from '../src';
import {UrlMutators} from '../src/mutations';
import * as fixtures from './setup';

test('default normalizer works', () => {
  const referenceUrl = new ParsedUrl(fixtures.NORMALIZED_URL.normalized);
  fixtures.NORMALIZED_URL.variations.forEach(u => {
    expect(UrlMutators.DefaultNormalizer(new ParsedUrl(u)).href).toBe(
      referenceUrl.href
    );
  });
});
