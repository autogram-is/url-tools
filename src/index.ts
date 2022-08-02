export {UrlMutator, UrlMutators} from './mutations';
export {UrlFilter, UrlFilters} from './filters';
export {ParsedUrl} from './parsed-url';
export {UrlSet, ParsedUrlSet, NormalizedUrlSet} from './url-set';
export {NormalizedUrl} from './normalized-url';

export type StringMatch = string | string[] | RegExp;
export const RegExpFromStringMatch = function (
  pattern: StringMatch | unknown
): RegExp {
  if (typeof pattern === 'string') {
    return new RegExp(pattern);
  } else if (Array.isArray(pattern)) {
    return new RegExp('[' + pattern.join('|') + ']');
  } else if (pattern instanceof RegExp) {
    return pattern;
  } else {
    return /$.^/;
  }
};
