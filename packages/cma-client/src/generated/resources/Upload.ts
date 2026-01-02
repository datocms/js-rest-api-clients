import * as Utils from '@datocms/rest-client-utils';
import BaseResource from '../../BaseResource';
import type { ItemTypeDefinition } from '../../utilities/itemDefinition';
import type * as ApiTypes from '../ApiTypes';
import type * as RawApiTypes from '../RawApiTypes';

type NoInfer<T> = [T][T extends any ? 0 : never];

export default class Upload extends BaseResource {
  static readonly TYPE = 'upload' as const;

  /**
   * Create a new upload
   *
   * Read more: https://www.datocms.com/docs/content-management-api/resources/upload/create
   *
   * @throws {ApiError}
   * @throws {TimeoutError}
   */
  create(body: ApiTypes.UploadCreateSchema) {
    return this.rawCreate(
      Utils.serializeRequestBody<RawApiTypes.UploadCreateSchema>(body, {
        type: 'upload',
        attributes: [
          'path',
          'copyright',
          'author',
          'notes',
          'default_field_metadata',
          'tags',
        ],
        relationships: ['upload_collection'],
      }),
    ).then((body) =>
      Utils.deserializeResponseBody<ApiTypes.UploadCreateJobSchema>(body),
    );
  }

  /**
   * Create a new upload
   *
   * Read more: https://www.datocms.com/docs/content-management-api/resources/upload/create
   *
   * @throws {ApiError}
   * @throws {TimeoutError}
   */
  rawCreate(
    body: RawApiTypes.UploadCreateSchema,
  ): Promise<RawApiTypes.UploadCreateJobSchema> {
    return this.client.request<RawApiTypes.UploadCreateJobSchema>({
      method: 'POST',
      url: '/uploads',
      body,
    });
  }

  /**
   * List all uploads
   *
   * Read more: https://www.datocms.com/docs/content-management-api/resources/upload/instances
   *
   * @throws {ApiError}
   * @throws {TimeoutError}
   */
  list(queryParams?: ApiTypes.UploadInstancesHrefSchema) {
    return this.rawList(queryParams).then((body) =>
      Utils.deserializeResponseBody<ApiTypes.UploadInstancesTargetSchema>(body),
    );
  }

  /**
   * List all uploads
   *
   * Read more: https://www.datocms.com/docs/content-management-api/resources/upload/instances
   *
   * @throws {ApiError}
   * @throws {TimeoutError}
   */
  rawList(
    queryParams?: RawApiTypes.UploadInstancesHrefSchema,
  ): Promise<RawApiTypes.UploadInstancesTargetSchema> {
    return this.client.request<RawApiTypes.UploadInstancesTargetSchema>({
      method: 'GET',
      url: '/uploads',
      queryParams,
    });
  }

  /**
   * Async iterator to auto-paginate over elements returned by list()
   *
   * Read more: https://www.datocms.com/docs/content-management-api/resources/upload/instances
   *
   * @throws {ApiError}
   * @throws {TimeoutError}
   */
  async *listPagedIterator(
    queryParams?: Utils.OmitFromKnownKeys<
      ApiTypes.UploadInstancesHrefSchema,
      'page'
    >,
    iteratorOptions?: Utils.IteratorOptions,
  ) {
    for await (const element of this.rawListPagedIterator(
      queryParams,
      iteratorOptions,
    )) {
      yield Utils.deserializeJsonEntity<
        ApiTypes.UploadInstancesTargetSchema[0]
      >(element);
    }
  }

  /**
   * Async iterator to auto-paginate over elements returned by rawList()
   *
   * Read more: https://www.datocms.com/docs/content-management-api/resources/upload/instances
   *
   * @throws {ApiError}
   * @throws {TimeoutError}
   */
  rawListPagedIterator(
    queryParams?: Utils.OmitFromKnownKeys<
      RawApiTypes.UploadInstancesHrefSchema,
      'page'
    >,
    iteratorOptions?: Utils.IteratorOptions,
  ) {
    Utils.warnOnPageQueryParam(queryParams);

    return Utils.rawPageIterator<
      RawApiTypes.UploadInstancesTargetSchema['data'][0]
    >(
      {
        defaultLimit: 30,
        maxLimit: 500,
      },
      (page: RawApiTypes.UploadInstancesHrefSchema['page']) =>
        this.rawList({ ...queryParams, page }),
      iteratorOptions,
    );
  }

  /**
   * Retrieve an upload
   *
   * Read more: https://www.datocms.com/docs/content-management-api/resources/upload/self
   *
   * @throws {ApiError}
   * @throws {TimeoutError}
   */
  find(uploadId: string | ApiTypes.UploadData) {
    return this.rawFind(Utils.toId(uploadId)).then((body) =>
      Utils.deserializeResponseBody<ApiTypes.UploadSelfTargetSchema>(body),
    );
  }

