import * as Utils from '@datocms/rest-client-utils';
import * as SchemaTypes from '../SchemaTypes';
import * as SimpleSchemaTypes from '../SimpleSchemaTypes';
import BaseResource from '../../BaseResource';

export default class Session extends BaseResource {
  static readonly TYPE: 'session' = 'session';

  /**
   * Create a new session
   */
  create(body: SimpleSchemaTypes.SessionCreateSchema) {
    return this.rawCreate(
      Utils.serializeRequestBody<SchemaTypes.SessionCreateSchema>({
        body,
        type: Session.TYPE,
      }),
    ).then((body) =>
      Utils.deserializeResponseBody<SimpleSchemaTypes.SessionCreateTargetSchema>(
        body,
      ),
    );
  }

  /**
   * Create a new session
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
