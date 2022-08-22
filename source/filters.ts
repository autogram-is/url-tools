import { parse } from 'tldts';
import { ParsedUrl } from './parsed-url.js';
import { regExpFromStringMatch, StringMatch } from './index.js';

export const isWebProtocol = function (url: ParsedUrl): boolean {
  const webProtocols = ['http:', 'https:'];
  return webProtocols.includes(url.protocol);
};

export const isAuthenticated = function (url: ParsedUrl): boolean {
  return (url.username + url.password).length > 0;
};

export const hasPublicSuffix = function (url: ParsedUrl): boolean {
  return url.publicSuffix.length > 0;
};

export const matchesPattern = function (
  url: ParsedUrl,
  pattern: StringMatch = [],
  property = 'href',
): boolean {
  if (pattern && property in url) {
    const match = regExpFromStringMatch(pattern);
    return match.test(url.properties[property].toString());
  }

  return false;
};

export const isSocialShareLink = function (url: ParsedUrl): boolean {
  return (
    (url.domain === 'twitter.com' &&
      url.pathname.startsWith('/intent/tweet')) || // Share links
    (url.domain === 'pinterest.com' &&
      url.pathname.startsWith('/pin/create/button')) ||
    (url.domain === 'linkedin.com' &&
      url.pathname.startsWith('/shareArticle')) ||
    (url.domain === 'reddit.com' && url.pathname.startsWith('/submit')) ||
    (url.domain === 'tumblr.com' &&
      url.pathname.startsWith('/widgets/share')) ||
    (url.domain === 'facebook.com' &&
      url.pathname.startsWith('/sharer/sharer.php'))
  );
};

export const isIP = function (url: ParsedUrl): boolean {
  const tld = parse(url.href);
  return tld.isIp ?? false;
};
