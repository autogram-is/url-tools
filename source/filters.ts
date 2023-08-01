import { match } from 'node:assert';
import { parse } from 'tldts';
import { minimatch } from 'minimatch';
import { ParsedUrl } from './parsed-url.js';

export type UrlFilter<T extends URL = ParsedUrl> = (url: T) => boolean;

export function isWebProtocol(url: URL): boolean {
  const webProtocols = ['http:', 'https:'];
  return webProtocols.includes(url.protocol);
}

export function isAuthenticated(url: URL): boolean {
  return (url.username + url.password).length > 0;
}

export function hasPublicSuffix(url: ParsedUrl): boolean {
  return url.publicSuffix.length > 0;
}

export function matches(
  url: ParsedUrl,
  pattern: string,
  property = 'href',
): boolean {
  if (property in url) {
    return minimatch(url.properties[property].toString(), pattern);
  }

  return false;
}

export function isSocialShareLink(url: ParsedUrl): boolean {
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
}

export function isIp(url: URL): boolean {
  const tld = parse(url.href);
  return tld.isIp ?? false;
}
