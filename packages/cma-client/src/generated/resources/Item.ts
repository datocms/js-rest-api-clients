import * as Utils from '@datocms/rest-client-utils';
import * as SchemaTypes from '../SchemaTypes';
import * as SimpleSchemaTypes from '../SimpleSchemaTypes';
import BaseResource from '../../BaseResource';

export default class Item extends BaseResource {
  static readonly TYPE: 'item' = 'item';

  /**
   * List all records
   *
   * Read more: https://www.datocms.com/docs/content-management-api/resources/item/instances
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
   */
  rawList(
    queryParams?: SchemaTypes.ItemInstancesHrefSchema,
  ): Promise<SchemaTypes.ItemInstancesTargetSchema> {
    return this.client.request<SchemaTypes.ItemInstancesTargetSchema>({
      method: 'GET',
      url: `/items`,
      queryParams,
    });
  }

  /**
   * Async iterator to auto-paginate over elements returned by list()
   *
   * Read more: https://www.datocms.com/docs/content-management-api/resources/item/instances
   */
  async *listPagedIterator(
    queryParams?: SimpleSchemaTypes.ItemInstancesHrefSchema,
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
   */
  rawListPagedIterator(
    queryParams?: SchemaTypes.ItemInstancesHrefSchema,
    iteratorOptions?: Utils.IteratorOptions,
  ) {
    return Utils.rawPageIterator<
      SchemaTypes.ItemInstancesTargetSchema['data'][0]
    >(
      {
        defaultLimit: 30,
        maxLimit: 500,
      },
      (page) => this.rawList({ ...queryParams, page }),
      iteratorOptions,
    );
  }

  /**
   * Validates an existing record field
   *
   * Read more: https://www.datocms.com/docs/content-management-api/resources/item/validate_existing
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
   * @deprecated This API call is to be considered private and might change without notice
   */
  validateNew(body: SimpleSchemaTypes.ItemValidateNewSchema) {
    return this.rawValidateNew(
      Utils.serializeRequestBody<SchemaTypes.ItemValidateNewSchema>(body, {
        type: 'item',
        attributes: '*',
        relationships: ['item_type'],
      }),
    );
  }

  /**
   * Validates a record field
   *
   * Read more: https://www.datocms.com/docs/content-management-api/resources/item/validate_new
   *
   * @deprecated This API call is to be considered private and might change without notice
   */
  rawValidateNew(body: SchemaTypes.ItemValidateNewSchema): Promise<void> {
    return this.client.request<void>({
      method: 'POST',
      url: `/items/validate`,
      body,
    });
  }

  /**
   * Create a new record
   *
   * Read more: https://www.datocms.com/docs/content-management-api/resources/item/create
   */
  create(body: SimpleSchemaTypes.ItemCreateSchema) {
    return this.rawCreate(
      Utils.serializeRequestBody<SchemaTypes.ItemCreateSchema>(body, {
        type: 'item',
        attributes: '*',
        relationships: ['item_type'],
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
   */
  rawCreate(
    body: SchemaTypes.ItemCreateSchema,
  ): Promise<SchemaTypes.ItemCreateTargetSchema> {
    return this.client.request<SchemaTypes.ItemCreateTargetSchema>({
      method: 'POST',
      url: `/items`,
      body,
    });
  }

  /**
   * Duplicate a record
   *
   * Read more: https://www.datocms.com/docs/content-management-api/resources/item/duplicate
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
   * Delete a record
   *
   * Read more: https://www.datocms.com/docs/content-management-api/resources/item/destroy
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
   */
  rawDestroy(itemId: string): Promise<SchemaTypes.ItemDestroyJobSchema> {
    return this.client.request<SchemaTypes.ItemDestroyJobSchema>({
      method: 'DELETE',
      url: `/items/${itemId}`,
    });
  }

  /**
   * Delete multiple records
   *
   * Read more: https://www.datocms.com/docs/content-management-api/resources/item/batch_destroy
   *
   * @deprecated This API call is to be considered private and might change without notice
   */
  batchDestroy(queryParams?: SimpleSchemaTypes.ItemBatchDestroyHrefSchema) {
    return this.rawBatchDestroy(queryParams).then((body) =>
      Utils.deserializeResponseBody<SimpleSchemaTypes.ItemBatchDestroyJobSchema>(
        body,
      ),
    );
  }

  /**
   * Delete multiple records
   *
   * Read more: https://www.datocms.com/docs/content-management-api/resources/item/batch_destroy
   *
   * @deprecated This API call is to be considered private and might change without notice
   */
  rawBatchDestroy(
    queryParams?: SchemaTypes.ItemBatchDestroyHrefSchema,
  ): Promise<SchemaTypes.ItemBatchDestroyJobSchema> {
    return this.client.request<SchemaTypes.ItemBatchDestroyJobSchema>({
      method: 'DELETE',
      url: `/items`,
      queryParams,
    });
  }

  /**
   * Publish multiple records
   *
   * Read more: https://www.datocms.com/docs/content-management-api/resources/item/batch_publish
   *
   * @deprecated This API call is to be considered private and might change without notice
   */
  batchPublish(queryParams?: SimpleSchemaTypes.ItemBatchPublishHrefSchema) {
    return this.rawBatchPublish(queryParams).then((body) =>
      Utils.deserializeResponseBody<SimpleSchemaTypes.ItemBatchPublishJobSchema>(
        body,
      ),
    );
  }

  /**
   * Publish multiple records
   *
   * Read more: https://www.datocms.com/docs/content-management-api/resources/item/batch_publish
   *
   * @deprecated This API call is to be considered private and might change without notice
   */
  rawBatchPublish(
    queryParams?: SchemaTypes.ItemBatchPublishHrefSchema,
  ): Promise<SchemaTypes.ItemBatchPublishJobSchema> {
    return this.client.request<SchemaTypes.ItemBatchPublishJobSchema>({
      method: 'PUT',
      url: `/items/publish`,
      queryParams,
    });
  }

  /**
   * Unpublish multiple records
   *
   * Read more: https://www.datocms.com/docs/content-management-api/resources/item/batch_unpublish
   *
   * @deprecated This API call is to be considered private and might change without notice
   */
  batchUnpublish(queryParams?: SimpleSchemaTypes.ItemBatchUnpublishHrefSchema) {
    return this.rawBatchUnpublish(queryParams).then((body) =>
      Utils.deserializeResponseBody<SimpleSchemaTypes.ItemBatchUnpublishJobSchema>(
        body,
      ),
    );
  }

  /**
   * Unpublish multiple records
   *
   * Read more: https://www.datocms.com/docs/content-management-api/resources/item/batch_unpublish
   *
   * @deprecated This API call is to be considered private and might change without notice
   */
  rawBatchUnpublish(
    queryParams?: SchemaTypes.ItemBatchUnpublishHrefSchema,
  ): Promise<SchemaTypes.ItemBatchUnpublishJobSchema> {
    return this.client.request<SchemaTypes.ItemBatchUnpublishJobSchema>({
      method: 'PUT',
      url: `/items/unpublish`,
      queryParams,
    });
  }

  /**
   * Publish a record
   *
   * Read more: https://www.datocms.com/docs/content-management-api/resources/item/publish
   */
  publish(
    itemId: string | SimpleSchemaTypes.ItemData,
    queryParams?: SimpleSchemaTypes.ItemPublishHrefSchema,
  ) {
    return this.rawPublish(Utils.toId(itemId), queryParams).then((body) =>
      Utils.deserializeResponseBody<SimpleSchemaTypes.ItemPublishTargetSchema>(
        body,
      ),
    );
  }

  /**
   * Publish a record
   *
   * Read more: https://www.datocms.com/docs/content-management-api/resources/item/publish
   */
  rawPublish(
    itemId: string,
    queryParams?: SchemaTypes.ItemPublishHrefSchema,
  ): Promise<SchemaTypes.ItemPublishTargetSchema> {
    return this.client.request<SchemaTypes.ItemPublishTargetSchema>({
      method: 'PUT',
      url: `/items/${itemId}/publish`,
      queryParams,
    });
  }

  /**
   * Unpublish a record
   *
   * Read more: https://www.datocms.com/docs/content-management-api/resources/item/unpublish
   */
  unpublish(
    itemId: string | SimpleSchemaTypes.ItemData,
    queryParams?: SimpleSchemaTypes.ItemUnpublishHrefSchema,
  ) {
    return this.rawUnpublish(Utils.toId(itemId), queryParams).then((body) =>
      Utils.deserializeResponseBody<SimpleSchemaTypes.ItemUnpublishTargetSchema>(
        body,
      ),
    );
  }

  /**
   * Unpublish a record
   *
   * Read more: https://www.datocms.com/docs/content-management-api/resources/item/unpublish
   */
  rawUnpublish(
    itemId: string,
    queryParams?: SchemaTypes.ItemUnpublishHrefSchema,
  ): Promise<SchemaTypes.ItemUnpublishTargetSchema> {
    return this.client.request<SchemaTypes.ItemUnpublishTargetSchema>({
      method: 'PUT',
      url: `/items/${itemId}/unpublish`,
      queryParams,
    });
  }

  /**
   * Publish items in bulk
   *
   * Read more: https://www.datocms.com/docs/content-management-api/resources/item/bulk_publish
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
   */
  rawBulkPublish(
    body: SchemaTypes.ItemBulkPublishSchema,
  ): Promise<SchemaTypes.ItemBulkPublishJobSchema> {
    return this.client.request<SchemaTypes.ItemBulkPublishJobSchema>({
      method: 'POST',
      url: `/items/bulk/publish`,
      body,
    });
  }

  /**
   * Unpublish items in bulk
   *
   * Read more: https://www.datocms.com/docs/content-management-api/resources/item/bulk_unpublish
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
   */
  rawBulkUnpublish(
    body: SchemaTypes.ItemBulkUnpublishSchema,
  ): Promise<SchemaTypes.ItemBulkUnpublishJobSchema> {
    return this.client.request<SchemaTypes.ItemBulkUnpublishJobSchema>({
      method: 'POST',
      url: `/items/bulk/unpublish`,
      body,
    });
  }

  /**
   * Destroy items in bulk
   *
   * Read more: https://www.datocms.com/docs/content-management-api/resources/item/bulk_destroy
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
   */
  rawBulkDestroy(
    body: SchemaTypes.ItemBulkDestroySchema,
  ): Promise<SchemaTypes.ItemBulkDestroyJobSchema> {
    return this.client.request<SchemaTypes.ItemBulkDestroyJobSchema>({
      method: 'POST',
      url: `/items/bulk/destroy`,
      body,
    });
  }

  /**
   * Move items to stage in bulk
   *
   * Read more: https://www.datocms.com/docs/content-management-api/resources/item/bulk_move_to_stage
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
   */
  rawBulkMoveToStage(
    body: SchemaTypes.ItemBulkMoveToStageSchema,
  ): Promise<SchemaTypes.ItemBulkMoveToStageJobSchema> {
    return this.client.request<SchemaTypes.ItemBulkMoveToStageJobSchema>({
      method: 'POST',
      url: `/items/bulk/move-to-stage`,
      body,
    });
  }
}
