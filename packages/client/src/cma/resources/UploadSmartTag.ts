import BaseResource from '../BaseResource';
import serializeRequestBody from '../../serializeRequestBody';
import deserializeResponseBody from '../../deserializeResponseBody';
import toId from '../../toId';
import * as SchemaTypes from '../SchemaTypes';
import * as SimpleSchemaTypes from '../SimpleSchemaTypes';

export default class UploadSmartTag extends BaseResource {
  static readonly TYPE: 'upload_smart_tag' = 'upload_smart_tag';

  /**
   * List all automatically created upload tags
   *
   * Read more: https://www.datocms.com/docs/content-management-api/resources/upload-smart_tag/instances
   */
  list(queryParams?: SimpleSchemaTypes.UploadSmartTagInstancesHrefSchema) {
    return this.rawList(queryParams).then((body) =>
      deserializeResponseBody<SimpleSchemaTypes.UploadSmartTagInstancesTargetSchema>(
        body,
      ),
    );
  }

  /**
   * List all automatically created upload tags
   *
   * Read more: https://www.datocms.com/docs/content-management-api/resources/upload-smart_tag/instances
   */
  rawList(
    queryParams?: SchemaTypes.UploadSmartTagInstancesHrefSchema,
  ): Promise<SchemaTypes.UploadSmartTagInstancesTargetSchema> {
    return this.client.request<SchemaTypes.UploadSmartTagInstancesTargetSchema>(
      {
        method: 'GET',
        url: `/upload-smart-tags`,
        queryParams,
      },
    );
  }
}
