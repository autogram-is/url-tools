import test from 'ava';
import { NormalizedUrl } from '../source/index.js';
import { testUrls } from './fixtures/urls.js';

test('instantiate from json', (t) => {
  const referenceUrl = new NormalizedUrl(testUrls.urlWithAllFeatures);
  const json = JSON.parse(referenceUrl.serialize(), NormalizedUrl.revive);

  const newUrl = new NormalizedUrl(json);
  t.is(newUrl.toJSON(), referenceUrl.toJSON());
});
