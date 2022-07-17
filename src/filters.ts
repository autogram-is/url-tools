import {ParsedUrl} from './parsed-url';

export type UrlFilter = (
  url: ParsedUrl,
  options?: Record<string, unknown>
) => boolean;
