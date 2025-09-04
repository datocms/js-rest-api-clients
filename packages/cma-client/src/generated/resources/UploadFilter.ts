import * as Utils from '@datocms/rest-client-utils';
import BaseResource from '../../BaseResource';
import type * as ApiTypes from '../ApiTypes';
import type * as RawApiTypes from '../RawApiTypes';

export default class UploadFilter extends BaseResource {
  static readonly TYPE = 'upload_filter' as const;

  /**
   * Create a new filter
   *
   * Read more: https://www.datocms.com/docs/content-management-api/resources/upload-filter/create
   *
   * @throws {ApiError}
   * @throws {TimeoutError}
   */
  create(body: ApiTypes.UploadFilterCreateSchema) {
    return this.rawCreate(
      Utils.serializeRequestBody<RawApiTypes.UploadFilterCreateSchema>(body, {
        type: 'upload_filter',
        attributes: ['name', 'filter', 'shared'],
        relationships: [],
      }),
    ).then((body) =>
      Utils.deserializeResponseBody<ApiTypes.UploadFilterCreateTargetSchema>(
        body,
      ),
    );
  }

  /**
   * Create a new filter
   *
   * Read more: https://www.datocms.com/docs/content-management-api/resources/upload-filter/create
   *
   * @throws {ApiError}
   * @throws {TimeoutError}
   */
  rawCreate(
    body: RawApiTypes.UploadFilterCreateSchema,
  ): Promise<RawApiTypes.UploadFilterCreateTargetSchema> {
    return this.client.request<RawApiTypes.UploadFilterCreateTargetSchema>({
      method: 'POST',
      url: '/upload-filters',
      body,
    });
  }

  /**
   * Update a filter
   *
   * Read more: https://www.datocms.com/docs/content-management-api/resources/upload-filter/update
   *
   * @throws {ApiError}
   * @throws {TimeoutError}
   */
  update(
    uploadFilterId: string | ApiTypes.UploadFilterData,
    body: ApiTypes.UploadFilterUpdateSchema,
  ) {
    return this.rawUpdate(
      Utils.toId(uploadFilterId),
      Utils.serializeRequestBody<RawApiTypes.UploadFilterUpdateSchema>(body, {
        id: Utils.toId(uploadFilterId),
        type: 'upload_filter',
        attributes: ['name', 'shared', 'filter'],
        relationships: [],
      }),
    ).then((body) =>
      Utils.deserializeResponseBody<ApiTypes.UploadFilterUpdateTargetSchema>(
        body,
      ),
    );
  }

  /**
   * Update a filter
   *
   * Read more: https://www.datocms.com/docs/content-management-api/resources/upload-filter/update
   *
   * @throws {ApiError}
   * @throws {TimeoutError}
   */
  rawUpdate(
    uploadFilterId: string,
    body: RawApiTypes.UploadFilterUpdateSchema,
  ): Promise<RawApiTypes.UploadFilterUpdateTargetSchema> {
    return this.client.request<RawApiTypes.UploadFilterUpdateTargetSchema>({
      method: 'PUT',
      url: `/upload-filters/${uploadFilterId}`,
      body,
    });
  }

  /**
   * List all filters
   *
   * Read more: https://www.datocms.com/docs/content-management-api/resources/upload-filter/instances
   *
   * @throws {ApiError}
   * @throws {TimeoutError}
   */
  list() {
    return this.rawList().then((body) =>
      Utils.deserializeResponseBody<ApiTypes.UploadFilterInstancesTargetSchema>(
        body,
      ),
    );
  }

  /**
   * List all filters
   *
   * Read more: https://www.datocms.com/docs/content-management-api/resources/upload-filter/instances
   *
   * @throws {ApiError}
   * @throws {TimeoutError}
   */
  rawList(): Promise<RawApiTypes.UploadFilterInstancesTargetSchema> {
    return this.client.request<RawApiTypes.UploadFilterInstancesTargetSchema>({
      method: 'GET',
      url: '/upload-filters',
    });
  }

  /**
   * Retrieve a filter
   *
   * Read more: https://www.datocms.com/docs/content-management-api/resources/upload-filter/self
   *
   * @throws {ApiError}
   * @throws {TimeoutError}
   */
  find(uploadFilterId: string | ApiTypes.UploadFilterData) {
    return this.rawFind(Utils.toId(uploadFilterId)).then((body) =>
      Utils.deserializeResponseBody<ApiTypes.UploadFilterSelfTargetSchema>(
        body,
      ),
    );
  }

  /**
   * Retrieve a filter
   *
   * Read more: https://www.datocms.com/docs/content-management-api/resources/upload-filter/self
   *
   * @throws {ApiError}
   * @throws {TimeoutError}
   */
  rawFind(
    uploadFilterId: string,
  ): Promise<RawApiTypes.UploadFilterSelfTargetSchema> {
    return this.client.request<RawApiTypes.UploadFilterSelfTargetSchema>({
      method: 'GET',
      url: `/upload-filters/${uploadFilterId}`,
    });
  }

  /**
   * Delete a filter
   *
   * Read more: https://www.datocms.com/docs/content-management-api/resources/upload-filter/destroy
   *
   * @throws {ApiError}
   * @throws {TimeoutError}
   */
  destroy(uploadFilterId: string | ApiTypes.UploadFilterData) {
    return this.rawDestroy(Utils.toId(uploadFilterId)).then((body) =>
      Utils.deserializeResponseBody<ApiTypes.UploadFilterDestroyTargetSchema>(
        body,
      ),
    );
  }

  /**
   * Delete a filter
   *
   * Read more: https://www.datocms.com/docs/content-management-api/resources/upload-filter/destroy
   *
   * @throws {ApiError}
   * @throws {TimeoutError}
   */
  rawDestroy(
    uploadFilterId: string,
  ): Promise<RawApiTypes.UploadFilterDestroyTargetSchema> {
    return this.client.request<RawApiTypes.UploadFilterDestroyTargetSchema>({
      method: 'DELETE',
      url: `/upload-filters/${uploadFilterId}`,
    });
  }
}
