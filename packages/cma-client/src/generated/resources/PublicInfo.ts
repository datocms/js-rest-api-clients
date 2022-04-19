import * as Utils from '@datocms/rest-client-utils';
import * as SchemaTypes from '../SchemaTypes';
import * as SimpleSchemaTypes from '../SimpleSchemaTypes';
import BaseResource from '../../BaseResource';

export default class PublicInfo extends BaseResource {
  static readonly TYPE: 'public_info' = 'public_info';

  /**
   * Retrieve public site info
   *
   * Read more: https://www.datocms.com/docs/content-management-api/resources/public-info/self
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
   */
  rawFind(): Promise<SchemaTypes.PublicInfoSelfTargetSchema> {
    return this.client.request<SchemaTypes.PublicInfoSelfTargetSchema>({
      method: 'GET',
      url: `/public-info`,
    });
  }
}
