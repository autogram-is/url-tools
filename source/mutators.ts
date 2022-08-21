import { ParsedUrl } from './parsed-url.js';
import { StringMatch, regExpFromStringMatch } from './index.js';

export const defaultNormalizer = function (url: ParsedUrl): ParsedUrl {
  url = forceLowercaseHostname(url);
  url = forceProtocol(url);
  url = stripAuthentication(url);
  url = stripAnchor(url);
  url = stripIndexPages(url);
  url = stripPort(url);
  url = stripSubdomains(url);
  url = stripTrailingSlash(url);
  url = stripQueryParameters(url);
  url = sortQueryParameters(url);
  return url;
};

export const forceLowercaseHostname = function (url: ParsedUrl): ParsedUrl {
  url.hostname = url.hostname.toLowerCase();
  return url;
};

export const forceProtocol = function (
  url: ParsedUrl,
  options = 'https',
): ParsedUrl {
  url.protocol = options;
  return url;
};

export const stripIndexPages = function (
  url: ParsedUrl,
  indexes?: string[],
): ParsedUrl {
  indexes = indexes ?? ['index.htm', 'index.html', 'default.aspx', 'index.php'];
  for (const i of indexes) {
    if (url.pathname.endsWith(i)) {
      url.pathname = url.pathname.replace(i, '');
    }
  }

  return url;
};

export const stripAnchor = function (url: ParsedUrl): ParsedUrl {
  url.hash = '';
  return url;
};

export const stripAuthentication = function (url: ParsedUrl): ParsedUrl {
  url.username = '';
  url.password = '';
  return url;
};

export const stripPort = function (url: ParsedUrl): ParsedUrl {
  url.port = '';
  return url;
};

export const stripQueryParameters = function (
  url: ParsedUrl,
  options: StringMatch = /^utm_\s+|src|referrer|referer/,
): ParsedUrl {
  const stripList = regExpFromStringMatch(options);
  for (const [name] of url.searchParams) {
    if (stripList.test(name)) {
      url.searchParams.delete(name);
    }
  }

  return url;
};

export const stripSubdomains = function (
  url: ParsedUrl,
  options: StringMatch = /^ww[w\d]+/,
): ParsedUrl {
  const stripList = regExpFromStringMatch(options);
  if (stripList.test(url.subdomain)) url.subdomain = '';
  return url;
};

export const stripTrailingSlash = function (url: ParsedUrl): ParsedUrl {
  if (url.pathname.endsWith('/')) {
    url.pathname = url.pathname.slice(0, Math.max(0, url.pathname.length - 1));
  }

  return url;
};

export const sortQueryParameters = function (url: ParsedUrl): ParsedUrl {
  url.searchParams.sort();
  return url;
};
