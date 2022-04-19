import { Client } from './generated/Client';

export default class BaseResource {
  client: Client;

  constructor(client: Client) {
    this.client = client;
  }
}
