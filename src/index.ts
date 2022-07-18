export {ParsedUrl} from './parsed-url';
export {UrlMutator, Mutators} from './mutations';
export {UrlFilter, Filters} from './filters';
export {ParsedUrlSet} from './parsed-url-set';

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
