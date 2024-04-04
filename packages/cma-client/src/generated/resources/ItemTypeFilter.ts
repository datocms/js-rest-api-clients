import * as Utils from '@datocms/rest-client-utils';
import BaseResource from '../../BaseResource';
import type * as SchemaTypes from '../SchemaTypes';
import type * as SimpleSchemaTypes from '../SimpleSchemaTypes';

export default class ItemTypeFilter extends BaseResource {
  static readonly TYPE = 'item_type_filter' as const;

  /**
   * Create a new filter
   *
   * Read more: https://www.datocms.com/docs/content-management-api/resources/item-type_filter/create
   *
   * @throws {ApiError}
   * @throws {TimeoutError}
   */
  create(body: SimpleSchemaTypes.ItemTypeFilterCreateSchema) {
    return this.rawCreate(
      Utils.serializeRequestBody<SchemaTypes.ItemTypeFilterCreateSchema>(body, {
        type: 'item_type_filter',
        attributes: ['name', 'filter', 'columns', 'order_by', 'shared'],
        relationships: ['item_type'],
      }),
    ).then((body) =>
      Utils.deserializeResponseBody<SimpleSchemaTypes.ItemTypeFilterCreateTargetSchema>(
        body,
      ),
    );
  }

  /**
   * Create a new filter
   *
   * Read more: https://www.datocms.com/docs/content-management-api/resources/item-type_filter/create
   *
   * @throws {ApiError}
   * @throws {TimeoutError}
   */
  rawCreate(
    body: SchemaTypes.ItemTypeFilterCreateSchema,
  ): Promise<SchemaTypes.ItemTypeFilterCreateTargetSchema> {
    return this.client.request<SchemaTypes.ItemTypeFilterCreateTargetSchema>({
      method: 'POST',
      url: '/item-type-filters',
      body,
    });
  }

  /**
   * Update a filter
   *
   * Read more: https://www.datocms.com/docs/content-management-api/resources/item-type_filter/update
   *
   * @throws {ApiError}
   * @throws {TimeoutError}
   */
  update(
    itemTypeFilterId: string | SimpleSchemaTypes.ItemTypeFilterData,
    body: SimpleSchemaTypes.ItemTypeFilterUpdateSchema,
  ) {
    return this.rawUpdate(
      Utils.toId(itemTypeFilterId),
      Utils.serializeRequestBody<SchemaTypes.ItemTypeFilterUpdateSchema>(body, {
        id: Utils.toId(itemTypeFilterId),
        type: 'item_type_filter',
        attributes: ['name', 'columns', 'order_by', 'shared', 'filter'],
        relationships: ['item_type'],
      }),
    ).then((body) =>
      Utils.deserializeResponseBody<SimpleSchemaTypes.ItemTypeFilterUpdateTargetSchema>(
        body,
      ),
    );
  }

  /**
   * Update a filter
   *
   * Read more: https://www.datocms.com/docs/content-management-api/resources/item-type_filter/update
   *
   * @throws {ApiError}
   * @throws {TimeoutError}
   */
  rawUpdate(
    itemTypeFilterId: string,
    body: SchemaTypes.ItemTypeFilterUpdateSchema,
  ): Promise<SchemaTypes.ItemTypeFilterUpdateTargetSchema> {
    return this.client.request<SchemaTypes.ItemTypeFilterUpdateTargetSchema>({
      method: 'PUT',
      url: `/item-type-filters/${itemTypeFilterId}`,
      body,
    });
  }

  /**
   * List all filters
   *
   * Read more: https://www.datocms.com/docs/content-management-api/resources/item-type_filter/instances
   *
   * @throws {ApiError}
   * @throws {TimeoutError}
   */
  list() {
    return this.rawList().then((body) =>
      Utils.deserializeResponseBody<SimpleSchemaTypes.ItemTypeFilterInstancesTargetSchema>(
        body,
      ),
    );
  }

  /**
   * List all filters
   *
   * Read more: https://www.datocms.com/docs/content-management-api/resources/item-type_filter/instances
   *
   * @throws {ApiError}
   * @throws {TimeoutError}
   */
  rawList(): Promise<SchemaTypes.ItemTypeFilterInstancesTargetSchema> {
    return this.client.request<SchemaTypes.ItemTypeFilterInstancesTargetSchema>(
      {
        method: 'GET',
        url: '/item-type-filters',
      },
    );
  }

  /**
   * Retrieve a filter
   *
   * Read more: https://www.datocms.com/docs/content-management-api/resources/item-type_filter/self
   *
   * @throws {ApiError}
   * @throws {TimeoutError}
   */
  find(itemTypeFilterId: string | SimpleSchemaTypes.ItemTypeFilterData) {
    return this.rawFind(Utils.toId(itemTypeFilterId)).then((body) =>
      Utils.deserializeResponseBody<SimpleSchemaTypes.ItemTypeFilterSelfTargetSchema>(
        body,
      ),
    );
  }

  /**
   * Retrieve a filter
   *
   * Read more: https://www.datocms.com/docs/content-management-api/resources/item-type_filter/self
   *
   * @throws {ApiError}
   * @throws {TimeoutError}
   */
  rawFind(
    itemTypeFilterId: string,
  ): Promise<SchemaTypes.ItemTypeFilterSelfTargetSchema> {
    return this.client.request<SchemaTypes.ItemTypeFilterSelfTargetSchema>({
      method: 'GET',
      url: `/item-type-filters/${itemTypeFilterId}`,
    });
  }

  /**
   * Delete a filter
   *
   * Read more: https://www.datocms.com/docs/content-management-api/resources/item-type_filter/destroy
   *
   * @throws {ApiError}
   * @throws {TimeoutError}
   */
  destroy(itemTypeFilterId: string | SimpleSchemaTypes.ItemTypeFilterData) {
    return this.rawDestroy(Utils.toId(itemTypeFilterId)).then((body) =>
      Utils.deserializeResponseBody<SimpleSchemaTypes.ItemTypeFilterDestroyTargetSchema>(
        body,
      ),
    );
  }

  /**
   * Delete a filter
   *
   * Read more: https://www.datocms.com/docs/content-management-api/resources/item-type_filter/destroy
   *
   * @throws {ApiError}
   * @throws {TimeoutError}
   */
  rawDestroy(
    itemTypeFilterId: string,
  ): Promise<SchemaTypes.ItemTypeFilterDestroyTargetSchema> {
    return this.client.request<SchemaTypes.ItemTypeFilterDestroyTargetSchema>({
      method: 'DELETE',
      url: `/item-type-filters/${itemTypeFilterId}`,
    });
  }
}
