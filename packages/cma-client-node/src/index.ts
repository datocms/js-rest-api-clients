export * from './Client';
export * from './buildClient';
export * from './utils/uploadLocalFileAndReturnPath';
export * from './UploadResource';
export * from './utils/uploadLocalFileToS3';

export { uploadLocalFileAndReturnPath } from './utils/uploadLocalFileAndReturnPath';
export { downloadFile } from './utils/downloadFile';

export {
  SchemaTypes,
  SimpleSchemaTypes,
  Resources,
  buildBlockRecord,
  buildClient as buildBaseClient,
  ApiError,
  LogLevel,
  Client as BaseClient,
} from '@datocms/cma-client';

export type { ClientConfigOptions } from '@datocms/cma-client';

export { CanceledPromiseError } from '@datocms/rest-client-utils';

export type { CancelablePromise } from '@datocms/rest-client-utils';
