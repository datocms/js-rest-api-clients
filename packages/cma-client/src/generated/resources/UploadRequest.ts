import * as Utils from '@datocms/rest-client-utils';
import * as SchemaTypes from '../SchemaTypes';
import * as SimpleSchemaTypes from '../SimpleSchemaTypes';
import BaseResource from '../../BaseResource';

export default class UploadRequest extends BaseResource {
  static readonly TYPE: 'upload_request' = 'upload_request';

  /**
   * Request a new upload
   *
   * Read more: https://www.datocms.com/docs/content-management-api/resources/upload-request/create
   */
  create(body: SimpleSchemaTypes.UploadRequestCreateSchema) {
    return this.rawCreate(
      Utils.serializeRequestBody<SchemaTypes.UploadRequestCreateSchema>(body, {
        type: 'upload_request',
        attributes: ['filename'],
        relationships: [],
      }),
    ).then((body) =>
      Utils.deserializeResponseBody<SimpleSchemaTypes.UploadRequestCreateTargetSchema>(
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
