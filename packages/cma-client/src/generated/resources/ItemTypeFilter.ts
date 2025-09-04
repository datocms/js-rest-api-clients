import * as Utils from '@datocms/rest-client-utils';
import BaseResource from '../../BaseResource';
import type * as ApiTypes from '../ApiTypes';
import type * as RawApiTypes from '../RawApiTypes';

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
  create(body: ApiTypes.ItemTypeFilterCreateSchema) {
    return this.rawCreate(
      Utils.serializeRequestBody<RawApiTypes.ItemTypeFilterCreateSchema>(body, {
        type: 'item_type_filter',
        attributes: ['name', 'filter', 'columns', 'order_by', 'shared'],
        relationships: ['item_type'],
      }),
    ).then((body) =>
      Utils.deserializeResponseBody<ApiTypes.ItemTypeFilterCreateTargetSchema>(
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
    body: RawApiTypes.ItemTypeFilterCreateSchema,
  ): Promise<RawApiTypes.ItemTypeFilterCreateTargetSchema> {
    return this.client.request<RawApiTypes.ItemTypeFilterCreateTargetSchema>({
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
    itemTypeFilterId: string | ApiTypes.ItemTypeFilterData,
    body: ApiTypes.ItemTypeFilterUpdateSchema,
  ) {
    return this.rawUpdate(
      Utils.toId(itemTypeFilterId),
      Utils.serializeRequestBody<RawApiTypes.ItemTypeFilterUpdateSchema>(body, {
        id: Utils.toId(itemTypeFilterId),
        type: 'item_type_filter',
        attributes: ['name', 'columns', 'order_by', 'shared', 'filter'],
        relationships: ['item_type'],
      }),
    ).then((body) =>
      Utils.deserializeResponseBody<ApiTypes.ItemTypeFilterUpdateTargetSchema>(
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
    body: RawApiTypes.ItemTypeFilterUpdateSchema,
  ): Promise<RawApiTypes.ItemTypeFilterUpdateTargetSchema> {
    return this.client.request<RawApiTypes.ItemTypeFilterUpdateTargetSchema>({
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
      Utils.deserializeResponseBody<ApiTypes.ItemTypeFilterInstancesTargetSchema>(
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
  rawList(): Promise<RawApiTypes.ItemTypeFilterInstancesTargetSchema> {
    return this.client.request<RawApiTypes.ItemTypeFilterInstancesTargetSchema>(
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
  find(itemTypeFilterId: string | ApiTypes.ItemTypeFilterData) {
    return this.rawFind(Utils.toId(itemTypeFilterId)).then((body) =>
      Utils.deserializeResponseBody<ApiTypes.ItemTypeFilterSelfTargetSchema>(
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
  ): Promise<RawApiTypes.ItemTypeFilterSelfTargetSchema> {
    return this.client.request<RawApiTypes.ItemTypeFilterSelfTargetSchema>({
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
  destroy(itemTypeFilterId: string | ApiTypes.ItemTypeFilterData) {
    return this.rawDestroy(Utils.toId(itemTypeFilterId)).then((body) =>
      Utils.deserializeResponseBody<ApiTypes.ItemTypeFilterDestroyTargetSchema>(
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
  ): Promise<RawApiTypes.ItemTypeFilterDestroyTargetSchema> {
    return this.client.request<RawApiTypes.ItemTypeFilterDestroyTargetSchema>({
      method: 'DELETE',
      url: `/item-type-filters/${itemTypeFilterId}`,
    });
  }
}
