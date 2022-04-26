import * as Utils from '@datocms/rest-client-utils';
import * as SchemaTypes from '../SchemaTypes';
import * as SimpleSchemaTypes from '../SimpleSchemaTypes';
import BaseResource from '../../BaseResource';

export default class MenuItem extends BaseResource {
  static readonly TYPE: 'menu_item' = 'menu_item';

  /**
   * Create a new menu item
   *
   * Read more: https://www.datocms.com/docs/content-management-api/resources/menu-item/create
   */
  create(body: SimpleSchemaTypes.MenuItemCreateSchema) {
    return this.rawCreate(
      Utils.serializeRequestBody<SchemaTypes.MenuItemCreateSchema>(body, {
        type: 'menu_item',
        attributes: ['label', 'external_url', 'position', 'open_in_new_tab'],
        relationships: ['item_type', 'parent'],
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
   */
  rawCreate(
    body: SchemaTypes.MenuItemCreateSchema,
  ): Promise<SchemaTypes.MenuItemCreateTargetSchema> {
    return this.client.request<SchemaTypes.MenuItemCreateTargetSchema>({
      method: 'POST',
      url: `/menu-items`,
      body,
    });
  }

  /**
   * Update a menu item
   *
   * Read more: https://www.datocms.com/docs/content-management-api/resources/menu-item/update
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
        relationships: ['item_type', 'parent'],
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
   */
  rawList(
    queryParams?: SchemaTypes.MenuItemInstancesHrefSchema,
  ): Promise<SchemaTypes.MenuItemInstancesTargetSchema> {
    return this.client.request<SchemaTypes.MenuItemInstancesTargetSchema>({
      method: 'GET',
      url: `/menu-items`,
      queryParams,
    });
  }

  /**
   * Retrieve a menu item
   *
   * Read more: https://www.datocms.com/docs/content-management-api/resources/menu-item/self
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
   */
  rawDestroy(
    menuItemId: string,
  ): Promise<SchemaTypes.MenuItemDestroyTargetSchema> {
    return this.client.request<SchemaTypes.MenuItemDestroyTargetSchema>({
      method: 'DELETE',
      url: `/menu-items/${menuItemId}`,
    });
  }
}
