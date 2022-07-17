import {ParsedUrl} from './parsed-url';

export type UrlMutator = (
  url: ParsedUrl,
  options?: Record<string, unknown>
) => ParsedUrl;
