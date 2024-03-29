export * from './Client';
export * from './buildClient';
export * from './utils/uploadLocalFileAndReturnPath';
export * from './utils/uploadLocalFileToS3';

export { uploadLocalFileAndReturnPath } from './utils/uploadLocalFileAndReturnPath';
export { downloadFile } from './utils/downloadFile';

export {
  SchemaTypes,
  SimpleSchemaTypes,
  buildBlockRecord,
  generateId,
  buildClient as buildBaseClient,
  ApiError,
  LogLevel,
  Client as BaseClient,
} from '@datocms/cma-client';

export * as Resources from './generated/resources';

export type { ClientConfigOptions } from '@datocms/cma-client';

export { CanceledPromiseError } from '@datocms/rest-client-utils';

export type { CancelablePromise } from '@datocms/rest-client-utils';
