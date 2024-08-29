import * as Utils from '@datocms/rest-client-utils';
import BaseResource from '../../BaseResource';
import type * as SchemaTypes from '../SchemaTypes';
import type * as SimpleSchemaTypes from '../SimpleSchemaTypes';

export default class SchemaMenuItem extends BaseResource {
  static readonly TYPE = 'schema_menu_item' as const;

  /**
   * Create a new schema menu item
   *
   * Read more: https://www.datocms.com/docs/content-management-api/resources/schema-menu_item/create
   *
   * @throws {ApiError}
   * @throws {TimeoutError}
   */
  create(body: SimpleSchemaTypes.SchemaMenuItemCreateSchema) {
    return this.rawCreate(
      Utils.serializeRequestBody<SchemaTypes.SchemaMenuItemCreateSchema>(body, {
        type: 'schema_menu_item',
        attributes: ['label', 'position', 'kind'],
        relationships: ['item_type', 'parent'],
      }),
    ).then((body) =>
      Utils.deserializeResponseBody<SimpleSchemaTypes.SchemaMenuItemCreateTargetSchema>(
        body,
      ),
    );
  }

  /**
   * Create a new schema menu item
   *
   * Read more: https://www.datocms.com/docs/content-management-api/resources/schema-menu_item/create
   *
   * @throws {ApiError}
   * @throws {TimeoutError}
   */
  rawCreate(
    body: SchemaTypes.SchemaMenuItemCreateSchema,
  ): Promise<SchemaTypes.SchemaMenuItemCreateTargetSchema> {
    return this.client.request<SchemaTypes.SchemaMenuItemCreateTargetSchema>({
      method: 'POST',
      url: '/schema-menu-items',
      body,
    });
  }

  /**
   * Update a schema menu item
   *
   * Read more: https://www.datocms.com/docs/content-management-api/resources/schema-menu_item/update
   *
   * @throws {ApiError}
   * @throws {TimeoutError}
   */
  update(
    schemaMenuItemId: string | SimpleSchemaTypes.SchemaMenuItemData,
    body: SimpleSchemaTypes.SchemaMenuItemUpdateSchema,
  ) {
    return this.rawUpdate(
      Utils.toId(schemaMenuItemId),
      Utils.serializeRequestBody<SchemaTypes.SchemaMenuItemUpdateSchema>(body, {
        id: Utils.toId(schemaMenuItemId),
        type: 'schema_menu_item',
        attributes: ['label', 'position', 'kind'],
        relationships: ['item_type', 'parent', 'children'],
      }),
    ).then((body) =>
      Utils.deserializeResponseBody<SimpleSchemaTypes.SchemaMenuItemUpdateTargetSchema>(
        body,
      ),
    );
  }

  /**
   * Update a schema menu item
   *
   * Read more: https://www.datocms.com/docs/content-management-api/resources/schema-menu_item/update
   *
   * @throws {ApiError}
   * @throws {TimeoutError}
   */
  rawUpdate(
    schemaMenuItemId: string,
    body: SchemaTypes.SchemaMenuItemUpdateSchema,
  ): Promise<SchemaTypes.SchemaMenuItemUpdateTargetSchema> {
    return this.client.request<SchemaTypes.SchemaMenuItemUpdateTargetSchema>({
      method: 'PUT',
      url: `/schema-menu-items/${schemaMenuItemId}`,
      body,
    });
  }

  /**
   * List all schema menu items
   *
   * Read more: https://www.datocms.com/docs/content-management-api/resources/schema-menu_item/instances
   *
   * @throws {ApiError}
   * @throws {TimeoutError}
   */
  list(queryParams?: SimpleSchemaTypes.SchemaMenuItemInstancesHrefSchema) {
    return this.rawList(queryParams).then((body) =>
      Utils.deserializeResponseBody<SimpleSchemaTypes.SchemaMenuItemInstancesTargetSchema>(
        body,
      ),
    );
  }

