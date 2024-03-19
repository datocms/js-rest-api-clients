import * as Utils from '@datocms/rest-client-utils';
import BaseResource from '../../BaseResource';
import * as SchemaTypes from '../SchemaTypes';
import * as SimpleSchemaTypes from '../SimpleSchemaTypes';

export default class Session extends BaseResource {
  static readonly TYPE = 'session' as const;

  /**
   * Create a new session
   *
   * @throws {ApiError}
   * @throws {TimeoutError}
   */
  rawCreate(
    body: SchemaTypes.SessionCreateSchema,
  ): Promise<SchemaTypes.SessionCreateTargetSchema> {
    return this.client.request<SchemaTypes.SessionCreateTargetSchema>({
      method: 'POST',
      url: '/sessions',
      body,
    });
  }
}
