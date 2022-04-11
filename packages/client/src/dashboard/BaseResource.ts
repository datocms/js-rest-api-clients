import { Client } from './Client';

export default class BaseResult {
  client: Client;

  constructor(client: Client) {
    this.client = client;
  }
}
