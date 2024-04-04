import * as Utils from '@datocms/rest-client-utils';
import BaseResource from '../../BaseResource';
import type * as SchemaTypes from '../SchemaTypes';
import type * as SimpleSchemaTypes from '../SimpleSchemaTypes';

export default class PublicInfo extends BaseResource {
  static readonly TYPE = 'public_info' as const;

  /**
   * Retrieve public site info
   *
   * Read more: https://www.datocms.com/docs/content-management-api/resources/public-info/self
   *
   * @throws {ApiError}
   * @throws {TimeoutError}
   */
  find() {
    return this.rawFind().then((body) =>
      Utils.deserializeResponseBody<SimpleSchemaTypes.PublicInfoSelfTargetSchema>(
        body,
      ),
    );
  }

  /**
   * Retrieve public site info
   *
   * Read more: https://www.datocms.com/docs/content-management-api/resources/public-info/self
   *
   * @throws {ApiError}
   * @throws {TimeoutError}
   */
  rawFind(): Promise<SchemaTypes.PublicInfoSelfTargetSchema> {
    return this.client.request<SchemaTypes.PublicInfoSelfTargetSchema>({
      method: 'GET',
      url: '/public-info',
    });
  }
}
