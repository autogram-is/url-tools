import {ParsedUrl} from '../src';
import {Mutators} from '../src/mutations';
import * as fixtures from './setup';

test('default normalizer works', () => {
  const referenceUrl = new ParsedUrl(fixtures.NORMALIZED_URL.normalized);
  fixtures.NORMALIZED_URL.variations.forEach(u => {
    expect(Mutators.DefaultNormalizer(new ParsedUrl(u)).href).toBe(
      referenceUrl.href
    );
  });
});
