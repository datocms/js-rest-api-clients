export * from './Client';
export * from './buildClient';
export * from './uploadLocalFileAndReturnPath';
export * from './UploadResource';
export * from './utils/uploadLocalFileToS3';

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