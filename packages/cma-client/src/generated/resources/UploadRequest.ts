import * as Utils from '@datocms/rest-client-utils';
import BaseResource from '../../BaseResource';
import type * as SchemaTypes from '../SchemaTypes';
import type * as SimpleSchemaTypes from '../SimpleSchemaTypes';

export default class UploadRequest extends BaseResource {
  static readonly TYPE = 'upload_request' as const;

  /**
   * Request a new permission to upload a file
   *
   * Read more: https://www.datocms.com/docs/content-management-api/resources/upload-request/create
   *
   * @throws {ApiError}
   * @throws {TimeoutError}
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
   * Request a new permission to upload a file
   *
   * Read more: https://www.datocms.com/docs/content-management-api/resources/upload-request/create
   *
   * @throws {ApiError}
   * @throws {TimeoutError}
   */
  rawCreate(
    body: SchemaTypes.UploadRequestCreateSchema,
  ): Promise<SchemaTypes.UploadRequestCreateTargetSchema> {
    return this.client.request<SchemaTypes.UploadRequestCreateTargetSchema>({
      method: 'POST',
      url: '/upload-requests',
      body,
    });
  }
}
