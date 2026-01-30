export { ApiError, LogLevel, TimeoutError } from '@datocms/rest-client-utils';
export * from './buildClient';
export { Client } from './generated/Client';
export type { ClientConfigOptions } from './generated/Client';
export * as Resources from './generated/resources';
export type { ApiTypes, RawApiTypes };
// Legacy names
export type { ApiTypes as SimpleSchemaTypes, RawApiTypes as SchemaTypes };

import type * as ApiTypes from './generated/ApiTypes';
import type * as RawApiTypes from './generated/RawApiTypes';
