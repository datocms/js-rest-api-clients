import * as Utils from '@datocms/rest-client-utils';
import BaseResource from '../../BaseResource';
import type * as ApiTypes from '../ApiTypes';
import type * as RawApiTypes from '../RawApiTypes';

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
  create(body: ApiTypes.UploadRequestCreateSchema) {
    return this.rawCreate(
      Utils.serializeRequestBody<RawApiTypes.UploadRequestCreateSchema>(body, {
        type: 'upload_request',
        attributes: ['filename'],
        relationships: ['upload_collection'],
      }),
    ).then((body) =>
      Utils.deserializeResponseBody<ApiTypes.UploadRequestCreateTargetSchema>(
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
    body: RawApiTypes.UploadRequestCreateSchema,
  ): Promise<RawApiTypes.UploadRequestCreateTargetSchema> {
    return this.client.request<RawApiTypes.UploadRequestCreateTargetSchema>({
      method: 'POST',
      url: '/upload-requests',
      body,
    });
  }
}
