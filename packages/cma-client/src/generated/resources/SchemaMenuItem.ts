import * as Utils from '@datocms/rest-client-utils';
import BaseResource from '../../BaseResource';
import type * as ApiTypes from '../ApiTypes';
import type * as RawApiTypes from '../RawApiTypes';

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
  create(body: ApiTypes.SchemaMenuItemCreateSchema) {
    return this.rawCreate(
      Utils.serializeRequestBody<RawApiTypes.SchemaMenuItemCreateSchema>(body, {
        type: 'schema_menu_item',
        attributes: ['label', 'position', 'kind'],
        relationships: ['item_type', 'parent'],
      }),
    ).then((body) =>
      Utils.deserializeResponseBody<ApiTypes.SchemaMenuItemCreateTargetSchema>(
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
    body: RawApiTypes.SchemaMenuItemCreateSchema,
  ): Promise<RawApiTypes.SchemaMenuItemCreateTargetSchema> {
    return this.client.request<RawApiTypes.SchemaMenuItemCreateTargetSchema>({
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
    schemaMenuItemId: string | ApiTypes.SchemaMenuItemData,
    body: ApiTypes.SchemaMenuItemUpdateSchema,
  ) {
    return this.rawUpdate(
      Utils.toId(schemaMenuItemId),
      Utils.serializeRequestBody<RawApiTypes.SchemaMenuItemUpdateSchema>(body, {
        id: Utils.toId(schemaMenuItemId),
        type: 'schema_menu_item',
        attributes: ['label', 'position', 'kind'],
        relationships: ['item_type', 'parent', 'children'],
      }),
    ).then((body) =>
      Utils.deserializeResponseBody<ApiTypes.SchemaMenuItemUpdateTargetSchema>(
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
    body: RawApiTypes.SchemaMenuItemUpdateSchema,
  ): Promise<RawApiTypes.SchemaMenuItemUpdateTargetSchema> {
    return this.client.request<RawApiTypes.SchemaMenuItemUpdateTargetSchema>({
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
  list(queryParams?: ApiTypes.SchemaMenuItemInstancesHrefSchema) {
    return this.rawList(queryParams).then((body) =>
      Utils.deserializeResponseBody<ApiTypes.SchemaMenuItemInstancesTargetSchema>(
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
    queryParams?: RawApiTypes.SchemaMenuItemInstancesHrefSchema,
  ): Promise<RawApiTypes.SchemaMenuItemInstancesTargetSchema> {
    return this.client.request<RawApiTypes.SchemaMenuItemInstancesTargetSchema>(
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
  find(schemaMenuItemId: string | ApiTypes.SchemaMenuItemData) {
    return this.rawFind(Utils.toId(schemaMenuItemId)).then((body) =>
      Utils.deserializeResponseBody<ApiTypes.SchemaMenuItemSelfTargetSchema>(
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
  ): Promise<RawApiTypes.SchemaMenuItemSelfTargetSchema> {
    return this.client.request<RawApiTypes.SchemaMenuItemSelfTargetSchema>({
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
  destroy(schemaMenuItemId: string | ApiTypes.SchemaMenuItemData) {
    return this.rawDestroy(Utils.toId(schemaMenuItemId)).then((body) =>
      Utils.deserializeResponseBody<ApiTypes.SchemaMenuItemDestroyTargetSchema>(
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
  ): Promise<RawApiTypes.SchemaMenuItemDestroyTargetSchema> {
    return this.client.request<RawApiTypes.SchemaMenuItemDestroyTargetSchema>({
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
  reorder(body: ApiTypes.SchemaMenuItemReorderSchema) {
    return this.rawReorder(
      Utils.serializeRequestBody<RawApiTypes.SchemaMenuItemReorderSchema>(
        body,
        {
          type: 'schema_menu_item',
          attributes: ['position'],
          relationships: ['parent'],
        },
      ),
    ).then((body) =>
      Utils.deserializeResponseBody<ApiTypes.SchemaMenuItemReorderJobSchema>(
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
    body: RawApiTypes.SchemaMenuItemReorderSchema,
  ): Promise<RawApiTypes.SchemaMenuItemReorderJobSchema> {
    return this.client.request<RawApiTypes.SchemaMenuItemReorderJobSchema>({
      method: 'POST',
      url: '/schema-menu-items/reorder',
      body,
    });
  }
}
