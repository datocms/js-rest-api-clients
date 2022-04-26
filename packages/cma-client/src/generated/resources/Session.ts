import * as Utils from '@datocms/rest-client-utils';
import * as SchemaTypes from '../SchemaTypes';
import * as SimpleSchemaTypes from '../SimpleSchemaTypes';
import BaseResource from '../../BaseResource';

export default class Session extends BaseResource {
  static readonly TYPE: 'session' = 'session';

  /**
   * Create a new session
   *
   * Read more: https://www.datocms.com/docs/content-management-api/resources/session/create
   *
   * @deprecated This API call is to be considered private and might change without notice
   */
  create(body: SimpleSchemaTypes.SessionCreateSchema) {
    return this.rawCreate(
      Utils.serializeRequestBody<SchemaTypes.SessionCreateSchema>(body, {
        type: 'email_credentials',
        attributes: ['email', 'password', 'otp_code'],
        relationships: [],
      }),
    ).then((body) =>
      Utils.deserializeResponseBody<SimpleSchemaTypes.SessionCreateTargetSchema>(
        body,
      ),
    );
  }

  /**
   * Create a new session
   *
   * Read more: https://www.datocms.com/docs/content-management-api/resources/session/create
   *
   * @deprecated This API call is to be considered private and might change without notice
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
