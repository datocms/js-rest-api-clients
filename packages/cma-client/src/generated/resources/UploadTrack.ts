import * as Utils from '@datocms/rest-client-utils';
import BaseResource from '../../BaseResource';
import type * as ApiTypes from '../ApiTypes';
import type * as RawApiTypes from '../RawApiTypes';

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
    uploadId: string | ApiTypes.UploadData,
    body: ApiTypes.UploadTrackCreateSchema,
  ) {
    return this.rawCreate(
      Utils.toId(uploadId),
      Utils.serializeRequestBody<RawApiTypes.UploadTrackCreateSchema>(body, {
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
      Utils.deserializeResponseBody<ApiTypes.UploadTrackCreateJobSchema>(body),
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
    body: RawApiTypes.UploadTrackCreateSchema,
  ): Promise<RawApiTypes.UploadTrackCreateJobSchema> {
    return this.client.request<RawApiTypes.UploadTrackCreateJobSchema>({
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
  list(uploadId: string | ApiTypes.UploadData) {
    return this.rawList(Utils.toId(uploadId)).then((body) =>
      Utils.deserializeResponseBody<ApiTypes.UploadTrackInstancesTargetSchema>(
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
  ): Promise<RawApiTypes.UploadTrackInstancesTargetSchema> {
    return this.client.request<RawApiTypes.UploadTrackInstancesTargetSchema>({
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
    uploadId: string | ApiTypes.UploadData,
    uploadTrackId: string | ApiTypes.UploadTrackData,
  ) {
    return this.rawDestroy(
      Utils.toId(uploadId),
      Utils.toId(uploadTrackId),
    ).then((body) =>
      Utils.deserializeResponseBody<ApiTypes.UploadTrackDestroyJobSchema>(body),
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
  ): Promise<RawApiTypes.UploadTrackDestroyJobSchema> {
    return this.client.request<RawApiTypes.UploadTrackDestroyJobSchema>({
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
    uploadId: string | ApiTypes.UploadData,
    body: ApiTypes.UploadTrackGenerateSubtitlesSchema,
  ) {
    return this.rawGenerateSubtitles(
      Utils.toId(uploadId),
      Utils.serializeRequestBody<RawApiTypes.UploadTrackGenerateSubtitlesSchema>(
        body,
        {
          type: 'upload_track',
          attributes: ['name', 'language_code'],
          relationships: [],
        },
      ),
    ).then((body) =>
      Utils.deserializeResponseBody<ApiTypes.UploadTrackGenerateSubtitlesJobSchema>(
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
    body: RawApiTypes.UploadTrackGenerateSubtitlesSchema,
  ): Promise<RawApiTypes.UploadTrackGenerateSubtitlesJobSchema> {
    return this.client.request<RawApiTypes.UploadTrackGenerateSubtitlesJobSchema>(
      {
        method: 'POST',
        url: `/uploads/${uploadId}/tracks/generate-subtitles`,
        body,
      },
    );
  }
}
