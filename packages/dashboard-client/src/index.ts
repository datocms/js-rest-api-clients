export { ApiError, LogLevel, TimeoutError } from '@datocms/rest-client-utils';
export * from './buildClient.js';
export { Client } from './generated/Client.js';
export type { ClientConfigOptions } from './generated/Client.js';
export * as Resources from './generated/resources/index.js';
export type { ApiTypes, RawApiTypes };
// Legacy names
export type { ApiTypes as SimpleSchemaTypes, RawApiTypes as SchemaTypes };

import type * as ApiTypes from './generated/ApiTypes.js';
import type * as RawApiTypes from './generated/RawApiTypes.js';
