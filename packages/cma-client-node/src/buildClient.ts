import { ClientConfigOptions } from '@datocms/cma-client';
import { Client } from './Client';

export function buildClient(config: ClientConfigOptions) {
  return new Client(config);
}
