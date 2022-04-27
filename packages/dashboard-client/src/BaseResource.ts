import { Client } from './generated/Client';

export default class BaseResource {
  protected client: Client;

  constructor(client: Client) {
    this.client = client;
  }
}
