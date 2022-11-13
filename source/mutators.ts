import minimatch from 'minimatch';
import { ParsedUrl } from './parsed-url.js';

export type UrlMutator<I extends URL = ParsedUrl, O extends I = I> = (
  url: I,
) => O;

export function defaultNormalizer(url: ParsedUrl): ParsedUrl {
  url = forceLowercaseHostname(url);
  url = forceProtocol(url);
  url = stripAuthentication(url);
  url = stripAnchor(url);
  url = stripIndexPages(url);
  url = stripPort(url);
  url = stripSubdomains(url);
  url = stripQueryParameters(url);
  url = sortQueryParameters(url);
  return url;
}

export function forceLowercaseHostname(url: ParsedUrl): ParsedUrl {
  url.hostname = url.hostname.toLowerCase();
  return url;
}

export const forceProtocol = function (
  url: ParsedUrl,
  options = 'https',
): ParsedUrl {
  url.protocol = options;
  return url;
};

export function stripIndexPages(url: ParsedUrl, indexes?: string[]): ParsedUrl {
  indexes = indexes ?? ['index.htm', 'index.html', 'default.aspx', 'index.php'];
  for (const i of indexes) {
    if (url.pathname.endsWith(i)) {
      url.pathname = url.pathname.replace(i, '');
    }
  }

  return url;
}

export function stripAnchor(url: ParsedUrl): ParsedUrl {
  url.hash = '';
  return url;
}

export function stripAuthentication(url: ParsedUrl): ParsedUrl {
  url.username = '';
  url.password = '';
  return url;
}

export function stripPort(url: ParsedUrl): ParsedUrl {
  url.port = '';
  return url;
}

export function stripQueryParameters(
  url: ParsedUrl,
  pattern: string | RegExp = '{utm_*,src,referer,referrer}',
): ParsedUrl {
  for (const [name] of url.searchParams) {
    if (typeof pattern === 'string') {
      if (minimatch(name, pattern)) {
        url.searchParams.delete(name);
        continue;
      }
    } else if (pattern.test(name)) {
      url.searchParams.delete(name);
      continue;
    }
  }

  return url;
}

export function stripSubdomains(
  url: ParsedUrl,
  pattern: string | RegExp = /^w{2,3}\d*$/,
): ParsedUrl {
  if (typeof pattern === 'string') {
    if (minimatch(url.subdomain, pattern)) url.subdomain = '';
  } else if (pattern.test(url.subdomain)) url.subdomain = '';
  return url;
}

export function stripTrailingSlash(url: ParsedUrl): ParsedUrl {
  if (url.pathname.endsWith('/')) {
    url.pathname = url.pathname.slice(0, Math.max(0, url.pathname.length - 1));
  }

  return url;
}

export function sortQueryParameters(url: ParsedUrl): ParsedUrl {
  url.searchParams.sort();
  return url;
}
