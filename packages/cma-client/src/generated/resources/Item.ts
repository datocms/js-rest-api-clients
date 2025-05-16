import * as Utils from '@datocms/rest-client-utils';
import BaseResource from '../../BaseResource';
import type * as SchemaTypes from '../SchemaTypes';
import type * as SimpleSchemaTypes from '../SimpleSchemaTypes';

export default class Item extends BaseResource {
  static readonly TYPE = 'item' as const;

  /**
   * List all records
   *
   * Read more: https://www.datocms.com/docs/content-management-api/resources/item/instances
   *
   * @throws {ApiError}
   * @throws {TimeoutError}
   */
  list(queryParams?: SimpleSchemaTypes.ItemInstancesHrefSchema) {
    return this.rawList(queryParams).then((body) =>
      Utils.deserializeResponseBody<SimpleSchemaTypes.ItemInstancesTargetSchema>(
        body,
      ),
    );
  }

  /**
   * List all records
   *
   * Read more: https://www.datocms.com/docs/content-management-api/resources/item/instances
   *
   * @throws {ApiError}
   * @throws {TimeoutError}
   */
  rawList(
    queryParams?: SchemaTypes.ItemInstancesHrefSchema,
  ): Promise<SchemaTypes.ItemInstancesTargetSchema> {
    return this.client.request<SchemaTypes.ItemInstancesTargetSchema>({
      method: 'GET',
      url: '/items',
      queryParams,
    });
  }

  /**
   * Async iterator to auto-paginate over elements returned by list()
   *
   * Read more: https://www.datocms.com/docs/content-management-api/resources/item/instances
   *
   * @throws {ApiError}
   * @throws {TimeoutError}
   */
  async *listPagedIterator(
    queryParams?: Utils.OmitFromKnownKeys<
      SimpleSchemaTypes.ItemInstancesHrefSchema,
      'page'
    >,
    iteratorOptions?: Utils.IteratorOptions,
  ) {
    for await (const element of this.rawListPagedIterator(
      queryParams,
      iteratorOptions,
    )) {
      yield Utils.deserializeJsonEntity<
        SimpleSchemaTypes.ItemInstancesTargetSchema[0]
      >(element);
    }
  }

  /**
   * Async iterator to auto-paginate over elements returned by rawList()
   *
   * Read more: https://www.datocms.com/docs/content-management-api/resources/item/instances
   *
   * @throws {ApiError}
   * @throws {TimeoutError}
   */
  rawListPagedIterator(
    queryParams?: Utils.OmitFromKnownKeys<
      SchemaTypes.ItemInstancesHrefSchema,
      'page'
    >,
    iteratorOptions?: Utils.IteratorOptions,
  ) {
    Utils.warnOnPageQueryParam(queryParams);

    return Utils.rawPageIterator<
      SchemaTypes.ItemInstancesTargetSchema['data'][0]
    >(
      {
        defaultLimit: 30,
        maxLimit: 500,
      },
      (page: SchemaTypes.ItemInstancesHrefSchema['page']) =>
        this.rawList({ ...queryParams, page }),
      iteratorOptions,
    );
  }

  /**
   * Validates an existing record field
   *
   * Read more: https://www.datocms.com/docs/content-management-api/resources/item/validate_existing
   *
   * @throws {ApiError}
   * @throws {TimeoutError}
   *
   * @deprecated This API call is to be considered private and might change without notice
   */
  validateExisting(
    itemId: string | SimpleSchemaTypes.ItemData,
    body: SimpleSchemaTypes.ItemValidateExistingSchema,
  ) {
    return this.rawValidateExisting(
      Utils.toId(itemId),
      Utils.serializeRequestBody<SchemaTypes.ItemValidateExistingSchema>(body, {
        id: Utils.toId(itemId),
        type: 'item',
        attributes: '*',
        relationships: ['item_type', 'creator'],
      }),
    );
  }

  /**
   * Validates an existing record field
   *
   * Read more: https://www.datocms.com/docs/content-management-api/resources/item/validate_existing
   *
   * @throws {ApiError}
   * @throws {TimeoutError}
   *
   * @deprecated This API call is to be considered private and might change without notice
   */
  rawValidateExisting(
    itemId: string,
    body: SchemaTypes.ItemValidateExistingSchema,
  ): Promise<void> {
    return this.client.request<void>({
      method: 'POST',
      url: `/items/${itemId}/validate`,
      body,
    });
  }