  /**
   * Retrieve an upload
   *
   * Read more: https://www.datocms.com/docs/content-management-api/resources/upload/self
   *
   * @throws {ApiError}
   * @throws {TimeoutError}
   */
  rawFind(uploadId: string): Promise<RawApiTypes.UploadSelfTargetSchema> {
    return this.client.request<RawApiTypes.UploadSelfTargetSchema>({
      method: 'GET',
      url: `/uploads/${uploadId}`,
    });
  }

  /**
   * Delete an upload
   *
   * Read more: https://www.datocms.com/docs/content-management-api/resources/upload/destroy
   *
   * @throws {ApiError}
   * @throws {TimeoutError}
   */
  destroy(uploadId: string | ApiTypes.UploadData) {
    return this.rawDestroy(Utils.toId(uploadId)).then((body) =>
      Utils.deserializeResponseBody<ApiTypes.UploadDestroyTargetSchema>(body),
    );
  }

  /**
   * Delete an upload
   *
   * Read more: https://www.datocms.com/docs/content-management-api/resources/upload/destroy
   *
   * @throws {ApiError}
   * @throws {TimeoutError}
   */
  rawDestroy(uploadId: string): Promise<RawApiTypes.UploadDestroyTargetSchema> {
    return this.client.request<RawApiTypes.UploadDestroyTargetSchema>({
      method: 'DELETE',
      url: `/uploads/${uploadId}`,
    });
  }

  /**
   * Update an upload
   *
   * Read more: https://www.datocms.com/docs/content-management-api/resources/upload/update
   *
   * @throws {ApiError}
   * @throws {TimeoutError}
   */
  update(
    uploadId: string | ApiTypes.UploadData,
    body: ApiTypes.UploadUpdateSchema,
    queryParams?: ApiTypes.UploadUpdateHrefSchema,
  ) {
    return this.rawUpdate(
      Utils.toId(uploadId),
      Utils.serializeRequestBody<RawApiTypes.UploadUpdateSchema>(body, {
        id: Utils.toId(uploadId),
        type: 'upload',
        attributes: [
          'path',
          'basename',
          'copyright',
          'author',
          'notes',
          'tags',
          'default_field_metadata',
        ],
        relationships: ['creator', 'upload_collection'],
      }),
      queryParams,
    ).then((body) =>
      Utils.deserializeResponseBody<ApiTypes.UploadUpdateJobSchema>(body),
    );
  }

  /**
   * Update an upload
   *
   * Read more: https://www.datocms.com/docs/content-management-api/resources/upload/update
   *
   * @throws {ApiError}
   * @throws {TimeoutError}
   */
  rawUpdate(
    uploadId: string,
    body: RawApiTypes.UploadUpdateSchema,
    queryParams?: RawApiTypes.UploadUpdateHrefSchema,
  ): Promise<RawApiTypes.UploadUpdateJobSchema> {
    return this.client.request<RawApiTypes.UploadUpdateJobSchema>({
      method: 'PUT',
      url: `/uploads/${uploadId}`,
      body,
      queryParams,
    });
  }

  /**
   * Referenced records
   *
   * Read more: https://www.datocms.com/docs/content-management-api/resources/upload/references
   *
   * @throws {ApiError}
   * @throws {TimeoutError}
   */
  references<D extends ItemTypeDefinition = ItemTypeDefinition>(
    uploadId: string | ApiTypes.UploadData,
    queryParams: ApiTypes.UploadReferencesHrefSchema & { nested: true },
  ): Promise<ApiTypes.UploadReferencesTargetSchema<NoInfer<D>, true>>;
  references<D extends ItemTypeDefinition = ItemTypeDefinition>(
    uploadId: string | ApiTypes.UploadData,
    queryParams?: ApiTypes.UploadReferencesHrefSchema & {
      nested?: false | undefined;
    },
  ): Promise<ApiTypes.UploadReferencesTargetSchema<NoInfer<D>, false>>;
  /**
   * Referenced records
   *
   * Read more: https://www.datocms.com/docs/content-management-api/resources/upload/references
   *
   * @throws {ApiError}
   * @throws {TimeoutError}
   */
  references<D extends ItemTypeDefinition = ItemTypeDefinition>(
    uploadId: string | ApiTypes.UploadData,
    queryParams?: ApiTypes.UploadReferencesHrefSchema,
  ) {
    return this.rawReferences<D>(Utils.toId(uploadId), queryParams).then(
      (body) => Utils.deserializeResponseBody(body),
    );
  }

