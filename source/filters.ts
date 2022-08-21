import { ParsedUrl } from './parsed-url.js';
import { regExpFromStringMatch, StringMatch } from './index.js';

type UrlFilter = (url: ParsedUrl, options?: Record<string, unknown>) => boolean;

type MatchesPatternOptions = { pattern: StringMatch; property: string };

const UrlFilters = {
  IsWebProtocol(url: ParsedUrl): boolean {
    const webProtocols = ['http:', 'https:'];
    return webProtocols.includes(url.protocol);
  },
  IsAuthenticated(url: ParsedUrl): boolean {
    return (url.username + url.password).length > 0;
  },
  HasPublicSuffix(url: ParsedUrl): boolean {
    return url.publicSuffix.length > 0;
  },
  MatchesPattern(
    url: ParsedUrl,
    options: Partial<MatchesPatternOptions> = {},
  ): boolean {
    options = {
      pattern: [],
      property: 'href',
      ...options,
    };

    if (options.property && options.property in url) {
      const match = regExpFromStringMatch(options.pattern);
      return match.test(url.properties[options.property].toString());
    }

    return false;
  },
  IsSocialShareLink(url: ParsedUrl): boolean {
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
  },
};

export { UrlFilter, UrlFilters };
