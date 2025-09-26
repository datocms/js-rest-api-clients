import * as Utils from '@datocms/rest-client-utils';
import BaseResource from '../../BaseResource';
import type * as ApiTypes from '../ApiTypes';
import type * as RawApiTypes from '../RawApiTypes';

export default class UploadCollection extends BaseResource {
  static readonly TYPE = 'upload_collection' as const;

  /**
   * Create a new upload collection
   *
   * Read more: https://www.datocms.com/docs/content-management-api/resources/upload-collection/create
   *
   * @throws {ApiError}
   * @throws {TimeoutError}
   */
  create(body: ApiTypes.UploadCollectionCreateSchema) {
    return this.rawCreate(
      Utils.serializeRequestBody<RawApiTypes.UploadCollectionCreateSchema>(
        body,
        {
          type: 'upload_collection',
          attributes: ['label', 'position'],
          relationships: ['parent'],
        },
      ),
    ).then((body) =>
      Utils.deserializeResponseBody<ApiTypes.UploadCollectionCreateTargetSchema>(
        body,
      ),
    );
  }

  /**
   * Create a new upload collection
   *
   * Read more: https://www.datocms.com/docs/content-management-api/resources/upload-collection/create
   *
   * @throws {ApiError}
   * @throws {TimeoutError}
   */
  rawCreate(
    body: RawApiTypes.UploadCollectionCreateSchema,
  ): Promise<RawApiTypes.UploadCollectionCreateTargetSchema> {
    return this.client.request<RawApiTypes.UploadCollectionCreateTargetSchema>({
      method: 'POST',
      url: '/upload-collections',
      body,
    });
  }

  /**
   * Update a upload collection
   *
   * Read more: https://www.datocms.com/docs/content-management-api/resources/upload-collection/update
   *
   * @throws {ApiError}
   * @throws {TimeoutError}
   */
  update(
    uploadCollectionId: string | ApiTypes.UploadCollectionData,
    body: ApiTypes.UploadCollectionUpdateSchema,
  ) {
    return this.rawUpdate(
      Utils.toId(uploadCollectionId),
      Utils.serializeRequestBody<RawApiTypes.UploadCollectionUpdateSchema>(
        body,
        {
          id: Utils.toId(uploadCollectionId),
          type: 'upload_collection',
          attributes: ['label', 'position'],
          relationships: ['parent', 'children'],
        },
      ),
    ).then((body) =>
      Utils.deserializeResponseBody<ApiTypes.UploadCollectionUpdateTargetSchema>(
        body,
      ),
    );
  }

  /**
   * Update a upload collection
   *
   * Read more: https://www.datocms.com/docs/content-management-api/resources/upload-collection/update
   *
   * @throws {ApiError}
   * @throws {TimeoutError}
   */
  rawUpdate(
    uploadCollectionId: string,
    body: RawApiTypes.UploadCollectionUpdateSchema,
  ): Promise<RawApiTypes.UploadCollectionUpdateTargetSchema> {
    return this.client.request<RawApiTypes.UploadCollectionUpdateTargetSchema>({
      method: 'PUT',
      url: `/upload-collections/${uploadCollectionId}`,
      body,
    });
  }

  /**
   * List all upload collections
   *
   * Read more: https://www.datocms.com/docs/content-management-api/resources/upload-collection/instances
   *
   * @throws {ApiError}
   * @throws {TimeoutError}
   */
  list(queryParams?: ApiTypes.UploadCollectionInstancesHrefSchema) {
    return this.rawList(queryParams).then((body) =>
      Utils.deserializeResponseBody<ApiTypes.UploadCollectionInstancesTargetSchema>(
        body,
      ),
    );
  }