  /**
   * Validates a record field
   *
   * Read more: https://www.datocms.com/docs/content-management-api/resources/item/validate_new
   *
   * @throws {ApiError}
   * @throws {TimeoutError}
   *
   * @deprecated This API call is to be considered private and might change without notice
   */
  validateNew(body: SimpleSchemaTypes.ItemValidateNewSchema) {
    return this.rawValidateNew(
      Utils.serializeRequestBody<SchemaTypes.ItemValidateNewSchema>(body, {
        type: 'item',
        attributes: '*',
        relationships: ['item_type', 'creator'],
      }),
    );
  }

  /**
   * Validates a record field
   *
   * Read more: https://www.datocms.com/docs/content-management-api/resources/item/validate_new
   *
   * @throws {ApiError}
   * @throws {TimeoutError}
   *
   * @deprecated This API call is to be considered private and might change without notice
   */
  rawValidateNew(body: SchemaTypes.ItemValidateNewSchema): Promise<void> {
    return this.client.request<void>({
      method: 'POST',
      url: '/items/validate',
      body,
    });
  }

  /**
   * Create a new record
   *
   * Read more: https://www.datocms.com/docs/content-management-api/resources/item/create
   *
   * @throws {ApiError}
   * @throws {TimeoutError}
   */
  create(body: SimpleSchemaTypes.ItemCreateSchema) {
    return this.rawCreate(
      Utils.serializeRequestBody<SchemaTypes.ItemCreateSchema>(body, {
        type: 'item',
        attributes: '*',
        relationships: ['item_type', 'creator'],
      }),
    ).then((body) =>
      Utils.deserializeResponseBody<SimpleSchemaTypes.ItemCreateTargetSchema>(
        body,
      ),
    );
  }

  /**
   * Create a new record
   *
   * Read more: https://www.datocms.com/docs/content-management-api/resources/item/create
   *
   * @throws {ApiError}
   * @throws {TimeoutError}
   */
  rawCreate(
    body: SchemaTypes.ItemCreateSchema,
  ): Promise<SchemaTypes.ItemCreateTargetSchema> {
    return this.client.request<SchemaTypes.ItemCreateTargetSchema>({
      method: 'POST',
      url: '/items',
      body,
    });
  }

  /**
   * Duplicate a record
   *
   * Read more: https://www.datocms.com/docs/content-management-api/resources/item/duplicate
   *
   * @throws {ApiError}
   * @throws {TimeoutError}
   */
  duplicate(itemId: string | SimpleSchemaTypes.ItemData) {
    return this.rawDuplicate(Utils.toId(itemId)).then((body) =>
      Utils.deserializeResponseBody<SimpleSchemaTypes.ItemDuplicateJobSchema>(
        body,
      ),
    );
  }

  /**
   * Duplicate a record
   *
   * Read more: https://www.datocms.com/docs/content-management-api/resources/item/duplicate
   *
   * @throws {ApiError}
   * @throws {TimeoutError}
   */
  rawDuplicate(itemId: string): Promise<SchemaTypes.ItemDuplicateJobSchema> {
    return this.client.request<SchemaTypes.ItemDuplicateJobSchema>({
      method: 'POST',
      url: `/items/${itemId}/duplicate`,
    });
  }

  /**
   * Update a record
   *
   * Read more: https://www.datocms.com/docs/content-management-api/resources/item/update
   *
   * @throws {ApiError}
   * @throws {TimeoutError}
   */
  update(
    itemId: string | SimpleSchemaTypes.ItemData,
    body: SimpleSchemaTypes.ItemUpdateSchema,
  ) {
    return this.rawUpdate(
      Utils.toId(itemId),
      Utils.serializeRequestBody<SchemaTypes.ItemUpdateSchema>(body, {
        id: Utils.toId(itemId),
        type: 'item',
        attributes: '*',
        relationships: ['item_type', 'creator'],
      }),
    ).then((body) =>
      Utils.deserializeResponseBody<SimpleSchemaTypes.ItemUpdateTargetSchema>(
        body,
      ),
    );
  }

  /**
   * Update a record
   *
   * Read more: https://www.datocms.com/docs/content-management-api/resources/item/update
   *
   * @throws {ApiError}
   * @throws {TimeoutError}
   */
  rawUpdate(
    itemId: string,
    body: SchemaTypes.ItemUpdateSchema,
  ): Promise<SchemaTypes.ItemUpdateTargetSchema> {
    return this.client.request<SchemaTypes.ItemUpdateTargetSchema>({
      method: 'PUT',
      url: `/items/${itemId}`,
      body,
    });
  }

