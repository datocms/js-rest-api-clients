import * as Utils from '@datocms/rest-client-utils';
import BaseResource from '../../BaseResource';
import type * as SchemaTypes from '../SchemaTypes';
import type * as SimpleSchemaTypes from '../SimpleSchemaTypes';

export default class MenuItem extends BaseResource {
  static readonly TYPE = 'menu_item' as const;

  /**
   * Create a new menu item
   *
   * Read more: https://www.datocms.com/docs/content-management-api/resources/menu-item/create
   *
   * @throws {ApiError}
   * @throws {TimeoutError}
   */
  create(body: SimpleSchemaTypes.MenuItemCreateSchema) {
    return this.rawCreate(
      Utils.serializeRequestBody<SchemaTypes.MenuItemCreateSchema>(body, {
        type: 'menu_item',
        attributes: ['label', 'external_url', 'position', 'open_in_new_tab'],
        relationships: ['item_type', 'item_type_filter', 'parent'],
      }),
    ).then((body) =>
      Utils.deserializeResponseBody<SimpleSchemaTypes.MenuItemCreateTargetSchema>(
        body,
      ),
    );
  }

  /**
   * Create a new menu item
   *
   * Read more: https://www.datocms.com/docs/content-management-api/resources/menu-item/create
   *
   * @throws {ApiError}
   * @throws {TimeoutError}
   */
  rawCreate(
    body: SchemaTypes.MenuItemCreateSchema,
  ): Promise<SchemaTypes.MenuItemCreateTargetSchema> {
    return this.client.request<SchemaTypes.MenuItemCreateTargetSchema>({
      method: 'POST',
      url: '/menu-items',
      body,
    });
  }

  /**
   * Update a menu item
   *
   * Read more: https://www.datocms.com/docs/content-management-api/resources/menu-item/update
   *
   * @throws {ApiError}
   * @throws {TimeoutError}
   */
  update(
    menuItemId: string | SimpleSchemaTypes.MenuItemData,
    body: SimpleSchemaTypes.MenuItemUpdateSchema,
  ) {
    return this.rawUpdate(
      Utils.toId(menuItemId),
      Utils.serializeRequestBody<SchemaTypes.MenuItemUpdateSchema>(body, {
        id: Utils.toId(menuItemId),
        type: 'menu_item',
        attributes: ['label', 'external_url', 'position', 'open_in_new_tab'],
        relationships: ['item_type', 'item_type_filter', 'parent'],
      }),
    ).then((body) =>
      Utils.deserializeResponseBody<SimpleSchemaTypes.MenuItemUpdateTargetSchema>(
        body,
      ),
    );
  }

  /**
   * Update a menu item
   *
   * Read more: https://www.datocms.com/docs/content-management-api/resources/menu-item/update
   *
   * @throws {ApiError}
   * @throws {TimeoutError}
   */
  rawUpdate(
    menuItemId: string,
    body: SchemaTypes.MenuItemUpdateSchema,
  ): Promise<SchemaTypes.MenuItemUpdateTargetSchema> {
    return this.client.request<SchemaTypes.MenuItemUpdateTargetSchema>({
      method: 'PUT',
      url: `/menu-items/${menuItemId}`,
      body,
    });
  }

  /**
   * List all menu items
   *
   * Read more: https://www.datocms.com/docs/content-management-api/resources/menu-item/instances
   *
   * @throws {ApiError}
   * @throws {TimeoutError}
   */
  list(queryParams?: SimpleSchemaTypes.MenuItemInstancesHrefSchema) {
    return this.rawList(queryParams).then((body) =>
      Utils.deserializeResponseBody<SimpleSchemaTypes.MenuItemInstancesTargetSchema>(
        body,
      ),
    );
  }

  /**
   * List all menu items
   *
   * Read more: https://www.datocms.com/docs/content-management-api/resources/menu-item/instances
   *
   * @throws {ApiError}
   * @throws {TimeoutError}
   */
  rawList(
    queryParams?: SchemaTypes.MenuItemInstancesHrefSchema,
  ): Promise<SchemaTypes.MenuItemInstancesTargetSchema> {
    return this.client.request<SchemaTypes.MenuItemInstancesTargetSchema>({
      method: 'GET',
      url: '/menu-items',
      queryParams,
    });
  }

  /**
   * Retrieve a menu item
   *
   * Read more: https://www.datocms.com/docs/content-management-api/resources/menu-item/self
   *
   * @throws {ApiError}
   * @throws {TimeoutError}
   */
  find(menuItemId: string | SimpleSchemaTypes.MenuItemData) {
    return this.rawFind(Utils.toId(menuItemId)).then((body) =>
      Utils.deserializeResponseBody<SimpleSchemaTypes.MenuItemSelfTargetSchema>(
        body,
      ),
    );
  }

  /**
   * Retrieve a menu item
   *
   * Read more: https://www.datocms.com/docs/content-management-api/resources/menu-item/self
   *
   * @throws {ApiError}
   * @throws {TimeoutError}
   */
  rawFind(menuItemId: string): Promise<SchemaTypes.MenuItemSelfTargetSchema> {
    return this.client.request<SchemaTypes.MenuItemSelfTargetSchema>({
      method: 'GET',
      url: `/menu-items/${menuItemId}`,
    });
  }

  /**
   * Delete a menu item
   *
   * Read more: https://www.datocms.com/docs/content-management-api/resources/menu-item/destroy
   *
   * @throws {ApiError}
   * @throws {TimeoutError}
   */
  destroy(menuItemId: string | SimpleSchemaTypes.MenuItemData) {
    return this.rawDestroy(Utils.toId(menuItemId)).then((body) =>
      Utils.deserializeResponseBody<SimpleSchemaTypes.MenuItemDestroyTargetSchema>(
        body,
      ),
    );
  }

  /**
   * Delete a menu item
   *
   * Read more: https://www.datocms.com/docs/content-management-api/resources/menu-item/destroy
   *
   * @throws {ApiError}
   * @throws {TimeoutError}
   */
  rawDestroy(
    menuItemId: string,
  ): Promise<SchemaTypes.MenuItemDestroyTargetSchema> {
    return this.client.request<SchemaTypes.MenuItemDestroyTargetSchema>({
      method: 'DELETE',
      url: `/menu-items/${menuItemId}`,
    });
  }

  /**
   * Reorders a set of menu items
   *
   * Read more: https://www.datocms.com/docs/content-management-api/resources/menu-item/reorder
   *
   * @throws {ApiError}
   * @throws {TimeoutError}
   *
   * @deprecated This API call is to be considered private and might change without notice
   */
  reorder(body: SimpleSchemaTypes.MenuItemReorderSchema) {
    return this.rawReorder(
      Utils.serializeRequestBody<SchemaTypes.MenuItemReorderSchema>(body, {
        type: 'menu_item',
        attributes: ['position'],
        relationships: ['parent'],
      }),
    ).then((body) =>
      Utils.deserializeResponseBody<SimpleSchemaTypes.MenuItemReorderJobSchema>(
        body,
      ),
    );
  }

  /**
   * Reorders a set of menu items
   *
   * Read more: https://www.datocms.com/docs/content-management-api/resources/menu-item/reorder
   *
   * @throws {ApiError}
   * @throws {TimeoutError}
   *
   * @deprecated This API call is to be considered private and might change without notice
   */
  rawReorder(
    body: SchemaTypes.MenuItemReorderSchema,
  ): Promise<SchemaTypes.MenuItemReorderJobSchema> {
    return this.client.request<SchemaTypes.MenuItemReorderJobSchema>({
      method: 'POST',
      url: '/menu-items/reorder',
      body,
    });
  }
}
