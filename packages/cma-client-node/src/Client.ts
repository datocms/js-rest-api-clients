import {
  Client as BaseClient,
  type ClientConfigOptions,
} from '@datocms/cma-client';
import * as Resources from './generated/resources';

export class Client extends BaseClient {
  uploads: Resources.Upload;

  constructor(config: ClientConfigOptions) {
    super(config);
    this.uploads = new Resources.Upload(this);
  }
}
