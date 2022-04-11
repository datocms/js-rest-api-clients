import BaseResource from '../BaseResource';
import serializeRequestBody from '../../serializeRequestBody';
import deserializeResponseBody from '../../deserializeResponseBody';
import toId from '../../toId';
import * as SchemaTypes from '../SchemaTypes';
import * as SimpleSchemaTypes from '../SimpleSchemaTypes';

export default class UploadTag extends BaseResource {
  static readonly TYPE: 'upload_tag' = 'upload_tag';

  /**
   * List all manually created upload tags
   *
   * Read more: https://www.datocms.com/docs/content-management-api/resources/upload-tag/instances
   */
  list(queryParams?: SimpleSchemaTypes.UploadTagInstancesHrefSchema) {
    return this.rawList(queryParams).then((body) =>
      deserializeResponseBody<SimpleSchemaTypes.UploadTagInstancesTargetSchema>(
        body,
      ),
    );
  }

  /**
   * List all manually created upload tags
   *
   * Read more: https://www.datocms.com/docs/content-management-api/resources/upload-tag/instances
   */
  rawList(
    queryParams?: SchemaTypes.UploadTagInstancesHrefSchema,
  ): Promise<SchemaTypes.UploadTagInstancesTargetSchema> {
    return this.client.request<SchemaTypes.UploadTagInstancesTargetSchema>({
      method: 'GET',
      url: `/upload-tags`,
      queryParams,
    });
  }

  /**
   * Create a new upload tag
   *
   * Read more: https://www.datocms.com/docs/content-management-api/resources/upload-tag/create
   */
  create(body: SimpleSchemaTypes.UploadTagCreateSchema) {
    return this.rawCreate(
      serializeRequestBody<SchemaTypes.UploadTagCreateSchema>({
        body,
        type: UploadTag.TYPE,
      }),
    ).then((body) =>
      deserializeResponseBody<SimpleSchemaTypes.UploadTagCreateTargetSchema>(
        body,
      ),
    );
  }

  /**
   * Create a new upload tag
   *
   * Read more: https://www.datocms.com/docs/content-management-api/resources/upload-tag/create
   */
  rawCreate(
    body: SchemaTypes.UploadTagCreateSchema,
  ): Promise<SchemaTypes.UploadTagCreateTargetSchema> {
    return this.client.request<SchemaTypes.UploadTagCreateTargetSchema>({
      method: 'POST',
      url: `/upload-tags`,
      body,
    });
  }
}
