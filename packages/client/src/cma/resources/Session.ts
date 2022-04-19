import BaseResource from '../BaseResource';
import { serializeRequestBody } from '../../serialize';
import {
  deserializeResponseBody,
  deserializeJsonEntity,
} from '../../deserialize';
import toId from '../../toId';
import * as SchemaTypes from '../SchemaTypes';
import * as SimpleSchemaTypes from '../SimpleSchemaTypes';
import { IteratorOptions, rawPageIterator } from '../../rawPageIterator';

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
      serializeRequestBody<SchemaTypes.SessionCreateSchema>({
        body,
        type: Session.TYPE,
      }),
    ).then((body) =>
      deserializeResponseBody<SimpleSchemaTypes.SessionCreateTargetSchema>(
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
