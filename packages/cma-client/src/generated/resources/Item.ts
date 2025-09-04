import * as Utils from '@datocms/rest-client-utils';
import BaseResource from '../../BaseResource';
import type * as ApiTypes from '../ApiTypes';
import type * as RawApiTypes from '../RawApiTypes';

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
  list(queryParams?: ApiTypes.ItemInstancesHrefSchema) {
    return this.rawList(queryParams).then((body) =>
      Utils.deserializeResponseBody<ApiTypes.ItemInstancesTargetSchema>(body),
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
    queryParams?: RawApiTypes.ItemInstancesHrefSchema,
  ): Promise<RawApiTypes.ItemInstancesTargetSchema> {
    return this.client.request<RawApiTypes.ItemInstancesTargetSchema>({
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
      ApiTypes.ItemInstancesHrefSchema,
      'page'
    >,
    iteratorOptions?: Utils.IteratorOptions,
  ) {
    for await (const element of this.rawListPagedIterator(
      queryParams,
      iteratorOptions,
    )) {
      yield Utils.deserializeJsonEntity<ApiTypes.ItemInstancesTargetSchema[0]>(
        element,
      );
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
      RawApiTypes.ItemInstancesHrefSchema,
      'page'
    >,
    iteratorOptions?: Utils.IteratorOptions,
  ) {
    Utils.warnOnPageQueryParam(queryParams);

    return Utils.rawPageIterator<
      RawApiTypes.ItemInstancesTargetSchema['data'][0]
    >(
      {
        defaultLimit: 30,
        maxLimit: 500,
      },
      (page: RawApiTypes.ItemInstancesHrefSchema['page']) =>
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
    itemId: string | ApiTypes.ItemData,
    body: ApiTypes.ItemValidateExistingSchema,
  ) {
    return this.rawValidateExisting(
      Utils.toId(itemId),
      Utils.serializeRequestBody<RawApiTypes.ItemValidateExistingSchema>(body, {
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
    body: RawApiTypes.ItemValidateExistingSchema,
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
  validateNew(body: ApiTypes.ItemValidateNewSchema) {
    return this.rawValidateNew(
      Utils.serializeRequestBody<RawApiTypes.ItemValidateNewSchema>(body, {
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
  rawValidateNew(body: RawApiTypes.ItemValidateNewSchema): Promise<void> {
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
  create(body: ApiTypes.ItemCreateSchema) {
    return this.rawCreate(
      Utils.serializeRequestBody<RawApiTypes.ItemCreateSchema>(body, {
        type: 'item',
        attributes: '*',
        relationships: ['item_type', 'creator'],
      }),
    ).then((body) =>
      Utils.deserializeResponseBody<ApiTypes.ItemCreateTargetSchema>(body),
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
    body: RawApiTypes.ItemCreateSchema,
  ): Promise<RawApiTypes.ItemCreateTargetSchema> {
    return this.client.request<RawApiTypes.ItemCreateTargetSchema>({
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
  duplicate(itemId: string | ApiTypes.ItemData) {
    return this.rawDuplicate(Utils.toId(itemId)).then((body) =>
      Utils.deserializeResponseBody<ApiTypes.ItemDuplicateJobSchema>(body),
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
  rawDuplicate(itemId: string): Promise<RawApiTypes.ItemDuplicateJobSchema> {
    return this.client.request<RawApiTypes.ItemDuplicateJobSchema>({
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
  update(itemId: string | ApiTypes.ItemData, body: ApiTypes.ItemUpdateSchema) {
    return this.rawUpdate(
      Utils.toId(itemId),
      Utils.serializeRequestBody<RawApiTypes.ItemUpdateSchema>(body, {
        id: Utils.toId(itemId),
        type: 'item',
        attributes: '*',
        relationships: ['item_type', 'creator'],
      }),
    ).then((body) =>
      Utils.deserializeResponseBody<ApiTypes.ItemUpdateTargetSchema>(body),
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
    body: RawApiTypes.ItemUpdateSchema,
  ): Promise<RawApiTypes.ItemUpdateTargetSchema> {
    return this.client.request<RawApiTypes.ItemUpdateTargetSchema>({
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
    itemId: string | ApiTypes.ItemData,
    queryParams?: ApiTypes.ItemReferencesHrefSchema,
  ) {
    return this.rawReferences(Utils.toId(itemId), queryParams).then((body) =>
      Utils.deserializeResponseBody<ApiTypes.ItemReferencesTargetSchema>(body),
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
    queryParams?: RawApiTypes.ItemReferencesHrefSchema,
  ): Promise<RawApiTypes.ItemReferencesTargetSchema> {
    return this.client.request<RawApiTypes.ItemReferencesTargetSchema>({
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
    itemId: string | ApiTypes.ItemData,
    queryParams?: ApiTypes.ItemSelfHrefSchema,
  ) {
    return this.rawFind(Utils.toId(itemId), queryParams).then((body) =>
      Utils.deserializeResponseBody<ApiTypes.ItemSelfTargetSchema>(body),
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
    queryParams?: RawApiTypes.ItemSelfHrefSchema,
  ): Promise<RawApiTypes.ItemSelfTargetSchema> {
    return this.client.request<RawApiTypes.ItemSelfTargetSchema>({
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
  currentVsPublishedState(itemId: string | ApiTypes.ItemData) {
    return this.rawCurrentVsPublishedState(Utils.toId(itemId)).then((body) =>
      Utils.deserializeResponseBody<ApiTypes.ItemCurrentVsPublishedStateTargetSchema>(
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
  ): Promise<RawApiTypes.ItemCurrentVsPublishedStateTargetSchema> {
    return this.client.request<RawApiTypes.ItemCurrentVsPublishedStateTargetSchema>(
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
  destroy(itemId: string | ApiTypes.ItemData) {
    return this.rawDestroy(Utils.toId(itemId)).then((body) =>
      Utils.deserializeResponseBody<ApiTypes.ItemDestroyJobSchema>(body),
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
  rawDestroy(itemId: string): Promise<RawApiTypes.ItemDestroyJobSchema> {
    return this.client.request<RawApiTypes.ItemDestroyJobSchema>({
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
    itemId: string | ApiTypes.ItemData,
    body?: ApiTypes.ItemPublishSchema,
    queryParams?: ApiTypes.ItemPublishHrefSchema,
  ) {
    return this.rawPublish(
      Utils.toId(itemId),
      body
        ? Utils.serializeRequestBody<RawApiTypes.ItemPublishSchema>(body, {
            type: 'selective_publish_operation',
            attributes: ['content_in_locales', 'non_localized_content'],
            relationships: [],
          })
        : null,
      queryParams,
    ).then((body) =>
      Utils.deserializeResponseBody<ApiTypes.ItemPublishTargetSchema>(body),
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
    body?: RawApiTypes.ItemPublishSchema,
    queryParams?: RawApiTypes.ItemPublishHrefSchema,
  ): Promise<RawApiTypes.ItemPublishTargetSchema> {
    return this.client.request<RawApiTypes.ItemPublishTargetSchema>({
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
    itemId: string | ApiTypes.ItemData,
    body?: ApiTypes.ItemUnpublishSchema,
    queryParams?: ApiTypes.ItemUnpublishHrefSchema,
  ) {
    return this.rawUnpublish(
      Utils.toId(itemId),
      body
        ? Utils.serializeRequestBody<RawApiTypes.ItemUnpublishSchema>(body, {
            type: 'selective_unpublish_operation',
            attributes: ['content_in_locales'],
            relationships: [],
          })
        : null,
      queryParams,
    ).then((body) =>
      Utils.deserializeResponseBody<ApiTypes.ItemUnpublishTargetSchema>(body),
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
    body?: RawApiTypes.ItemUnpublishSchema,
    queryParams?: RawApiTypes.ItemUnpublishHrefSchema,
  ): Promise<RawApiTypes.ItemUnpublishTargetSchema> {
    return this.client.request<RawApiTypes.ItemUnpublishTargetSchema>({
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
  bulkPublish(body: ApiTypes.ItemBulkPublishSchema) {
    return this.rawBulkPublish(
      Utils.serializeRequestBody<RawApiTypes.ItemBulkPublishSchema>(body, {
        type: 'item_bulk_publish_operation',
        attributes: [],
        relationships: ['items'],
      }),
    ).then((body) =>
      Utils.deserializeResponseBody<ApiTypes.ItemBulkPublishJobSchema>(body),
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
    body: RawApiTypes.ItemBulkPublishSchema,
  ): Promise<RawApiTypes.ItemBulkPublishJobSchema> {
    return this.client.request<RawApiTypes.ItemBulkPublishJobSchema>({
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
  bulkUnpublish(body: ApiTypes.ItemBulkUnpublishSchema) {
    return this.rawBulkUnpublish(
      Utils.serializeRequestBody<RawApiTypes.ItemBulkUnpublishSchema>(body, {
        type: 'item_bulk_unpublish_operation',
        attributes: [],
        relationships: ['items'],
      }),
    ).then((body) =>
      Utils.deserializeResponseBody<ApiTypes.ItemBulkUnpublishJobSchema>(body),
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
    body: RawApiTypes.ItemBulkUnpublishSchema,
  ): Promise<RawApiTypes.ItemBulkUnpublishJobSchema> {
    return this.client.request<RawApiTypes.ItemBulkUnpublishJobSchema>({
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
  bulkDestroy(body: ApiTypes.ItemBulkDestroySchema) {
    return this.rawBulkDestroy(
      Utils.serializeRequestBody<RawApiTypes.ItemBulkDestroySchema>(body, {
        type: 'item_bulk_destroy_operation',
        attributes: [],
        relationships: ['items'],
      }),
    ).then((body) =>
      Utils.deserializeResponseBody<ApiTypes.ItemBulkDestroyJobSchema>(body),
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
    body: RawApiTypes.ItemBulkDestroySchema,
  ): Promise<RawApiTypes.ItemBulkDestroyJobSchema> {
    return this.client.request<RawApiTypes.ItemBulkDestroyJobSchema>({
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
  bulkMoveToStage(body: ApiTypes.ItemBulkMoveToStageSchema) {
    return this.rawBulkMoveToStage(
      Utils.serializeRequestBody<RawApiTypes.ItemBulkMoveToStageSchema>(body, {
        type: 'item_bulk_move_to_stage_operation',
        attributes: ['stage'],
        relationships: ['items'],
      }),
    ).then((body) =>
      Utils.deserializeResponseBody<ApiTypes.ItemBulkMoveToStageJobSchema>(
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
    body: RawApiTypes.ItemBulkMoveToStageSchema,
  ): Promise<RawApiTypes.ItemBulkMoveToStageJobSchema> {
    return this.client.request<RawApiTypes.ItemBulkMoveToStageJobSchema>({
      method: 'POST',
      url: '/items/bulk/move-to-stage',
      body,
    });
  }
}
