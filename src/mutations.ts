import {ParsedUrl} from './parsed-url';
import {StringMatch, RegExpFromStringMatch} from './index';

type UrlMutator = (
  url: ParsedUrl,
  options?: Record<string, unknown>
) => ParsedUrl;

type ForceProtocolOptions = {protocol: 'https' | 'http'};
type StripSubdomainOptions = {
  protectedSubdomains: StringMatch;
  strippedSubdomains: StringMatch;
};
type StripQueryParamOptions = {
  protectedQueryParams: StringMatch;
  strippedQueryParams: StringMatch;
};

const Mutators = {
  DefaultNormalizer: function (url: ParsedUrl): ParsedUrl {
    url = this.ForceLowercaseHostname(url);
    url = this.ForceProtocol(url);
    url = this.StripAuthentication(url);
    url = this.StripAnchor(url);
    url = this.StripPort(url);
    url = this.StripSubdomains(url);
    url = this.StripTrailingSlash(url);
    url = this.StripQueryParams(url);
    url = this.SortQueryParams(url);
    return url;
  },

  ForceLowercaseHostname: function (url: ParsedUrl): ParsedUrl {
    url.hostname = url.hostname.toLowerCase();
    return url;
  },
  ForceProtocol: function (
    url: ParsedUrl,
    options: ForceProtocolOptions = {protocol: 'https'}
  ): ParsedUrl {
    url.protocol = options.protocol;
    return url;
  },

  StripAnchor: function (url: ParsedUrl): ParsedUrl {
    url.hash = '';
    return url;
  },
  StripAuthentication: function (url: ParsedUrl): ParsedUrl {
    url.username = '';
    url.password = '';
    return url;
  },
  StripPort: function (url: ParsedUrl): ParsedUrl {
    url.port = '';
    return url;
  },
  StripQueryParams: function (
    url: ParsedUrl,
    options: Partial<StripQueryParamOptions> = {}
  ): ParsedUrl {
    options = {
      strippedQueryParams: /^[utm_\s+|src|referrer]/,
      ...options,
    };

    const stripList = RegExpFromStringMatch(options.strippedQueryParams);
    url.searchParams.forEach((value: string, name: string) => {
      if (stripList.test(name)) url.searchParams.delete(name);
    });
    return url;
  },
  StripSubdomains: function (
    url: ParsedUrl,
    options: Partial<StripSubdomainOptions> = {}
  ): ParsedUrl {
    options = {
      strippedSubdomains: /^ww[w0-9]+/,
      ...options,
    };

    const stripList = RegExpFromStringMatch(options.strippedSubdomains);
    if (stripList.test(url.subdomain)) url.subdomain = '';
    return url;
  },
  StripTrailingSlash: function (url: ParsedUrl): ParsedUrl {
    if (url.pathname.endsWith('/')) {
      url.pathname = url.pathname.substring(0, url.pathname.length - 1);
    }
    return url;
  },

  SortQueryParams: function (url: ParsedUrl): ParsedUrl {
    url.searchParams.sort();
    return url;
  },
};

export {UrlMutator, Mutators};
