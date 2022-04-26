import * as Utils from '@datocms/rest-client-utils';
import * as SchemaTypes from '../SchemaTypes';
import * as SimpleSchemaTypes from '../SimpleSchemaTypes';
import BaseResource from '../../BaseResource';

export default class ItemTypeFilter extends BaseResource {
  static readonly TYPE: 'item_type_filter' = 'item_type_filter';

  /**
   * Create a new filter
   *
   * Read more: https://www.datocms.com/docs/content-management-api/resources/item-type_filter/create
   */
  create(body: SimpleSchemaTypes.ItemTypeFilterCreateSchema) {
    return this.rawCreate(
      Utils.serializeRequestBody<SchemaTypes.ItemTypeFilterCreateSchema>(body, {
        type: 'item_type_filter',
        attributes: ['name', 'filter', 'shared'],
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
   */
  rawCreate(
    body: SchemaTypes.ItemTypeFilterCreateSchema,
  ): Promise<SchemaTypes.ItemTypeFilterCreateTargetSchema> {
    return this.client.request<SchemaTypes.ItemTypeFilterCreateTargetSchema>({
      method: 'POST',
      url: `/item-type-filters`,
      body,
    });
  }

  /**
   * Update a filter
   *
   * Read more: https://www.datocms.com/docs/content-management-api/resources/item-type_filter/update
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
        attributes: ['name', 'shared', 'filter'],
        relationships: [],
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
   */
  rawList(): Promise<SchemaTypes.ItemTypeFilterInstancesTargetSchema> {
    return this.client.request<SchemaTypes.ItemTypeFilterInstancesTargetSchema>(
      {
        method: 'GET',
        url: `/item-type-filters`,
      },
    );
  }

  /**
   * Retrieve a filter
   *
   * Read more: https://www.datocms.com/docs/content-management-api/resources/item-type_filter/self
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
