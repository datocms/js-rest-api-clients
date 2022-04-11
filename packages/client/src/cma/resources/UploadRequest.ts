import BaseResource from '../BaseResource';
import serializeRequestBody from '../../serializeRequestBody';
import deserializeResponseBody from '../../deserializeResponseBody';
import toId from '../../toId';
import * as SchemaTypes from '../SchemaTypes';
import * as SimpleSchemaTypes from '../SimpleSchemaTypes';

export default class UploadRequest extends BaseResource {
  static readonly TYPE: 'upload_request' = 'upload_request';

  /**
   * Request a new upload
   *
   * Read more: https://www.datocms.com/docs/content-management-api/resources/upload-request/create
   */
  create(body: SimpleSchemaTypes.UploadRequestCreateSchema) {
    return this.rawCreate(
      serializeRequestBody<SchemaTypes.UploadRequestCreateSchema>({
        body,
        type: UploadRequest.TYPE,
      }),
    ).then((body) =>
      deserializeResponseBody<SimpleSchemaTypes.UploadRequestCreateTargetSchema>(
        body,
      ),
    );
  }

  /**
   * Request a new upload
   *
   * Read more: https://www.datocms.com/docs/content-management-api/resources/upload-request/create
   */
  rawCreate(
    body: SchemaTypes.UploadRequestCreateSchema,
  ): Promise<SchemaTypes.UploadRequestCreateTargetSchema> {
    return this.client.request<SchemaTypes.UploadRequestCreateTargetSchema>({
      method: 'POST',
      url: `/upload-requests`,
      body,
    });
  }
}
