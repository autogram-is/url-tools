# URL Tools

Processing, normalizing, and de-duplicating large piles of URLs can be a pain, particularly if you're trying to distinguish "real" unique URLs from the many variations that can appear in the wild. URLs with anchor links, query params in different orders, social sharing and analytics campaign cruft, accidental references to staging servers… You get the idea.

URL Tools is a helper library whose sole purpose is making that process just a little less frustrating. It consists of four major pieces:

- `ParsedUrl`, a wrapper for the standard WHATWG `URL` class that mixes in the domain and subdomain parsing from [`tldjs`](https://www.npmjs.com/package/tldjs). Serializing a `ParsedUrl` object to JSON also produces a broken out collection of its individual properties, rather than spitting out the `href` property, as is the `URL` class's habit.
- A collection set of helper functions for URL filtering and normalizing operations, including sorting querystring parameters, stripping social sharing cruft, remapping 'ww1', 'ww2', etc. subdomains to a single canonical one, identifying web vs. non-web URLs, flagging urls on public hosting like S3, and more.
- `NormalizedUrl`, a version of `ParsedUrl` that applies one of those normalizer functions automatically on instantiation. Functions that accept a `URL` or `ParsedURL` as a parameter can use `if (url instanceof NormalizedUrl)` to determine whether a given incoming URL has already been normalized. Yay.
- `UrlSet`, `ParsedUrlSet`, and `NormalizedUrlSet`, a trio of Set classes that store, de-duplicate, and normalize piles of Urls in bulk. It's a bit fussy with bulk adding of relative URLs, but you can pass in a 'fallback base url' that helps in some circumstances.
