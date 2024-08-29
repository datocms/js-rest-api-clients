import * as Utils from '@datocms/rest-client-utils';
import BaseResource from '../../BaseResource';
import type * as SchemaTypes from '../SchemaTypes';
import type * as SimpleSchemaTypes from '../SimpleSchemaTypes';

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
  create(body: SimpleSchemaTypes.UploadCollectionCreateSchema) {
    return this.rawCreate(
      Utils.serializeRequestBody<SchemaTypes.UploadCollectionCreateSchema>(
        body,
        {
          type: 'upload_collection',
          attributes: ['label', 'position'],
          relationships: ['parent'],
        },
      ),
    ).then((body) =>
      Utils.deserializeResponseBody<SimpleSchemaTypes.UploadCollectionCreateTargetSchema>(
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
    body: SchemaTypes.UploadCollectionCreateSchema,
  ): Promise<SchemaTypes.UploadCollectionCreateTargetSchema> {
    return this.client.request<SchemaTypes.UploadCollectionCreateTargetSchema>({
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
    uploadCollectionId: string | SimpleSchemaTypes.UploadCollectionData,
    body: SimpleSchemaTypes.UploadCollectionUpdateSchema,
  ) {
    return this.rawUpdate(
      Utils.toId(uploadCollectionId),
      Utils.serializeRequestBody<SchemaTypes.UploadCollectionUpdateSchema>(
        body,
        {
          id: Utils.toId(uploadCollectionId),
          type: 'upload_collection',
          attributes: ['label', 'position'],
          relationships: ['parent', 'children'],
        },
      ),
    ).then((body) =>
      Utils.deserializeResponseBody<SimpleSchemaTypes.UploadCollectionUpdateTargetSchema>(
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
    body: SchemaTypes.UploadCollectionUpdateSchema,
  ): Promise<SchemaTypes.UploadCollectionUpdateTargetSchema> {
    return this.client.request<SchemaTypes.UploadCollectionUpdateTargetSchema>({
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
  list(queryParams?: SimpleSchemaTypes.UploadCollectionInstancesHrefSchema) {
    return this.rawList(queryParams).then((body) =>
      Utils.deserializeResponseBody<SimpleSchemaTypes.UploadCollectionInstancesTargetSchema>(
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
    queryParams?: SchemaTypes.UploadCollectionInstancesHrefSchema,
  ): Promise<SchemaTypes.UploadCollectionInstancesTargetSchema> {
    return this.client.request<SchemaTypes.UploadCollectionInstancesTargetSchema>(
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
  find(uploadCollectionId: string | SimpleSchemaTypes.UploadCollectionData) {
    return this.rawFind(Utils.toId(uploadCollectionId)).then((body) =>
      Utils.deserializeResponseBody<SimpleSchemaTypes.UploadCollectionSelfTargetSchema>(
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
  ): Promise<SchemaTypes.UploadCollectionSelfTargetSchema> {
    return this.client.request<SchemaTypes.UploadCollectionSelfTargetSchema>({
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
  destroy(uploadCollectionId: string | SimpleSchemaTypes.UploadCollectionData) {
    return this.rawDestroy(Utils.toId(uploadCollectionId)).then((body) =>
      Utils.deserializeResponseBody<SimpleSchemaTypes.UploadCollectionDestroyTargetSchema>(
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
  ): Promise<SchemaTypes.UploadCollectionDestroyTargetSchema> {
    return this.client.request<SchemaTypes.UploadCollectionDestroyTargetSchema>(
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
  reorder(body: SimpleSchemaTypes.UploadCollectionReorderSchema) {
    return this.rawReorder(
      Utils.serializeRequestBody<SchemaTypes.UploadCollectionReorderSchema>(
        body,
        {
          type: 'upload_collection',
          attributes: ['position'],
          relationships: ['parent'],
        },
      ),
    ).then((body) =>
      Utils.deserializeResponseBody<SimpleSchemaTypes.UploadCollectionReorderJobSchema>(
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
    body: SchemaTypes.UploadCollectionReorderSchema,
  ): Promise<SchemaTypes.UploadCollectionReorderJobSchema> {
    return this.client.request<SchemaTypes.UploadCollectionReorderJobSchema>({
      method: 'POST',
      url: '/upload-collections/reorder',
      body,
    });
  }
}
