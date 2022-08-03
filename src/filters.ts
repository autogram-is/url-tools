import {ParsedUrl} from './parsed-url';
import {RegExpFromStringMatch, StringMatch} from './index';

type UrlFilter = (url: ParsedUrl, options?: Record<string, unknown>) => boolean;

type MatchesPatternOptions = {pattern: StringMatch; property: string};

const Filters = {
  IsWebProtocol: function (url: ParsedUrl): boolean {
    const webProtocols = ['http:', 'https:'];
    return webProtocols.includes(url.protocol);
  },
  IsAuthenticated: function (url: ParsedUrl): boolean {
    return (url.username + url.password).length > 0;
  },
  HasPublicSuffix: function (url: ParsedUrl): boolean {
    return url.publicSuffix.length > 0;
  },
  MatchesPattern: function (
    url: ParsedUrl,
    options: Partial<MatchesPatternOptions> = {}
  ): boolean {
    options = {
      pattern: [],
      property: 'href',
      ...options,
    };

    if (options.property && options.property in url) {
      const match = RegExpFromStringMatch(options.pattern);
      return match.test(url.properties[options.property].toString());
    } else {
      return false;
    }
  },
};

export {UrlFilter, Filters};