  /**
   * List all schema menu items
   *
   * Read more: https://www.datocms.com/docs/content-management-api/resources/schema-menu_item/instances
   *
   * @throws {ApiError}
   * @throws {TimeoutError}
   */
  rawList(
    queryParams?: SchemaTypes.SchemaMenuItemInstancesHrefSchema,
  ): Promise<SchemaTypes.SchemaMenuItemInstancesTargetSchema> {
    return this.client.request<SchemaTypes.SchemaMenuItemInstancesTargetSchema>(
      {
        method: 'GET',
        url: '/schema-menu-items',
        queryParams,
      },
    );
  }

  /**
   * Retrieve a schema menu item
   *
   * Read more: https://www.datocms.com/docs/content-management-api/resources/schema-menu_item/self
   *
   * @throws {ApiError}
   * @throws {TimeoutError}
   */
  find(schemaMenuItemId: string | SimpleSchemaTypes.SchemaMenuItemData) {
    return this.rawFind(Utils.toId(schemaMenuItemId)).then((body) =>
      Utils.deserializeResponseBody<SimpleSchemaTypes.SchemaMenuItemSelfTargetSchema>(
        body,
      ),
    );
  }

  /**
   * Retrieve a schema menu item
   *
   * Read more: https://www.datocms.com/docs/content-management-api/resources/schema-menu_item/self
   *
   * @throws {ApiError}
   * @throws {TimeoutError}
   */
  rawFind(
    schemaMenuItemId: string,
  ): Promise<SchemaTypes.SchemaMenuItemSelfTargetSchema> {
    return this.client.request<SchemaTypes.SchemaMenuItemSelfTargetSchema>({
      method: 'GET',
      url: `/schema-menu-items/${schemaMenuItemId}`,
    });
  }

  /**
   * Delete a schema menu item
   *
   * Read more: https://www.datocms.com/docs/content-management-api/resources/schema-menu_item/destroy
   *
   * @throws {ApiError}
   * @throws {TimeoutError}
   */
  destroy(schemaMenuItemId: string | SimpleSchemaTypes.SchemaMenuItemData) {
    return this.rawDestroy(Utils.toId(schemaMenuItemId)).then((body) =>
      Utils.deserializeResponseBody<SimpleSchemaTypes.SchemaMenuItemDestroyTargetSchema>(
        body,
      ),
    );
  }

  /**
   * Delete a schema menu item
   *
   * Read more: https://www.datocms.com/docs/content-management-api/resources/schema-menu_item/destroy
   *
   * @throws {ApiError}
   * @throws {TimeoutError}
   */
  rawDestroy(
    schemaMenuItemId: string,
  ): Promise<SchemaTypes.SchemaMenuItemDestroyTargetSchema> {
    return this.client.request<SchemaTypes.SchemaMenuItemDestroyTargetSchema>({
      method: 'DELETE',
      url: `/schema-menu-items/${schemaMenuItemId}`,
    });
  }

  /**
   * Reorders a set of schema menu items
   *
   * Read more: https://www.datocms.com/docs/content-management-api/resources/schema-menu_item/reorder
   *
   * @throws {ApiError}
   * @throws {TimeoutError}
   *
   * @deprecated This API call is to be considered private and might change without notice
   */
  reorder(body: SimpleSchemaTypes.SchemaMenuItemReorderSchema) {
    return this.rawReorder(
      Utils.serializeRequestBody<SchemaTypes.SchemaMenuItemReorderSchema>(
        body,
        {
          type: 'schema_menu_item',
          attributes: ['position'],
          relationships: ['parent'],
        },
      ),
    ).then((body) =>
      Utils.deserializeResponseBody<SimpleSchemaTypes.SchemaMenuItemReorderJobSchema>(
        body,
      ),
    );
  }

  /**
   * Reorders a set of schema menu items
   *
   * Read more: https://www.datocms.com/docs/content-management-api/resources/schema-menu_item/reorder
   *
   * @throws {ApiError}
   * @throws {TimeoutError}
   *
   * @deprecated This API call is to be considered private and might change without notice
   */
  rawReorder(
    body: SchemaTypes.SchemaMenuItemReorderSchema,
  ): Promise<SchemaTypes.SchemaMenuItemReorderJobSchema> {
    return this.client.request<SchemaTypes.SchemaMenuItemReorderJobSchema>({
      method: 'POST',
      url: '/schema-menu-items/reorder',
      body,
    });
  }
}
