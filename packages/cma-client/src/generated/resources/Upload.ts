import * as Utils from '@datocms/rest-client-utils';
import BaseResource from '../../BaseResource';
import type * as SchemaTypes from '../SchemaTypes';
import type * as SimpleSchemaTypes from '../SimpleSchemaTypes';

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
  create(body: SimpleSchemaTypes.UploadCreateSchema) {
    return this.rawCreate(
      Utils.serializeRequestBody<SchemaTypes.UploadCreateSchema>(body, {
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
      Utils.deserializeResponseBody<SimpleSchemaTypes.UploadCreateJobSchema>(
        body,
      ),
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
    body: SchemaTypes.UploadCreateSchema,
  ): Promise<SchemaTypes.UploadCreateJobSchema> {
    return this.client.request<SchemaTypes.UploadCreateJobSchema>({
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
  list(queryParams?: SimpleSchemaTypes.UploadInstancesHrefSchema) {
    return this.rawList(queryParams).then((body) =>
      Utils.deserializeResponseBody<SimpleSchemaTypes.UploadInstancesTargetSchema>(
        body,
      ),
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
    queryParams?: SchemaTypes.UploadInstancesHrefSchema,
  ): Promise<SchemaTypes.UploadInstancesTargetSchema> {
    return this.client.request<SchemaTypes.UploadInstancesTargetSchema>({
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
      SimpleSchemaTypes.UploadInstancesHrefSchema,
      'page'
    >,
    iteratorOptions?: Utils.IteratorOptions,
  ) {
    for await (const element of this.rawListPagedIterator(
      queryParams,
      iteratorOptions,
    )) {
      yield Utils.deserializeJsonEntity<
        SimpleSchemaTypes.UploadInstancesTargetSchema[0]
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
      SchemaTypes.UploadInstancesHrefSchema,
      'page'
    >,
    iteratorOptions?: Utils.IteratorOptions,
  ) {
    Utils.warnOnPageQueryParam(queryParams);

    return Utils.rawPageIterator<
      SchemaTypes.UploadInstancesTargetSchema['data'][0]
    >(
      {
        defaultLimit: 30,
        maxLimit: 500,
      },
      (page: SchemaTypes.UploadInstancesHrefSchema['page']) =>
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
  find(uploadId: string | SimpleSchemaTypes.UploadData) {
    return this.rawFind(Utils.toId(uploadId)).then((body) =>
      Utils.deserializeResponseBody<SimpleSchemaTypes.UploadSelfTargetSchema>(
        body,
      ),
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
  rawFind(uploadId: string): Promise<SchemaTypes.UploadSelfTargetSchema> {
    return this.client.request<SchemaTypes.UploadSelfTargetSchema>({
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
  destroy(uploadId: string | SimpleSchemaTypes.UploadData) {
    return this.rawDestroy(Utils.toId(uploadId)).then((body) =>
      Utils.deserializeResponseBody<SimpleSchemaTypes.UploadDestroyTargetSchema>(
        body,
      ),
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
  rawDestroy(uploadId: string): Promise<SchemaTypes.UploadDestroyTargetSchema> {
    return this.client.request<SchemaTypes.UploadDestroyTargetSchema>({
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
    uploadId: string | SimpleSchemaTypes.UploadData,
    body: SimpleSchemaTypes.UploadUpdateSchema,
  ) {
    return this.rawUpdate(
      Utils.toId(uploadId),
      Utils.serializeRequestBody<SchemaTypes.UploadUpdateSchema>(body, {
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
    ).then((body) =>
      Utils.deserializeResponseBody<SimpleSchemaTypes.UploadUpdateJobSchema>(
        body,
      ),
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
    body: SchemaTypes.UploadUpdateSchema,
  ): Promise<SchemaTypes.UploadUpdateJobSchema> {
    return this.client.request<SchemaTypes.UploadUpdateJobSchema>({
      method: 'PUT',
      url: `/uploads/${uploadId}`,
      body,
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
  references(
    uploadId: string | SimpleSchemaTypes.UploadData,
    queryParams?: SimpleSchemaTypes.UploadReferencesHrefSchema,
  ) {
    return this.rawReferences(Utils.toId(uploadId), queryParams).then((body) =>
      Utils.deserializeResponseBody<SimpleSchemaTypes.UploadReferencesTargetSchema>(
        body,
      ),
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
  rawReferences(
    uploadId: string,
    queryParams?: SchemaTypes.UploadReferencesHrefSchema,
  ): Promise<SchemaTypes.UploadReferencesTargetSchema> {
    return this.client.request<SchemaTypes.UploadReferencesTargetSchema>({
      method: 'GET',
      url: `/uploads/${uploadId}/references`,
      queryParams,
    });
  }

  /**
   * Add tags to assets in bulk
   *
   * Read more: https://www.datocms.com/docs/content-management-api/resources/upload/bulk_tag
   *
   * @throws {ApiError}
   * @throws {TimeoutError}
   */
  bulkTag(body: SimpleSchemaTypes.UploadBulkTagSchema) {
    return this.rawBulkTag(
      Utils.serializeRequestBody<SchemaTypes.UploadBulkTagSchema>(body, {
        type: 'upload_bulk_tag_operation',
        attributes: ['tags'],
        relationships: ['uploads'],
      }),
    ).then((body) =>
      Utils.deserializeResponseBody<SimpleSchemaTypes.UploadBulkTagJobSchema>(
        body,
      ),
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
    body: SchemaTypes.UploadBulkTagSchema,
  ): Promise<SchemaTypes.UploadBulkTagJobSchema> {
    return this.client.request<SchemaTypes.UploadBulkTagJobSchema>({
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
  bulkSetUploadCollection(
    body: SimpleSchemaTypes.UploadBulkSetUploadCollectionSchema,
  ) {
    return this.rawBulkSetUploadCollection(
      Utils.serializeRequestBody<SchemaTypes.UploadBulkSetUploadCollectionSchema>(
        body,
        {
          type: 'upload_bulk_set_upload_collection_operation',
          attributes: [],
          relationships: ['upload_collection', 'uploads'],
        },
      ),
    ).then((body) =>
      Utils.deserializeResponseBody<SimpleSchemaTypes.UploadBulkSetUploadCollectionJobSchema>(
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
    body: SchemaTypes.UploadBulkSetUploadCollectionSchema,
  ): Promise<SchemaTypes.UploadBulkSetUploadCollectionJobSchema> {
    return this.client.request<SchemaTypes.UploadBulkSetUploadCollectionJobSchema>(
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
  bulkDestroy(body: SimpleSchemaTypes.UploadBulkDestroySchema) {
    return this.rawBulkDestroy(
      Utils.serializeRequestBody<SchemaTypes.UploadBulkDestroySchema>(body, {
        type: 'upload_bulk_destroy_operation',
        attributes: [],
        relationships: ['uploads'],
      }),
    ).then((body) =>
      Utils.deserializeResponseBody<SimpleSchemaTypes.UploadBulkDestroyJobSchema>(
        body,
      ),
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
    body: SchemaTypes.UploadBulkDestroySchema,
  ): Promise<SchemaTypes.UploadBulkDestroyJobSchema> {
    return this.client.request<SchemaTypes.UploadBulkDestroyJobSchema>({
      method: 'POST',
      url: '/uploads/bulk/destroy',
      body,
    });
  }
}
