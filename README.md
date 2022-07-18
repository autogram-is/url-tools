# URL Tools

Processing, normalizing, and de-duplicating large piles of URLs can be a pain,
particularly if you're trying to distinguish "real" unique URLs from the many
variations that can appear in the wild. URLs with anchor links, query params
in different orders, social sharing and analytics campaign cruft, accidental
references to staging servers… You get the idea.

URL Tools is a helper library whose sole purpose is making that process just a
little less frustrating. It consists of four major pieces:

- `ParsedUrl`, a wrapper for the standard WHATWG `URL` class that mixes in the
  domain and subdomain parsing from `tldjs`. Serializing a `ParsedUrl` object to
  JSON also produces a broken out collection of its individual properties, rather
  than spitting out the `href` property, as is the `URL` class's habit.
- `ParsedUrlSet`, a collection class that automatically parses, normalizes, and
  de-duplicates sets of existing Urls. It's a bit janky, since ES6's `Set`
  implementation only supports value comparison. As such, you can put `ParsedUrl`
  objects *into* the set, but after normalization they're stored as simple strings.
  It also keeps track of the URLs that it rejects as unparseable.
- A light set of helper functions for common filtering and normalizing operations,
  including sorting querystring parameters,  stripping social sharing cruft,
  remapping 'ww1', 'ww2', etc. subdomains to a single canonical one, identifying
  web vs. non-web URLs, flagging urls on public hosting like S3, and more.
# Todo
- [ ] A richer set of filters
- [ ] Chainable filtering and transforming for ParsedUrlSet 