  /**
   * Referenced records
   *
   * Read more: https://www.datocms.com/docs/content-management-api/resources/item/references
   *
   * @throws {ApiError}
   * @throws {TimeoutError}
   */
  references(
    itemId: string | SimpleSchemaTypes.ItemData,
    queryParams?: SimpleSchemaTypes.ItemReferencesHrefSchema,
  ) {
    return this.rawReferences(Utils.toId(itemId), queryParams).then((body) =>
      Utils.deserializeResponseBody<SimpleSchemaTypes.ItemReferencesTargetSchema>(
        body,
      ),
    );
  }

  /**
   * Referenced records
   *
   * Read more: https://www.datocms.com/docs/content-management-api/resources/item/references
   *
   * @throws {ApiError}
   * @throws {TimeoutError}
   */
  rawReferences(
    itemId: string,
    queryParams?: SchemaTypes.ItemReferencesHrefSchema,
  ): Promise<SchemaTypes.ItemReferencesTargetSchema> {
    return this.client.request<SchemaTypes.ItemReferencesTargetSchema>({
      method: 'GET',
      url: `/items/${itemId}/references`,
      queryParams,
    });
  }

  /**
   * Retrieve a record
   *
   * Read more: https://www.datocms.com/docs/content-management-api/resources/item/self
   *
   * @throws {ApiError}
   * @throws {TimeoutError}
   */
  find(
    itemId: string | SimpleSchemaTypes.ItemData,
    queryParams?: SimpleSchemaTypes.ItemSelfHrefSchema,
  ) {
    return this.rawFind(Utils.toId(itemId), queryParams).then((body) =>
      Utils.deserializeResponseBody<SimpleSchemaTypes.ItemSelfTargetSchema>(
        body,
      ),
    );
  }

  /**
   * Retrieve a record
   *
   * Read more: https://www.datocms.com/docs/content-management-api/resources/item/self
   *
   * @throws {ApiError}
   * @throws {TimeoutError}
   */
  rawFind(
    itemId: string,
    queryParams?: SchemaTypes.ItemSelfHrefSchema,
  ): Promise<SchemaTypes.ItemSelfTargetSchema> {
    return this.client.request<SchemaTypes.ItemSelfTargetSchema>({
      method: 'GET',
      url: `/items/${itemId}`,
      queryParams,
    });
  }

  /**
   * Retrieve information regarding changes between current and published versions of the record
   *
   * Read more: https://www.datocms.com/docs/content-management-api/resources/item/current_vs_published_state
   *
   * @throws {ApiError}
   * @throws {TimeoutError}
   *
   * @deprecated This API call is to be considered private and might change without notice
   */
  currentVsPublishedState(itemId: string | SimpleSchemaTypes.ItemData) {
    return this.rawCurrentVsPublishedState(Utils.toId(itemId)).then((body) =>
      Utils.deserializeResponseBody<SimpleSchemaTypes.ItemCurrentVsPublishedStateTargetSchema>(
        body,
      ),
    );
  }

  /**
   * Retrieve information regarding changes between current and published versions of the record
   *
   * Read more: https://www.datocms.com/docs/content-management-api/resources/item/current_vs_published_state
   *
   * @throws {ApiError}
   * @throws {TimeoutError}
   *
   * @deprecated This API call is to be considered private and might change without notice
   */
  rawCurrentVsPublishedState(
    itemId: string,
  ): Promise<SchemaTypes.ItemCurrentVsPublishedStateTargetSchema> {
    return this.client.request<SchemaTypes.ItemCurrentVsPublishedStateTargetSchema>(
      {
        method: 'GET',
        url: `/items/${itemId}/current-vs-published-state`,
      },
    );
  }

  /**
   * Delete a record
   *
   * Read more: https://www.datocms.com/docs/content-management-api/resources/item/destroy
   *
   * @throws {ApiError}
   * @throws {TimeoutError}
   */
  destroy(itemId: string | SimpleSchemaTypes.ItemData) {
    return this.rawDestroy(Utils.toId(itemId)).then((body) =>
      Utils.deserializeResponseBody<SimpleSchemaTypes.ItemDestroyJobSchema>(
        body,
      ),
    );
  }

