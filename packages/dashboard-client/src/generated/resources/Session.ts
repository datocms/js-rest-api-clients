import * as Utils from '@datocms/rest-client-utils';
import * as SchemaTypes from '../SchemaTypes';
import * as SimpleSchemaTypes from '../SimpleSchemaTypes';
import BaseResource from '../../BaseResource';

export default class Session extends BaseResource {
  static readonly TYPE: 'session' = 'session';

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
      url: `/sessions`,
      body,
    });
  }
}
