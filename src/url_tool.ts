import * as _ from "lodash";
import * as hash from 'object-hash'
import { ParsedURL } from "./parsed_url";

export type Transform = TransformInterface | TransformFunction
export type Filter = FilterInterface | FilterFunction

export interface FilterInterface { match(u: ParsedURL) : boolean }
export interface TransformInterface { transform(u: ParsedURL) : ParsedURL }

export type FilterFunction = (url: ParsedURL) => boolean
export type TransformFunction = (url: ParsedURL) => ParsedURL

export class URLTool {
  // We start with a no-op transform function, to avoid ambiguity
  public static Normalizer: Transform = (url: ParsedURL) => { return url }

  /*
   * Take a string URL (or an already-constructed URL object) and return a ParsedURL.
   * If one can't be created we throw an error; we probably want to figure out how
   * this can be made more robust.
   */
  public static parse(url: string, baseUrl?: string | URL, normalize: boolean | Transform = true, strict:boolean = false) : ParsedURL | undefined {
    var parsed:ParsedURL

    try {
      parsed = new ParsedURL(url, baseUrl)
      if (typeof(normalize) == 'boolean') {
        if (normalize) {
          parsed = this.normalize(parsed)
          parsed.normalized = true
          return parsed
        } else {
          return parsed
        }
      }
      parsed =  this.normalize(parsed, normalize)
      parsed.normalized = true
      return parsed
    } catch (e) {
      if (e instanceof TypeError && !strict) {
        return undefined
      } else {
        throw(e)
      }
    }
  }


  /*
   * Generating a consistent hash from a URL is important, because we firehose UniqueURL
   * instances at the database constantly, using the hash of the normalized URL as an
   * ID to ensure that duplicates are ignored.
   */
  public static fingerprint(url: string | ParsedURL): string {
    if (typeof(url) == 'string') return hash(url)
    else return url.fingerprint
  }

  /*
   * Transform functions: Each one alters a ParsedURL and returns it. If no changes
   * were made, the URL is still returned — it's up to the caller to check for
   * differences if that's important.
   */

  // Run a transform rule on a single URL and return the transformed version.
  // 'Transform' can be an instance of a Transform class, or any lambda function
  // that takes and returns a ParsedURL.
  public static transform(url: ParsedURL, Transform: Transform): ParsedURL{
    if ('transform' in Transform) return Transform.transform(url)
    else return Transform(url)
  }

  // This is a convenience wrapper around transform that defaults to the
  // global Normalizer preset if no Transform is passed in. We may
  // want it smarter in the future.
  public static normalize(url: ParsedURL, Transform?: Transform): ParsedURL {
    if (!Transform) return URLTool.transform(url, URLTool.Normalizer)
    else return this.transform(url, Transform)
  }

  /*
   * Filtering functions: these operate on one or more ParsedURLs, returning
   * either true/false or filtered subsets of an original list of ParsedURLs.
   */

  // Return true if a single URL matches the filter, false if it doesn't
  public static match(url: ParsedURL, filter: Filter): boolean {
    if ('match' in filter) return filter.match(url)
    else return filter(url)
  }

  public static separate(urls: ParsedURL[], filter: Filter): { matched: ParsedURL[], unmatched: ParsedURL[] } {
    let results = URLTool.group(urls, { matched: filter })
    return {
      matched: results.matched,
      unmatched: results.unmatched
    }
  }

  // Given a list of ParsedURLs and a dictionary of filters, return a
  // dictionary containing all URLs that match each filter,
  public static group(urls: ParsedURL[], filters: { [key: string]: Filter }, includeUnmatched: boolean = true): { [key: string]: ParsedURL[] } {
    let remainingUrls = urls
    let groupedUrls: { [key:string]: ParsedURL[] } = {}

    for (let key in filters) {
      groupedUrls[key] = remainingUrls.filter(u => URLTool.match(u, filters[key]))
      remainingUrls = _.difference(remainingUrls, groupedUrls[key])
    }
    if (includeUnmatched) groupedUrls.unmatched = remainingUrls
    return groupedUrls
  }
}