  /**
   * Delete a record
   *
   * Read more: https://www.datocms.com/docs/content-management-api/resources/item/destroy
   *
   * @throws {ApiError}
   * @throws {TimeoutError}
   */
  rawDestroy(itemId: string): Promise<SchemaTypes.ItemDestroyJobSchema> {
    return this.client.request<SchemaTypes.ItemDestroyJobSchema>({
      method: 'DELETE',
      url: `/items/${itemId}`,
    });
  }

  /**
   * Publish a record
   *
   * Read more: https://www.datocms.com/docs/content-management-api/resources/item/publish
   *
   * @throws {ApiError}
   * @throws {TimeoutError}
   */
  publish(
    itemId: string | SimpleSchemaTypes.ItemData,
    body?: SimpleSchemaTypes.ItemPublishSchema,
    queryParams?: SimpleSchemaTypes.ItemPublishHrefSchema,
  ) {
    return this.rawPublish(
      Utils.toId(itemId),
      body
        ? Utils.serializeRequestBody<SchemaTypes.ItemPublishSchema>(body, {
            type: 'selective_publish_operation',
            attributes: ['content_in_locales', 'non_localized_content'],
            relationships: [],
          })
        : null,
      queryParams,
    ).then((body) =>
      Utils.deserializeResponseBody<SimpleSchemaTypes.ItemPublishTargetSchema>(
        body,
      ),
    );
  }

  /**
   * Publish a record
   *
   * Read more: https://www.datocms.com/docs/content-management-api/resources/item/publish
   *
   * @throws {ApiError}
   * @throws {TimeoutError}
   */
  rawPublish(
    itemId: string,
    body?: SchemaTypes.ItemPublishSchema,
    queryParams?: SchemaTypes.ItemPublishHrefSchema,
  ): Promise<SchemaTypes.ItemPublishTargetSchema> {
    return this.client.request<SchemaTypes.ItemPublishTargetSchema>({
      method: 'PUT',
      url: `/items/${itemId}/publish`,
      body,
      queryParams,
    });
  }

  /**
   * Unpublish a record
   *
   * Read more: https://www.datocms.com/docs/content-management-api/resources/item/unpublish
   *
   * @throws {ApiError}
   * @throws {TimeoutError}
   */
  unpublish(
    itemId: string | SimpleSchemaTypes.ItemData,
    body?: SimpleSchemaTypes.ItemUnpublishSchema,
    queryParams?: SimpleSchemaTypes.ItemUnpublishHrefSchema,
  ) {
    return this.rawUnpublish(
      Utils.toId(itemId),
      body
        ? Utils.serializeRequestBody<SchemaTypes.ItemUnpublishSchema>(body, {
            type: 'selective_unpublish_operation',
            attributes: ['content_in_locales'],
            relationships: [],
          })
        : null,
      queryParams,
    ).then((body) =>
      Utils.deserializeResponseBody<SimpleSchemaTypes.ItemUnpublishTargetSchema>(
        body,
      ),
    );
  }

  /**
   * Unpublish a record
   *
   * Read more: https://www.datocms.com/docs/content-management-api/resources/item/unpublish
   *
   * @throws {ApiError}
   * @throws {TimeoutError}
   */
  rawUnpublish(
    itemId: string,
    body?: SchemaTypes.ItemUnpublishSchema,
    queryParams?: SchemaTypes.ItemUnpublishHrefSchema,
  ): Promise<SchemaTypes.ItemUnpublishTargetSchema> {
    return this.client.request<SchemaTypes.ItemUnpublishTargetSchema>({
      method: 'PUT',
      url: `/items/${itemId}/unpublish`,
      body,
      queryParams,
    });
  }

  /**
   * Publish items in bulk
   *
   * Read more: https://www.datocms.com/docs/content-management-api/resources/item/bulk_publish
   *
   * @throws {ApiError}
   * @throws {TimeoutError}
   */
  bulkPublish(body: SimpleSchemaTypes.ItemBulkPublishSchema) {
    return this.rawBulkPublish(
      Utils.serializeRequestBody<SchemaTypes.ItemBulkPublishSchema>(body, {
        type: 'item_bulk_publish_operation',
        attributes: [],
        relationships: ['items'],
      }),
    ).then((body) =>
      Utils.deserializeResponseBody<SimpleSchemaTypes.ItemBulkPublishJobSchema>(
        body,
      ),
    );
  }

