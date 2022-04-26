import { Client as BaseClient, ClientConfigOptions } from '@datocms/cma-client';

export class Client extends BaseClient {
  constructor(config: ClientConfigOptions) {
    super(config);
  }
}

export function buildClient(config: ClientConfigOptions) {
  return new Client(config);
}
