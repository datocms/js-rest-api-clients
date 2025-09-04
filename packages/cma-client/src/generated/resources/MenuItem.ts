import * as Utils from '@datocms/rest-client-utils';
import BaseResource from '../../BaseResource';
import type * as ApiTypes from '../ApiTypes';
import type * as RawApiTypes from '../RawApiTypes';

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
  create(body: ApiTypes.MenuItemCreateSchema) {
    return this.rawCreate(
      Utils.serializeRequestBody<RawApiTypes.MenuItemCreateSchema>(body, {
        type: 'menu_item',
        attributes: ['label', 'external_url', 'position', 'open_in_new_tab'],
        relationships: ['item_type', 'item_type_filter', 'parent'],
      }),
    ).then((body) =>
      Utils.deserializeResponseBody<ApiTypes.MenuItemCreateTargetSchema>(body),
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
    body: RawApiTypes.MenuItemCreateSchema,
  ): Promise<RawApiTypes.MenuItemCreateTargetSchema> {
    return this.client.request<RawApiTypes.MenuItemCreateTargetSchema>({
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
    menuItemId: string | ApiTypes.MenuItemData,
    body: ApiTypes.MenuItemUpdateSchema,
  ) {
    return this.rawUpdate(
      Utils.toId(menuItemId),
      Utils.serializeRequestBody<RawApiTypes.MenuItemUpdateSchema>(body, {
        id: Utils.toId(menuItemId),
        type: 'menu_item',
        attributes: ['label', 'external_url', 'position', 'open_in_new_tab'],
        relationships: ['item_type', 'item_type_filter', 'parent'],
      }),
    ).then((body) =>
      Utils.deserializeResponseBody<ApiTypes.MenuItemUpdateTargetSchema>(body),
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
    body: RawApiTypes.MenuItemUpdateSchema,
  ): Promise<RawApiTypes.MenuItemUpdateTargetSchema> {
    return this.client.request<RawApiTypes.MenuItemUpdateTargetSchema>({
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
  list(queryParams?: ApiTypes.MenuItemInstancesHrefSchema) {
    return this.rawList(queryParams).then((body) =>
      Utils.deserializeResponseBody<ApiTypes.MenuItemInstancesTargetSchema>(
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
    queryParams?: RawApiTypes.MenuItemInstancesHrefSchema,
  ): Promise<RawApiTypes.MenuItemInstancesTargetSchema> {
    return this.client.request<RawApiTypes.MenuItemInstancesTargetSchema>({
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
  find(menuItemId: string | ApiTypes.MenuItemData) {
    return this.rawFind(Utils.toId(menuItemId)).then((body) =>
      Utils.deserializeResponseBody<ApiTypes.MenuItemSelfTargetSchema>(body),
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
  rawFind(menuItemId: string): Promise<RawApiTypes.MenuItemSelfTargetSchema> {
    return this.client.request<RawApiTypes.MenuItemSelfTargetSchema>({
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
  destroy(menuItemId: string | ApiTypes.MenuItemData) {
    return this.rawDestroy(Utils.toId(menuItemId)).then((body) =>
      Utils.deserializeResponseBody<ApiTypes.MenuItemDestroyTargetSchema>(body),
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
  ): Promise<RawApiTypes.MenuItemDestroyTargetSchema> {
    return this.client.request<RawApiTypes.MenuItemDestroyTargetSchema>({
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
  reorder(body: ApiTypes.MenuItemReorderSchema) {
    return this.rawReorder(
      Utils.serializeRequestBody<RawApiTypes.MenuItemReorderSchema>(body, {
        type: 'menu_item',
        attributes: ['position'],
        relationships: ['parent'],
      }),
    ).then((body) =>
      Utils.deserializeResponseBody<ApiTypes.MenuItemReorderJobSchema>(body),
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
    body: RawApiTypes.MenuItemReorderSchema,
  ): Promise<RawApiTypes.MenuItemReorderJobSchema> {
    return this.client.request<RawApiTypes.MenuItemReorderJobSchema>({
      method: 'POST',
      url: '/menu-items/reorder',
      body,
    });
  }
}
