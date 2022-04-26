import { Client as BaseClient, ClientConfigOptions } from '@datocms/cma-client';
import { UploadResource } from './UploadResource';
export class Client extends BaseClient {
  uploads: UploadResource;

  constructor(config: ClientConfigOptions) {
    super(config);
    this.uploads = new UploadResource(this);
  }
}
