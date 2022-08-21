export { UrlMutator, UrlMutators } from './mutations.js';
export { UrlFilter, UrlFilters } from './filters.js';
export { ParsedUrl } from './parsed-url.js';
export { UrlSet, ParsedUrlSet, NormalizedUrlSet } from './url-set.js';
export { NormalizedUrl } from './normalized-url.js';

export type StringMatch = string | string[] | RegExp;
export const regExpFromStringMatch = function (
  pattern: StringMatch
): RegExp {
  if (typeof pattern === 'string') {
    return new RegExp(pattern);
  }

  if (Array.isArray(pattern)) {
    return new RegExp('[' + pattern.join('|') + ']');
  }

  if (pattern instanceof RegExp) {
    return pattern;
  }

  return /$.^/;
};