  /**
   * List all upload collections
   *
   * Read more: https://www.datocms.com/docs/content-management-api/resources/upload-collection/instances
   *
   * @throws {ApiError}
   * @throws {TimeoutError}
   */
  rawList(
    queryParams?: RawApiTypes.UploadCollectionInstancesHrefSchema,
  ): Promise<RawApiTypes.UploadCollectionInstancesTargetSchema> {
    return this.client.request<RawApiTypes.UploadCollectionInstancesTargetSchema>(
      {
        method: 'GET',
        url: '/upload-collections',
        queryParams,
      },
    );
  }

  /**
   * Retrieve a upload collection
   *
   * Read more: https://www.datocms.com/docs/content-management-api/resources/upload-collection/self
   *
   * @throws {ApiError}
   * @throws {TimeoutError}
   */
  find(uploadCollectionId: string | ApiTypes.UploadCollectionData) {
    return this.rawFind(Utils.toId(uploadCollectionId)).then((body) =>
      Utils.deserializeResponseBody<ApiTypes.UploadCollectionSelfTargetSchema>(
        body,
      ),
    );
  }

  /**
   * Retrieve a upload collection
   *
   * Read more: https://www.datocms.com/docs/content-management-api/resources/upload-collection/self
   *
   * @throws {ApiError}
   * @throws {TimeoutError}
   */
  rawFind(
    uploadCollectionId: string,
  ): Promise<RawApiTypes.UploadCollectionSelfTargetSchema> {
    return this.client.request<RawApiTypes.UploadCollectionSelfTargetSchema>({
      method: 'GET',
      url: `/upload-collections/${uploadCollectionId}`,
    });
  }

  /**
   * Delete a upload collection
   *
   * Read more: https://www.datocms.com/docs/content-management-api/resources/upload-collection/destroy
   *
   * @throws {ApiError}
   * @throws {TimeoutError}
   */
  destroy(uploadCollectionId: string | ApiTypes.UploadCollectionData) {
    return this.rawDestroy(Utils.toId(uploadCollectionId)).then((body) =>
      Utils.deserializeResponseBody<ApiTypes.UploadCollectionDestroyTargetSchema>(
        body,
      ),
    );
  }

  /**
   * Delete a upload collection
   *
   * Read more: https://www.datocms.com/docs/content-management-api/resources/upload-collection/destroy
   *
   * @throws {ApiError}
   * @throws {TimeoutError}
   */
  rawDestroy(
    uploadCollectionId: string,
  ): Promise<RawApiTypes.UploadCollectionDestroyTargetSchema> {
    return this.client.request<RawApiTypes.UploadCollectionDestroyTargetSchema>(
      {
        method: 'DELETE',
        url: `/upload-collections/${uploadCollectionId}`,
      },
    );
  }

  /**
   * Reorders a set of upload collections
   *
   * Read more: https://www.datocms.com/docs/content-management-api/resources/upload-collection/reorder
   *
   * @throws {ApiError}
   * @throws {TimeoutError}
   *
   * @deprecated This API call is to be considered private and might change without notice
   */
  reorder(body: ApiTypes.UploadCollectionReorderSchema) {
    return this.rawReorder(
      Utils.serializeRequestBody<RawApiTypes.UploadCollectionReorderSchema>(
        body,
        {
          type: 'upload_collection',
          attributes: ['position'],
          relationships: ['parent'],
        },
      ),
    ).then((body) =>
      Utils.deserializeResponseBody<ApiTypes.UploadCollectionReorderJobSchema>(
        body,
      ),
    );
  }

  /**
   * Reorders a set of upload collections
   *
   * Read more: https://www.datocms.com/docs/content-management-api/resources/upload-collection/reorder
   *
   * @throws {ApiError}
   * @throws {TimeoutError}
   *
   * @deprecated This API call is to be considered private and might change without notice
   */
  rawReorder(
    body: RawApiTypes.UploadCollectionReorderSchema,
  ): Promise<RawApiTypes.UploadCollectionReorderJobSchema> {
    return this.client.request<RawApiTypes.UploadCollectionReorderJobSchema>({
      method: 'POST',
      url: '/upload-collections/reorder',
      body,
    });
  }
}