  /**
   * Publish items in bulk
   *
   * Read more: https://www.datocms.com/docs/content-management-api/resources/item/bulk_publish
   *
   * @throws {ApiError}
   * @throws {TimeoutError}
   */
  rawBulkPublish(
    body: SchemaTypes.ItemBulkPublishSchema,
  ): Promise<SchemaTypes.ItemBulkPublishJobSchema> {
    return this.client.request<SchemaTypes.ItemBulkPublishJobSchema>({
      method: 'POST',
      url: '/items/bulk/publish',
      body,
    });
  }

  /**
   * Unpublish items in bulk
   *
   * Read more: https://www.datocms.com/docs/content-management-api/resources/item/bulk_unpublish
   *
   * @throws {ApiError}
   * @throws {TimeoutError}
   */
  bulkUnpublish(body: SimpleSchemaTypes.ItemBulkUnpublishSchema) {
    return this.rawBulkUnpublish(
      Utils.serializeRequestBody<SchemaTypes.ItemBulkUnpublishSchema>(body, {
        type: 'item_bulk_unpublish_operation',
        attributes: [],
        relationships: ['items'],
      }),
    ).then((body) =>
      Utils.deserializeResponseBody<SimpleSchemaTypes.ItemBulkUnpublishJobSchema>(
        body,
      ),
    );
  }

  /**
   * Unpublish items in bulk
   *
   * Read more: https://www.datocms.com/docs/content-management-api/resources/item/bulk_unpublish
   *
   * @throws {ApiError}
   * @throws {TimeoutError}
   */
  rawBulkUnpublish(
    body: SchemaTypes.ItemBulkUnpublishSchema,
  ): Promise<SchemaTypes.ItemBulkUnpublishJobSchema> {
    return this.client.request<SchemaTypes.ItemBulkUnpublishJobSchema>({
      method: 'POST',
      url: '/items/bulk/unpublish',
      body,
    });
  }

  /**
   * Destroy items in bulk
   *
   * Read more: https://www.datocms.com/docs/content-management-api/resources/item/bulk_destroy
   *
   * @throws {ApiError}
   * @throws {TimeoutError}
   */
  bulkDestroy(body: SimpleSchemaTypes.ItemBulkDestroySchema) {
    return this.rawBulkDestroy(
      Utils.serializeRequestBody<SchemaTypes.ItemBulkDestroySchema>(body, {
        type: 'item_bulk_destroy_operation',
        attributes: [],
        relationships: ['items'],
      }),
    ).then((body) =>
      Utils.deserializeResponseBody<SimpleSchemaTypes.ItemBulkDestroyJobSchema>(
        body,
      ),
    );
  }

  /**
   * Destroy items in bulk
   *
   * Read more: https://www.datocms.com/docs/content-management-api/resources/item/bulk_destroy
   *
   * @throws {ApiError}
   * @throws {TimeoutError}
   */
  rawBulkDestroy(
    body: SchemaTypes.ItemBulkDestroySchema,
  ): Promise<SchemaTypes.ItemBulkDestroyJobSchema> {
    return this.client.request<SchemaTypes.ItemBulkDestroyJobSchema>({
      method: 'POST',
      url: '/items/bulk/destroy',
      body,
    });
  }

  /**
   * Move items to stage in bulk
   *
   * Read more: https://www.datocms.com/docs/content-management-api/resources/item/bulk_move_to_stage
   *
   * @throws {ApiError}
   * @throws {TimeoutError}
   */
  bulkMoveToStage(body: SimpleSchemaTypes.ItemBulkMoveToStageSchema) {
    return this.rawBulkMoveToStage(
      Utils.serializeRequestBody<SchemaTypes.ItemBulkMoveToStageSchema>(body, {
        type: 'item_bulk_move_to_stage_operation',
        attributes: ['stage'],
        relationships: ['items'],
      }),
    ).then((body) =>
      Utils.deserializeResponseBody<SimpleSchemaTypes.ItemBulkMoveToStageJobSchema>(
        body,
      ),
    );
  }

  /**
   * Move items to stage in bulk
   *
   * Read more: https://www.datocms.com/docs/content-management-api/resources/item/bulk_move_to_stage
   *
   * @throws {ApiError}
   * @throws {TimeoutError}
   */
  rawBulkMoveToStage(
    body: SchemaTypes.ItemBulkMoveToStageSchema,
  ): Promise<SchemaTypes.ItemBulkMoveToStageJobSchema> {
    return this.client.request<SchemaTypes.ItemBulkMoveToStageJobSchema>({
      method: 'POST',
      url: '/items/bulk/move-to-stage',
      body,
    });
  }
}