  /**
   * Referenced records
   *
   * Read more: https://www.datocms.com/docs/content-management-api/resources/upload/references
   *
   * @throws {ApiError}
   * @throws {TimeoutError}
   */
  rawReferences<D extends ItemTypeDefinition = ItemTypeDefinition>(
    uploadId: string,
    queryParams: RawApiTypes.UploadReferencesHrefSchema & { nested: true },
  ): Promise<RawApiTypes.UploadReferencesTargetSchema<NoInfer<D>, true>>;
  rawReferences<D extends ItemTypeDefinition = ItemTypeDefinition>(
    uploadId: string,
    queryParams?: RawApiTypes.UploadReferencesHrefSchema & {
      nested?: false | undefined;
    },
  ): Promise<RawApiTypes.UploadReferencesTargetSchema<NoInfer<D>, false>>;
  rawReferences<D extends ItemTypeDefinition = ItemTypeDefinition>(
    uploadId: string,
    queryParams?: RawApiTypes.UploadReferencesHrefSchema,
  ): Promise<RawApiTypes.UploadReferencesTargetSchema<NoInfer<D>, true>>;
  /**
   * Referenced records
   *
   * Read more: https://www.datocms.com/docs/content-management-api/resources/upload/references
   *
   * @throws {ApiError}
   * @throws {TimeoutError}
   */
  rawReferences<D extends ItemTypeDefinition = ItemTypeDefinition>(
    uploadId: string,
    queryParams?: RawApiTypes.UploadReferencesHrefSchema,
  ) {
    return this.client
      .request({
        method: 'GET',
        url: `/uploads/${uploadId}/references`,
        queryParams,
      })
      .then<RawApiTypes.UploadReferencesTargetSchema<NoInfer<D>, true>>(
        Utils.deserializeRawResponseBodyWithItems,
      );
  }

  /**
   * Add tags to assets in bulk
   *
   * Read more: https://www.datocms.com/docs/content-management-api/resources/upload/bulk_tag
   *
   * @throws {ApiError}
   * @throws {TimeoutError}
   */
  bulkTag(body: ApiTypes.UploadBulkTagSchema) {
    return this.rawBulkTag(
      Utils.serializeRequestBody<RawApiTypes.UploadBulkTagSchema>(body, {
        type: 'upload_bulk_tag_operation',
        attributes: ['tags'],
        relationships: ['uploads'],
      }),
    ).then((body) =>
      Utils.deserializeResponseBody<ApiTypes.UploadBulkTagJobSchema>(body),
    );
  }

  /**
   * Add tags to assets in bulk
   *
   * Read more: https://www.datocms.com/docs/content-management-api/resources/upload/bulk_tag
   *
   * @throws {ApiError}
   * @throws {TimeoutError}
   */
  rawBulkTag(
    body: RawApiTypes.UploadBulkTagSchema,
  ): Promise<RawApiTypes.UploadBulkTagJobSchema> {
    return this.client.request<RawApiTypes.UploadBulkTagJobSchema>({
      method: 'POST',
      url: '/uploads/bulk/tag',
      body,
    });
  }

  /**
   * Put assets into a collection in bulk
   *
   * Read more: https://www.datocms.com/docs/content-management-api/resources/upload/bulk_set_upload_collection
   *
   * @throws {ApiError}
   * @throws {TimeoutError}
   */
  bulkSetUploadCollection(body: ApiTypes.UploadBulkSetUploadCollectionSchema) {
    return this.rawBulkSetUploadCollection(
      Utils.serializeRequestBody<RawApiTypes.UploadBulkSetUploadCollectionSchema>(
        body,
        {
          type: 'upload_bulk_set_upload_collection_operation',
          attributes: [],
          relationships: ['upload_collection', 'uploads'],
        },
      ),
    ).then((body) =>
      Utils.deserializeResponseBody<ApiTypes.UploadBulkSetUploadCollectionJobSchema>(
        body,
      ),
    );
  }

  /**
   * Put assets into a collection in bulk
   *
   * Read more: https://www.datocms.com/docs/content-management-api/resources/upload/bulk_set_upload_collection
   *
   * @throws {ApiError}
   * @throws {TimeoutError}
   */
  rawBulkSetUploadCollection(
    body: RawApiTypes.UploadBulkSetUploadCollectionSchema,
  ): Promise<RawApiTypes.UploadBulkSetUploadCollectionJobSchema> {
    return this.client.request<RawApiTypes.UploadBulkSetUploadCollectionJobSchema>(
      {
        method: 'POST',
        url: '/uploads/bulk/set-upload-collection',
        body,
      },
    );
  }

  /**
   * Destroy uploads
   *
   * Read more: https://www.datocms.com/docs/content-management-api/resources/upload/bulk_destroy
   *
   * @throws {ApiError}
   * @throws {TimeoutError}
   */
  bulkDestroy(body: ApiTypes.UploadBulkDestroySchema) {
    return this.rawBulkDestroy(
      Utils.serializeRequestBody<RawApiTypes.UploadBulkDestroySchema>(body, {
        type: 'upload_bulk_destroy_operation',
        attributes: [],
        relationships: ['uploads'],
      }),
    ).then((body) =>
      Utils.deserializeResponseBody<ApiTypes.UploadBulkDestroyJobSchema>(body),
    );
  }

  /**
   * Destroy uploads
   *
   * Read more: https://www.datocms.com/docs/content-management-api/resources/upload/bulk_destroy
   *
   * @throws {ApiError}
   * @throws {TimeoutError}
   */
  rawBulkDestroy(
    body: RawApiTypes.UploadBulkDestroySchema,
  ): Promise<RawApiTypes.UploadBulkDestroyJobSchema> {
    return this.client.request<RawApiTypes.UploadBulkDestroyJobSchema>({
      method: 'POST',
      url: '/uploads/bulk/destroy',
      body,
    });
  }
}
