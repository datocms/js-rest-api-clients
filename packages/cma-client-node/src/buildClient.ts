import { ClientConfigOptions } from '@datocms/cma-client';
import { Client } from './Client';
import { fetch as ponyfillFetch } from '@whatwg-node/fetch';

const fetchFn = typeof fetch === 'undefined' ? ponyfillFetch : fetch;

export function buildClient(config: ClientConfigOptions) {
  return new Client({ ...config, fetchFn });
}
