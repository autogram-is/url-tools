import { minimatch } from 'minimatch';
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

export function stripIndexPages(
  url: ParsedUrl,
  pattern = '**/{index,default}.{htm,html,aspx,php}',
): ParsedUrl {
  if (minimatch(url.pathname, pattern)) {
    url.pathname = url.pathname.split('/').slice(0, -1).join('/');
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
  pattern = '{utm_*,src}',
): ParsedUrl {
  const keys = [...url.searchParams.keys()];
  for (const key of keys) {
    if (minimatch(key, pattern)) {
      url.searchParams.delete(key);
      continue;
    }
  }

  return url;
}

export function stripSubdomains(url: ParsedUrl, pattern = 'ww*'): ParsedUrl {
  if (minimatch(url.subdomain, pattern)) url.subdomain = '';
  return url;
}

export function stripPrefix(url: ParsedUrl, prefix = 'www.'): ParsedUrl {
  if (url.hostname.startsWith(prefix)) url.hostname = url.hostname.slice(4);
  return url;
}

export function addPrefix(url: ParsedUrl, prefix = 'www.'): ParsedUrl {
  if (!url.hostname.startsWith(prefix)) url.hostname = prefix + url.hostname;
  return url;
}

export function stripTrailingSlash(url: ParsedUrl): ParsedUrl {
  if (url.pathname.endsWith('/')) {
    url.pathname = url.pathname.slice(0, -1);
  }

  return url;
}

export function sortQueryParameters(url: ParsedUrl): ParsedUrl {
  url.searchParams.sort();
  return url;
}
