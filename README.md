# URL Tools

Processing, normalizing, and de-duplicating large piles of URLs can be a pain, particularly if you're trying to distinguish "real" unique URLs from the many variations that can appear in the wild. URLs with anchor links, query params in different orders, social sharing and analytics campaign cruft, accidental references to staging servers… You get the idea.

URL Tools is a helper library whose sole purpose is making that process just a little less frustrating. It consists of four major pieces:

- `ParsedUrl`, a wrapper for the standard WHATWG `URL` class that mixes in the domain and subdomain parsing from [`tldts`](https://www.npmjs.com/package/tldts), and provides a convenience serializer that  preserves the object's individual properties, rather that flattening it to an href the way `URL.toJSON()` does.
- A collection set of helper functions for URL filtering and normalizing operations, including sorting querystring parameters, stripping social sharing cruft, remapping 'ww1', 'ww2', etc. subdomains to a single canonical one, identifying web vs. non-web URLs, flagging urls on public hosting like S3, and more.
- `NormalizedUrl`, a version of `ParsedUrl` that applies one of those normalizer functions automatically on instantiation. Functions that accept a `URL` or `ParsedURL` as a parameter can use `if (url instanceof NormalizedUrl)` to determine whether a given incoming URL has already been normalized. Yay.
- `UrlSet`, `ParsedUrlSet`, and `NormalizedUrlSet`, a trio of Set classes that store, de-duplicate, filter, and normalize piles of Urls in bulk. It's a bit fussy with bulk adding of relative URLs, but you can pass in a 'fallback base url' that helps in some circumstances.

## Installation

`npm install @autogram/url-tools`

## Usage

UrlSet is the simplest example; toss URLs at it, and parsed URLs come out. Any that couldn't be parsed can be found the `urlSet.unparsable` property.

```
import { UrlSet } from '@autogram/url-tools';
const rawUrls = [
  'http://example.com',
  'https://127.0.0.1',
  'tel:1-800-555-1212',
  'definitely-not-a-url'
];

const us = new UrlSet(rawUrls);
for (url of us) {
  console.log(url.href);
}
// 'http://example.com', 'https://127.0.0.1', 'tel:1-800-555-1212'

console.log([...us.unparsable]); // ['definitely-not-a-url']
```

Both `ParsedUrlSet` and `NormalizedUrlSet` can accept a `UrlFilter` function in their constructor options; incoming URLs rejected by that function are shunted to the Set's `parsedUrlSet.rejected` property and not added to the Set proper. 

`NormalizedUrlSet` can rely rely on NormalizedUrl's aggressive defaults, or pass in a UrlMutator function to use as an override.

```
import { NormalizedUrlSet, UrlFilters, UrlMutators } from '@autogram/url-tools';
const options = {
  filter: UrlFilters.isValidWebUrl,
  normalizer: (u) => UrlMutators.forceProtocol(u, 'https')
}

const ns = new NormalizedUrlSet(rawUrls);
for (n of ns) {
  console.log(n.href);
}
// 'http://example.com', 'https://127.0.0.1'

console.log([...ns.unparsable]); // ['definitely-not-a-url']
console.log([...ns.rejected]);   // ['tel:1-800-555-1212']
```