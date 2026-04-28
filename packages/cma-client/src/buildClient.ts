import { Client, type ClientConfigOptions } from './generated/Client.js';

export function buildClient(config: ClientConfigOptions) {
  return new Client(config);
}
