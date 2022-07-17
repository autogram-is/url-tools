# URL Tools

A drop-in wrapper for the standard URL class that adds a few handy extras:

1. An easy-to-iterate array representation of the url's path elements at `myUrl.path`
2. Via `tldjs`, distinct getters and setters for the url's domain and subdomain, in addition to the full hostname. Also exposes a read-only `myUrl.publicSuffix` property, to quickly identify URLs that live on Amazon S3 and similar services.
3. Overridden `toJSON()` method that captures the url object's individual properties when serializing, rather than simply returning `myUrl.href`. This is useful when individual the JSON properties will be used for filtering or sorting in another context and re-parsing everything would be annoying. FWIW, this means that you'll get a big mess of JSON if you serialize something with a ParsedURL object in one of is properties. For our use case this was desired but YMMV.

# Todo

Next steps include helperfunctions for grouping, filtering, normalizing, and de-duplicating large normalizedURL sets.