import * as Utils from '@datocms/rest-client-utils';
import BaseResource from '../../BaseResource';
import type * as SchemaTypes from '../SchemaTypes';
import type * as SimpleSchemaTypes from '../SimpleSchemaTypes';

export default class UploadTrack extends BaseResource {
  static readonly TYPE = 'upload_track' as const;

  /**
   * Create a new upload track
   *
   * Read more: https://www.datocms.com/docs/content-management-api/resources/upload-track/create
   *
   * @throws {ApiError}
   * @throws {TimeoutError}
   */
  create(
    uploadId: string | SimpleSchemaTypes.UploadData,
    body: SimpleSchemaTypes.UploadTrackCreateSchema,
  ) {
    return this.rawCreate(
      Utils.toId(uploadId),
      Utils.serializeRequestBody<SchemaTypes.UploadTrackCreateSchema>(body, {
        type: 'upload_track',
        attributes: [
          'url_or_upload_request_id',
          'type',
          'name',
          'language_code',
          'closed_captions',
        ],
        relationships: [],
      }),
    ).then((body) =>
      Utils.deserializeResponseBody<SimpleSchemaTypes.UploadTrackCreateJobSchema>(
        body,
      ),
    );
  }

  /**
   * Create a new upload track
   *
   * Read more: https://www.datocms.com/docs/content-management-api/resources/upload-track/create
   *
   * @throws {ApiError}
   * @throws {TimeoutError}
   */
  rawCreate(
    uploadId: string,
    body: SchemaTypes.UploadTrackCreateSchema,
  ): Promise<SchemaTypes.UploadTrackCreateJobSchema> {
    return this.client.request<SchemaTypes.UploadTrackCreateJobSchema>({
      method: 'POST',
      url: `/uploads/${uploadId}/tracks`,
      body,
    });
  }

  /**
   * List upload tracks
   *
   * Read more: https://www.datocms.com/docs/content-management-api/resources/upload-track/instances
   *
   * @throws {ApiError}
   * @throws {TimeoutError}
   */
  list(uploadId: string | SimpleSchemaTypes.UploadData) {
    return this.rawList(Utils.toId(uploadId)).then((body) =>
      Utils.deserializeResponseBody<SimpleSchemaTypes.UploadTrackInstancesTargetSchema>(
        body,
      ),
    );
  }

  /**
   * List upload tracks
   *
   * Read more: https://www.datocms.com/docs/content-management-api/resources/upload-track/instances
   *
   * @throws {ApiError}
   * @throws {TimeoutError}
   */
  rawList(
    uploadId: string,
  ): Promise<SchemaTypes.UploadTrackInstancesTargetSchema> {
    return this.client.request<SchemaTypes.UploadTrackInstancesTargetSchema>({
      method: 'GET',
      url: `/uploads/${uploadId}/tracks`,
    });
  }

  /**
   * Delete an upload track
   *
   * Read more: https://www.datocms.com/docs/content-management-api/resources/upload-track/destroy
   *
   * @throws {ApiError}
   * @throws {TimeoutError}
   */
  destroy(
    uploadId: string | SimpleSchemaTypes.UploadData,
    uploadTrackId: string | SimpleSchemaTypes.UploadTrackData,
  ) {
    return this.rawDestroy(
      Utils.toId(uploadId),
      Utils.toId(uploadTrackId),
    ).then((body) =>
      Utils.deserializeResponseBody<SimpleSchemaTypes.UploadTrackDestroyJobSchema>(
        body,
      ),
    );
  }

  /**
   * Delete an upload track
   *
   * Read more: https://www.datocms.com/docs/content-management-api/resources/upload-track/destroy
   *
   * @throws {ApiError}
   * @throws {TimeoutError}
   */
  rawDestroy(
    uploadId: string,
    uploadTrackId: string,
  ): Promise<SchemaTypes.UploadTrackDestroyJobSchema> {
    return this.client.request<SchemaTypes.UploadTrackDestroyJobSchema>({
      method: 'DELETE',
      url: `/uploads/${uploadId}/tracks/${uploadTrackId}`,
    });
  }

  /**
   * Automatically generate a subtitles track
   *
   * Read more: https://www.datocms.com/docs/content-management-api/resources/upload-track/generate_subtitles
   *
   * @throws {ApiError}
   * @throws {TimeoutError}
   *
   * @deprecated This API call is to be considered private and might change without notice
   */
  generateSubtitles(
    uploadId: string | SimpleSchemaTypes.UploadData,
    body: SimpleSchemaTypes.UploadTrackGenerateSubtitlesSchema,
  ) {
    return this.rawGenerateSubtitles(
      Utils.toId(uploadId),
      Utils.serializeRequestBody<SchemaTypes.UploadTrackGenerateSubtitlesSchema>(
        body,
        {
          type: 'upload_track',
          attributes: ['name', 'language_code'],
          relationships: [],
        },
      ),
    ).then((body) =>
      Utils.deserializeResponseBody<SimpleSchemaTypes.UploadTrackGenerateSubtitlesJobSchema>(
        body,
      ),
    );
  }

  /**
   * Automatically generate a subtitles track
   *
   * Read more: https://www.datocms.com/docs/content-management-api/resources/upload-track/generate_subtitles
   *
   * @throws {ApiError}
   * @throws {TimeoutError}
   *
   * @deprecated This API call is to be considered private and might change without notice
   */
  rawGenerateSubtitles(
    uploadId: string,
    body: SchemaTypes.UploadTrackGenerateSubtitlesSchema,
  ): Promise<SchemaTypes.UploadTrackGenerateSubtitlesJobSchema> {
    return this.client.request<SchemaTypes.UploadTrackGenerateSubtitlesJobSchema>(
      {
        method: 'POST',
        url: `/uploads/${uploadId}/tracks/generate-subtitles`,
        body,
      },
    );
  }
}
