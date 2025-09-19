import * as Utils from '@datocms/rest-client-utils';
import BaseResource from '../../BaseResource';
import type {
  ItemTypeDefinition,
  ToItemDefinition,
  ToItemDefinitionAsRequest,
  ToItemDefinitionWithNestedBlocks,
} from '../../utilities/itemDefinition';
import type * as ApiTypes from '../ApiTypes';
import type * as RawApiTypes from '../RawApiTypes';

type NoInfer<T> = [T][T extends any ? 0 : never];

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
  list<D extends ItemTypeDefinition = ItemTypeDefinition>(
    queryParams: ApiTypes.ItemInstancesHrefSchema & { nested: true },
  ): Promise<
    ApiTypes.ItemInstancesTargetSchema<
      ToItemDefinitionWithNestedBlocks<NoInfer<D>>
    >
  >;
  list<D extends ItemTypeDefinition = ItemTypeDefinition>(
    queryParams?: ApiTypes.ItemInstancesHrefSchema & {
      nested?: false | undefined;
    },
  ): Promise<ApiTypes.ItemInstancesTargetSchema<ToItemDefinition<NoInfer<D>>>>;
  /**
   * List all records
   *
   * Read more: https://www.datocms.com/docs/content-management-api/resources/item/instances
   *
   * @throws {ApiError}
   * @throws {TimeoutError}
   */
  list<D extends ItemTypeDefinition = ItemTypeDefinition>(
    queryParams?: ApiTypes.ItemInstancesHrefSchema,
  ) {
    return this.rawList<D>(queryParams).then((body) =>
      Utils.deserializeResponseBody(body),
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
  rawList<D extends ItemTypeDefinition = ItemTypeDefinition>(
    queryParams: RawApiTypes.ItemInstancesHrefSchema & { nested: true },
  ): Promise<
    RawApiTypes.ItemInstancesTargetSchema<
      ToItemDefinitionWithNestedBlocks<NoInfer<D>>
    >
  >;
  rawList<D extends ItemTypeDefinition = ItemTypeDefinition>(
    queryParams?: RawApiTypes.ItemInstancesHrefSchema & {
      nested?: false | undefined;
    },
  ): Promise<
    RawApiTypes.ItemInstancesTargetSchema<ToItemDefinition<NoInfer<D>>>
  >;
  rawList<D extends ItemTypeDefinition = ItemTypeDefinition>(
    queryParams?: RawApiTypes.ItemInstancesHrefSchema,
  ): Promise<
    RawApiTypes.ItemInstancesTargetSchema<
      ToItemDefinitionWithNestedBlocks<NoInfer<D>>
    >
  >;
  /**
   * List all records
   *
   * Read more: https://www.datocms.com/docs/content-management-api/resources/item/instances
   *
   * @throws {ApiError}
   * @throws {TimeoutError}
   */
  rawList<D extends ItemTypeDefinition = ItemTypeDefinition>(
    queryParams?: RawApiTypes.ItemInstancesHrefSchema,
  ) {
    return this.client
      .request({
        method: 'GET',
        url: '/items',
        queryParams,
      })
      .then<
        RawApiTypes.ItemInstancesTargetSchema<
          ToItemDefinitionWithNestedBlocks<NoInfer<D>>
        >
      >(Utils.deserializeRawResponseBodyWithItems);
  }

  /**
   * Async iterator to auto-paginate over elements returned by list()
   *
   * Read more: https://www.datocms.com/docs/content-management-api/resources/item/instances
   *
   * @throws {ApiError}
   * @throws {TimeoutError}
   */
  async *listPagedIterator<D extends ItemTypeDefinition = ItemTypeDefinition>(
    queryParams?: Utils.OmitFromKnownKeys<
      ApiTypes.ItemInstancesHrefSchema,
      'page'
    >,
    iteratorOptions?: Utils.IteratorOptions,
  ) {
    for await (const element of this.rawListPagedIterator<NoInfer<D>>(
      queryParams,
      iteratorOptions,
    )) {
      yield Utils.deserializeJsonEntity<
        ApiTypes.ItemInstancesTargetSchema<
          ToItemDefinitionWithNestedBlocks<NoInfer<D>>
        >[0]
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
  rawListPagedIterator<D extends ItemTypeDefinition = ItemTypeDefinition>(
    queryParams?: Utils.OmitFromKnownKeys<
      RawApiTypes.ItemInstancesHrefSchema,
      'page'
    >,
    iteratorOptions?: Utils.IteratorOptions,
  ) {
    Utils.warnOnPageQueryParam(queryParams);

    return Utils.rawPageIterator<
      RawApiTypes.ItemInstancesTargetSchema<
        ToItemDefinitionWithNestedBlocks<NoInfer<D>>
      >['data'][0]
    >(
      {
        defaultLimit: 30,
        maxLimit: 500,
      },
      (page: RawApiTypes.ItemInstancesHrefSchema['page']) =>
        this.rawList<D>({ ...queryParams, page }),
      iteratorOptions,
      true,
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
  validateExisting<D extends ItemTypeDefinition = ItemTypeDefinition>(
    itemId: string | ApiTypes.ItemData,
    body: ApiTypes.ItemValidateExistingSchema<
      ToItemDefinitionAsRequest<NoInfer<D>>
    >,
  ) {
    return this.rawValidateExisting(
      Utils.toId(itemId),
      Utils.serializeRequestBody<
        RawApiTypes.ItemValidateExistingSchema<
          ToItemDefinitionAsRequest<NoInfer<D>>
        >
      >(body, {
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
  rawValidateExisting<D extends ItemTypeDefinition = ItemTypeDefinition>(
    itemId: string,
    body: RawApiTypes.ItemValidateExistingSchema<
      ToItemDefinitionAsRequest<NoInfer<D>>
    >,
  ): Promise<void> {
    return this.client.request<void>({
      method: 'POST',
      url: `/items/${itemId}/validate`,
      body: Utils.serializeRawRequestBodyWithItems(body),
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
  validateNew<D extends ItemTypeDefinition = ItemTypeDefinition>(
    body: ApiTypes.ItemValidateNewSchema<ToItemDefinitionAsRequest<NoInfer<D>>>,
  ) {
    return this.rawValidateNew(
      Utils.serializeRequestBody<
        RawApiTypes.ItemValidateNewSchema<ToItemDefinitionAsRequest<NoInfer<D>>>
      >(body, {
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
  rawValidateNew<D extends ItemTypeDefinition = ItemTypeDefinition>(
    body: RawApiTypes.ItemValidateNewSchema<
      ToItemDefinitionAsRequest<NoInfer<D>>
    >,
  ): Promise<void> {
    return this.client.request<void>({
      method: 'POST',
      url: '/items/validate',
      body: Utils.serializeRawRequestBodyWithItems(body),
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
  create<D extends ItemTypeDefinition = ItemTypeDefinition>(
    body: ApiTypes.ItemCreateSchema<ToItemDefinitionAsRequest<NoInfer<D>>>,
  ) {
    return this.rawCreate<D>(
      Utils.serializeRequestBody<
        RawApiTypes.ItemCreateSchema<ToItemDefinitionAsRequest<NoInfer<D>>>
      >(body, {
        type: 'item',
        attributes: '*',
        relationships: ['item_type', 'creator'],
      }),
    ).then((body) =>
      Utils.deserializeResponseBody<
        ApiTypes.ItemCreateTargetSchema<ToItemDefinition<NoInfer<D>>>
      >(body),
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
  rawCreate<D extends ItemTypeDefinition = ItemTypeDefinition>(
    body: RawApiTypes.ItemCreateSchema<ToItemDefinitionAsRequest<NoInfer<D>>>,
  ): Promise<
    RawApiTypes.ItemCreateTargetSchema<
      ToItemDefinitionWithNestedBlocks<NoInfer<D>>
    >
  > {
    return this.client
      .request({
        method: 'POST',
        url: '/items',
        body: Utils.serializeRawRequestBodyWithItems(body),
      })
      .then<
        RawApiTypes.ItemCreateTargetSchema<
          ToItemDefinitionWithNestedBlocks<NoInfer<D>>
        >
      >(Utils.deserializeRawResponseBodyWithItems);
  }

  /**
   * Duplicate a record
   *
   * Read more: https://www.datocms.com/docs/content-management-api/resources/item/duplicate
   *
   * @throws {ApiError}
   * @throws {TimeoutError}
   */
  duplicate<D extends ItemTypeDefinition = ItemTypeDefinition>(
    itemId: string | ApiTypes.ItemData,
  ) {
    return this.rawDuplicate<D>(Utils.toId(itemId)).then((body) =>
      Utils.deserializeResponseBody<
        ApiTypes.ItemDuplicateJobSchema<ToItemDefinition<NoInfer<D>>>
      >(body),
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
  rawDuplicate<D extends ItemTypeDefinition = ItemTypeDefinition>(
    itemId: string,
  ): Promise<
    RawApiTypes.ItemDuplicateJobSchema<
      ToItemDefinitionWithNestedBlocks<NoInfer<D>>
    >
  > {
    return this.client
      .request({
        method: 'POST',
        url: `/items/${itemId}/duplicate`,
      })
      .then<
        RawApiTypes.ItemDuplicateJobSchema<
          ToItemDefinitionWithNestedBlocks<NoInfer<D>>
        >
      >(Utils.deserializeRawResponseBodyWithItems);
  }

  /**
   * Update a record
   *
   * Read more: https://www.datocms.com/docs/content-management-api/resources/item/update
   *
   * @throws {ApiError}
   * @throws {TimeoutError}
   */
  update<D extends ItemTypeDefinition = ItemTypeDefinition>(
    itemId: string | ApiTypes.ItemData,
    body: ApiTypes.ItemUpdateSchema<ToItemDefinitionAsRequest<NoInfer<D>>>,
  ) {
    return this.rawUpdate<D>(
      Utils.toId(itemId),
      Utils.serializeRequestBody<
        RawApiTypes.ItemUpdateSchema<ToItemDefinitionAsRequest<NoInfer<D>>>
      >(body, {
        id: Utils.toId(itemId),
        type: 'item',
        attributes: '*',
        relationships: ['item_type', 'creator'],
      }),
    ).then((body) =>
      Utils.deserializeResponseBody<
        ApiTypes.ItemUpdateTargetSchema<ToItemDefinition<NoInfer<D>>>
      >(body),
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
  rawUpdate<D extends ItemTypeDefinition = ItemTypeDefinition>(
    itemId: string,
    body: RawApiTypes.ItemUpdateSchema<ToItemDefinitionAsRequest<NoInfer<D>>>,
  ): Promise<
    RawApiTypes.ItemUpdateTargetSchema<
      ToItemDefinitionWithNestedBlocks<NoInfer<D>>
    >
  > {
    return this.client
      .request({
        method: 'PUT',
        url: `/items/${itemId}`,
        body: Utils.serializeRawRequestBodyWithItems(body),
      })
      .then<
        RawApiTypes.ItemUpdateTargetSchema<
          ToItemDefinitionWithNestedBlocks<NoInfer<D>>
        >
      >(Utils.deserializeRawResponseBodyWithItems);
  }

  /**
   * Referenced records
   *
   * Read more: https://www.datocms.com/docs/content-management-api/resources/item/references
   *
   * @throws {ApiError}
   * @throws {TimeoutError}
   */
  references<D extends ItemTypeDefinition = ItemTypeDefinition>(
    itemId: string | ApiTypes.ItemData,
    queryParams: ApiTypes.ItemReferencesHrefSchema & { nested: true },
  ): Promise<
    ApiTypes.ItemReferencesTargetSchema<
      ToItemDefinitionWithNestedBlocks<NoInfer<D>>
    >
  >;
  references<D extends ItemTypeDefinition = ItemTypeDefinition>(
    itemId: string | ApiTypes.ItemData,
    queryParams?: ApiTypes.ItemReferencesHrefSchema & {
      nested?: false | undefined;
    },
  ): Promise<ApiTypes.ItemReferencesTargetSchema<ToItemDefinition<NoInfer<D>>>>;
  /**
   * Referenced records
   *
   * Read more: https://www.datocms.com/docs/content-management-api/resources/item/references
   *
   * @throws {ApiError}
   * @throws {TimeoutError}
   */
  references<D extends ItemTypeDefinition = ItemTypeDefinition>(
    itemId: string | ApiTypes.ItemData,
    queryParams?: ApiTypes.ItemReferencesHrefSchema,
  ) {
    return this.rawReferences<D>(Utils.toId(itemId), queryParams).then((body) =>
      Utils.deserializeResponseBody(body),
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
  rawReferences<D extends ItemTypeDefinition = ItemTypeDefinition>(
    itemId: string,
    queryParams: RawApiTypes.ItemReferencesHrefSchema & { nested: true },
  ): Promise<
    RawApiTypes.ItemReferencesTargetSchema<
      ToItemDefinitionWithNestedBlocks<NoInfer<D>>
    >
  >;
  rawReferences<D extends ItemTypeDefinition = ItemTypeDefinition>(
    itemId: string,
    queryParams?: RawApiTypes.ItemReferencesHrefSchema & {
      nested?: false | undefined;
    },
  ): Promise<
    RawApiTypes.ItemReferencesTargetSchema<ToItemDefinition<NoInfer<D>>>
  >;
  rawReferences<D extends ItemTypeDefinition = ItemTypeDefinition>(
    itemId: string,
    queryParams?: RawApiTypes.ItemReferencesHrefSchema,
  ): Promise<
    RawApiTypes.ItemReferencesTargetSchema<
      ToItemDefinitionWithNestedBlocks<NoInfer<D>>
    >
  >;
  /**
   * Referenced records
   *
   * Read more: https://www.datocms.com/docs/content-management-api/resources/item/references
   *
   * @throws {ApiError}
   * @throws {TimeoutError}
   */
  rawReferences<D extends ItemTypeDefinition = ItemTypeDefinition>(
    itemId: string,
    queryParams?: RawApiTypes.ItemReferencesHrefSchema,
  ) {
    return this.client
      .request({
        method: 'GET',
        url: `/items/${itemId}/references`,
        queryParams,
      })
      .then<
        RawApiTypes.ItemReferencesTargetSchema<
          ToItemDefinitionWithNestedBlocks<NoInfer<D>>
        >
      >(Utils.deserializeRawResponseBodyWithItems);
  }

  /**
   * Retrieve a record
   *
   * Read more: https://www.datocms.com/docs/content-management-api/resources/item/self
   *
   * @throws {ApiError}
   * @throws {TimeoutError}
   */
  find<D extends ItemTypeDefinition = ItemTypeDefinition>(
    itemId: string | ApiTypes.ItemData,
    queryParams: ApiTypes.ItemSelfHrefSchema & { nested: true },
  ): Promise<
    ApiTypes.ItemSelfTargetSchema<ToItemDefinitionWithNestedBlocks<NoInfer<D>>>
  >;
  find<D extends ItemTypeDefinition = ItemTypeDefinition>(
    itemId: string | ApiTypes.ItemData,
    queryParams?: ApiTypes.ItemSelfHrefSchema & { nested?: false | undefined },
  ): Promise<ApiTypes.ItemSelfTargetSchema<ToItemDefinition<NoInfer<D>>>>;
  /**
   * Retrieve a record
   *
   * Read more: https://www.datocms.com/docs/content-management-api/resources/item/self
   *
   * @throws {ApiError}
   * @throws {TimeoutError}
   */
  find<D extends ItemTypeDefinition = ItemTypeDefinition>(
    itemId: string | ApiTypes.ItemData,
    queryParams?: ApiTypes.ItemSelfHrefSchema,
  ) {
    return this.rawFind<D>(Utils.toId(itemId), queryParams).then((body) =>
      Utils.deserializeResponseBody(body),
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
  rawFind<D extends ItemTypeDefinition = ItemTypeDefinition>(
    itemId: string,
    queryParams: RawApiTypes.ItemSelfHrefSchema & { nested: true },
  ): Promise<
    RawApiTypes.ItemSelfTargetSchema<
      ToItemDefinitionWithNestedBlocks<NoInfer<D>>
    >
  >;
  rawFind<D extends ItemTypeDefinition = ItemTypeDefinition>(
    itemId: string,
    queryParams?: RawApiTypes.ItemSelfHrefSchema & {
      nested?: false | undefined;
    },
  ): Promise<RawApiTypes.ItemSelfTargetSchema<ToItemDefinition<NoInfer<D>>>>;
  rawFind<D extends ItemTypeDefinition = ItemTypeDefinition>(
    itemId: string,
    queryParams?: RawApiTypes.ItemSelfHrefSchema,
  ): Promise<
    RawApiTypes.ItemSelfTargetSchema<
      ToItemDefinitionWithNestedBlocks<NoInfer<D>>
    >
  >;
  /**
   * Retrieve a record
   *
   * Read more: https://www.datocms.com/docs/content-management-api/resources/item/self
   *
   * @throws {ApiError}
   * @throws {TimeoutError}
   */
  rawFind<D extends ItemTypeDefinition = ItemTypeDefinition>(
    itemId: string,
    queryParams?: RawApiTypes.ItemSelfHrefSchema,
  ) {
    return this.client
      .request({
        method: 'GET',
        url: `/items/${itemId}`,
        queryParams,
      })
      .then<
        RawApiTypes.ItemSelfTargetSchema<
          ToItemDefinitionWithNestedBlocks<NoInfer<D>>
        >
      >(Utils.deserializeRawResponseBodyWithItems);
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
  destroy<D extends ItemTypeDefinition = ItemTypeDefinition>(
    itemId: string | ApiTypes.ItemData,
  ) {
    return this.rawDestroy<D>(Utils.toId(itemId)).then((body) =>
      Utils.deserializeResponseBody<
        ApiTypes.ItemDestroyJobSchema<ToItemDefinition<NoInfer<D>>>
      >(body),
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
  rawDestroy<D extends ItemTypeDefinition = ItemTypeDefinition>(
    itemId: string,
  ): Promise<
    RawApiTypes.ItemDestroyJobSchema<
      ToItemDefinitionWithNestedBlocks<NoInfer<D>>
    >
  > {
    return this.client
      .request({
        method: 'DELETE',
        url: `/items/${itemId}`,
      })
      .then<
        RawApiTypes.ItemDestroyJobSchema<
          ToItemDefinitionWithNestedBlocks<NoInfer<D>>
        >
      >(Utils.deserializeRawResponseBodyWithItems);
  }

  /**
   * Publish a record
   *
   * Read more: https://www.datocms.com/docs/content-management-api/resources/item/publish
   *
   * @throws {ApiError}
   * @throws {TimeoutError}
   */
  publish<D extends ItemTypeDefinition = ItemTypeDefinition>(
    itemId: string | ApiTypes.ItemData,
    body?: ApiTypes.ItemPublishSchema,
    queryParams?: ApiTypes.ItemPublishHrefSchema,
  ) {
    return this.rawPublish<D>(
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
      Utils.deserializeResponseBody<
        ApiTypes.ItemPublishTargetSchema<ToItemDefinition<NoInfer<D>>>
      >(body),
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
  rawPublish<D extends ItemTypeDefinition = ItemTypeDefinition>(
    itemId: string,
    body?: RawApiTypes.ItemPublishSchema,
    queryParams?: RawApiTypes.ItemPublishHrefSchema,
  ): Promise<
    RawApiTypes.ItemPublishTargetSchema<
      ToItemDefinitionWithNestedBlocks<NoInfer<D>>
    >
  > {
    return this.client
      .request({
        method: 'PUT',
        url: `/items/${itemId}/publish`,
        body,
        queryParams,
      })
      .then<
        RawApiTypes.ItemPublishTargetSchema<
          ToItemDefinitionWithNestedBlocks<NoInfer<D>>
        >
      >(Utils.deserializeRawResponseBodyWithItems);
  }

  /**
   * Unpublish a record
   *
   * Read more: https://www.datocms.com/docs/content-management-api/resources/item/unpublish
   *
   * @throws {ApiError}
   * @throws {TimeoutError}
   */
  unpublish<D extends ItemTypeDefinition = ItemTypeDefinition>(
    itemId: string | ApiTypes.ItemData,
    body?: ApiTypes.ItemUnpublishSchema,
    queryParams?: ApiTypes.ItemUnpublishHrefSchema,
  ) {
    return this.rawUnpublish<D>(
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
      Utils.deserializeResponseBody<
        ApiTypes.ItemUnpublishTargetSchema<ToItemDefinition<NoInfer<D>>>
      >(body),
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
  rawUnpublish<D extends ItemTypeDefinition = ItemTypeDefinition>(
    itemId: string,
    body?: RawApiTypes.ItemUnpublishSchema,
    queryParams?: RawApiTypes.ItemUnpublishHrefSchema,
  ): Promise<
    RawApiTypes.ItemUnpublishTargetSchema<
      ToItemDefinitionWithNestedBlocks<NoInfer<D>>
    >
  > {
    return this.client
      .request({
        method: 'PUT',
        url: `/items/${itemId}/unpublish`,
        body,
        queryParams,
      })
      .then<
        RawApiTypes.ItemUnpublishTargetSchema<
          ToItemDefinitionWithNestedBlocks<NoInfer<D>>
        >
      >(Utils.deserializeRawResponseBodyWithItems);
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
