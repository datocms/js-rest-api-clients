import type { Client } from './generated/Client.js';

export default class BaseResource {
  protected client: Client;

  constructor(client: Client) {
    this.client = client;
  }
}
