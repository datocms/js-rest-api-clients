import type { ClientConfigOptions } from '@datocms/cma-client';
import { Client } from './Client.js';

export function buildClient(config: ClientConfigOptions) {
  return new Client(config);
}
