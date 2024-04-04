import { Client, type ClientConfigOptions } from './generated/Client';

export function buildClient(config: ClientConfigOptions) {
  return new Client(config);
}
