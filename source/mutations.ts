import { ParsedUrl } from './parsed-url.js';
import { StringMatch, RegExpFromStringMatch } from './index.js';

type UrlMutator = (
  url: ParsedUrl,
  options?: Record<string, unknown>,
) => ParsedUrl;

type ForceProtocolOptions = { protocol: 'https' | 'http' };
type StripSubdomainOptions = {
  protectedSubdomains: StringMatch;
  strippedSubdomains: StringMatch;
};
type StripQueryParameterOptions = {
  protectedQueryParams: StringMatch;
  strippedQueryParams: StringMatch;
};

const UrlMutators = {
  DefaultNormalizer(url: ParsedUrl): ParsedUrl {
    url = UrlMutators.ForceLowercaseHostname(url);
    url = UrlMutators.ForceProtocol(url);
    url = UrlMutators.StripAuthentication(url);
    url = UrlMutators.StripAnchor(url);
    url = UrlMutators.StripIndexPages(url);
    url = UrlMutators.StripPort(url);
    url = UrlMutators.StripSubdomains(url);
    url = UrlMutators.StripTrailingSlash(url);
    url = UrlMutators.StripQueryParams(url);
    url = UrlMutators.SortQueryParams(url);
    return url;
  },

  ForceLowercaseHostname(url: ParsedUrl): ParsedUrl {
    url.hostname = url.hostname.toLowerCase();
    return url;
  },
  ForceProtocol(
    url: ParsedUrl,
    options: ForceProtocolOptions = { protocol: 'https' },
  ): ParsedUrl {
    url.protocol = options.protocol;
    return url;
  },
  StripIndexPages(url: ParsedUrl, indexes?: string[]): ParsedUrl {
    indexes = indexes ?? [
      'index.htm',
      'index.html',
      'default.aspx',
      'index.php',
    ];
    for (const i of indexes) {
      if (url.pathname.endsWith(i)) {
        url.pathname = url.pathname.replace(i, '');
      }
    }

    return url;
  },
  StripAnchor(url: ParsedUrl): ParsedUrl {
    url.hash = '';
    return url;
  },
  StripAuthentication(url: ParsedUrl): ParsedUrl {
    url.username = '';
    url.password = '';
    return url;
  },
  StripPort(url: ParsedUrl): ParsedUrl {
    url.port = '';
    return url;
  },
  StripQueryParams(
    url: ParsedUrl,
    options: Partial<StripQueryParameterOptions> = {},
  ): ParsedUrl {
    options = {
      strippedQueryParams: /^utm_\s+|src|referrer|referer/,
      ...options,
    };

    const stripList = RegExpFromStringMatch(options.strippedQueryParams);
    url.searchParams.forEach((value: string, name: string) => {
      if (stripList.test(name)) {
        url.searchParams.delete(name);
      }
    });
    return url;
  },
  StripSubdomains(
    url: ParsedUrl,
    options: Partial<StripSubdomainOptions> = {},
  ): ParsedUrl {
    options = {
      strippedSubdomains: /^ww[w\d]+/,
      ...options,
    };

    const stripList = RegExpFromStringMatch(options.strippedSubdomains);
    if (stripList.test(url.subdomain)) url.subdomain = '';
    return url;
  },
  StripTrailingSlash(url: ParsedUrl): ParsedUrl {
    if (url.pathname.endsWith('/')) {
      url.pathname = url.pathname.slice(
        0,
        Math.max(0, url.pathname.length - 1),
      );
    }

    return url;
  },

  SortQueryParams(url: ParsedUrl): ParsedUrl {
    url.searchParams.sort();
    return url;
  },
};

export { UrlMutator, UrlMutators };
