import * as Utils from '@datocms/rest-client-utils';
import BaseResource from '../../BaseResource';
import type * as SchemaTypes from '../SchemaTypes';
import type * as SimpleSchemaTypes from '../SimpleSchemaTypes';

export default class ItemType extends BaseResource {
  static readonly TYPE = 'item_type' as const;

  /**
   * Create a new model
   *
   * Read more: https://www.datocms.com/docs/content-management-api/resources/item-type/create
   *
   * @throws {ApiError}
   * @throws {TimeoutError}
   */
  create(
    body: SimpleSchemaTypes.ItemTypeCreateSchema,
    queryParams?: SimpleSchemaTypes.ItemTypeCreateHrefSchema,
  ) {
    return this.rawCreate(
      Utils.serializeRequestBody<SchemaTypes.ItemTypeCreateSchema>(body, {
        type: 'item_type',
        attributes: [
          'name',
          'api_key',
          'singleton',
          'all_locales_required',
          'sortable',
          'modular_block',
          'draft_mode_active',
          'draft_saving_active',
          'tree',
          'ordering_direction',
          'ordering_meta',
          'collection_appeareance',
          'collection_appearance',
          'hint',
          'inverse_relationships_enabled',
        ],
        relationships: [
          'ordering_field',
          'presentation_title_field',
          'presentation_image_field',
          'title_field',
          'image_preview_field',
          'excerpt_field',
          'workflow',
        ],
      }),
      queryParams,
    ).then((body) =>
      Utils.deserializeResponseBody<SimpleSchemaTypes.ItemTypeCreateTargetSchema>(
        body,
      ),
    );
  }

  /**
   * Create a new model
   *
   * Read more: https://www.datocms.com/docs/content-management-api/resources/item-type/create
   *
   * @throws {ApiError}
   * @throws {TimeoutError}
   */
  rawCreate(
    body: SchemaTypes.ItemTypeCreateSchema,
    queryParams?: SchemaTypes.ItemTypeCreateHrefSchema,
  ): Promise<SchemaTypes.ItemTypeCreateTargetSchema> {
    return this.client.request<SchemaTypes.ItemTypeCreateTargetSchema>({
      method: 'POST',
      url: '/item-types',
      body,
      queryParams,
    });
  }

  /**
   * Update a model
   *
   * Read more: https://www.datocms.com/docs/content-management-api/resources/item-type/update
   *
   * @throws {ApiError}
   * @throws {TimeoutError}
   */
  update(
    itemTypeId: string | SimpleSchemaTypes.ItemTypeData,
    body: SimpleSchemaTypes.ItemTypeUpdateSchema,
  ) {
    return this.rawUpdate(
      Utils.toId(itemTypeId),
      Utils.serializeRequestBody<SchemaTypes.ItemTypeUpdateSchema>(body, {
        id: Utils.toId(itemTypeId),
        type: 'item_type',
        attributes: [
          'name',
          'api_key',
          'collection_appeareance',
          'collection_appearance',
          'singleton',
          'all_locales_required',
          'sortable',
          'modular_block',
          'draft_mode_active',
          'draft_saving_active',
          'tree',
          'ordering_direction',
          'ordering_meta',
          'has_singleton_item',
          'hint',
          'inverse_relationships_enabled',
        ],
        relationships: [
          'ordering_field',
          'presentation_title_field',
          'presentation_image_field',
          'title_field',
          'image_preview_field',
          'excerpt_field',
          'workflow',
        ],
      }),
    ).then((body) =>
      Utils.deserializeResponseBody<SimpleSchemaTypes.ItemTypeUpdateJobSchema>(
        body,
      ),
    );
  }

  /**
   * Update a model
   *
   * Read more: https://www.datocms.com/docs/content-management-api/resources/item-type/update
   *
   * @throws {ApiError}
   * @throws {TimeoutError}
   */
  rawUpdate(
    itemTypeId: string,
    body: SchemaTypes.ItemTypeUpdateSchema,
  ): Promise<SchemaTypes.ItemTypeUpdateJobSchema> {
    return this.client.request<SchemaTypes.ItemTypeUpdateJobSchema>({
      method: 'PUT',
      url: `/item-types/${itemTypeId}`,
      body,
    });
  }

  /**
   * List all models
   *
   * Read more: https://www.datocms.com/docs/content-management-api/resources/item-type/instances
   *
   * @throws {ApiError}
   * @throws {TimeoutError}
   */
  list() {
    return this.rawList().then((body) =>
      Utils.deserializeResponseBody<SimpleSchemaTypes.ItemTypeInstancesTargetSchema>(
        body,
      ),
    );
  }

  /**
   * List all models
   *
   * Read more: https://www.datocms.com/docs/content-management-api/resources/item-type/instances
   *
   * @throws {ApiError}
   * @throws {TimeoutError}
   */
  rawList(): Promise<SchemaTypes.ItemTypeInstancesTargetSchema> {
    return this.client.request<SchemaTypes.ItemTypeInstancesTargetSchema>({
      method: 'GET',
      url: '/item-types',
    });
  }

  /**
   * Retrieve a model
   *
   * Read more: https://www.datocms.com/docs/content-management-api/resources/item-type/self
   *
   * @throws {ApiError}
   * @throws {TimeoutError}
   */
  find(itemTypeId: string | SimpleSchemaTypes.ItemTypeData) {
    return this.rawFind(Utils.toId(itemTypeId)).then((body) =>
      Utils.deserializeResponseBody<SimpleSchemaTypes.ItemTypeSelfTargetSchema>(
        body,
      ),
    );
  }

  /**
   * Retrieve a model
   *
   * Read more: https://www.datocms.com/docs/content-management-api/resources/item-type/self
   *
   * @throws {ApiError}
   * @throws {TimeoutError}
   */
  rawFind(itemTypeId: string): Promise<SchemaTypes.ItemTypeSelfTargetSchema> {
    return this.client.request<SchemaTypes.ItemTypeSelfTargetSchema>({
      method: 'GET',
      url: `/item-types/${itemTypeId}`,
    });
  }

  /**
   * Duplicate model
   *
   * Read more: https://www.datocms.com/docs/content-management-api/resources/item-type/duplicate
   *
   * @throws {ApiError}
   * @throws {TimeoutError}
   */
  duplicate(itemTypeId: string | SimpleSchemaTypes.ItemTypeData) {
    return this.rawDuplicate(Utils.toId(itemTypeId)).then((body) =>
      Utils.deserializeResponseBody<SimpleSchemaTypes.ItemTypeDuplicateTargetSchema>(
        body,
      ),
    );
  }

  /**
   * Duplicate model
   *
   * Read more: https://www.datocms.com/docs/content-management-api/resources/item-type/duplicate
   *
   * @throws {ApiError}
   * @throws {TimeoutError}
   */
  rawDuplicate(
    itemTypeId: string,
  ): Promise<SchemaTypes.ItemTypeDuplicateTargetSchema> {
    return this.client.request<SchemaTypes.ItemTypeDuplicateTargetSchema>({
      method: 'POST',
      url: `/item-types/${itemTypeId}/duplicate`,
    });
  }

  /**
   * Delete a model
   *
   * Read more: https://www.datocms.com/docs/content-management-api/resources/item-type/destroy
   *
   * @throws {ApiError}
   * @throws {TimeoutError}
   */
  destroy(
    itemTypeId: string | SimpleSchemaTypes.ItemTypeData,
    queryParams?: SimpleSchemaTypes.ItemTypeDestroyHrefSchema,
  ) {
    return this.rawDestroy(Utils.toId(itemTypeId), queryParams).then((body) =>
      Utils.deserializeResponseBody<SimpleSchemaTypes.ItemTypeDestroyJobSchema>(
        body,
      ),
    );
  }

  /**
   * Delete a model
   *
   * Read more: https://www.datocms.com/docs/content-management-api/resources/item-type/destroy
   *
   * @throws {ApiError}
   * @throws {TimeoutError}
   */
  rawDestroy(
    itemTypeId: string,
    queryParams?: SchemaTypes.ItemTypeDestroyHrefSchema,
  ): Promise<SchemaTypes.ItemTypeDestroyJobSchema> {
    return this.client.request<SchemaTypes.ItemTypeDestroyJobSchema>({
      method: 'DELETE',
      url: `/item-types/${itemTypeId}`,
      queryParams,
    });
  }

  /**
   * Reorders a set of fields and fieldsets within the model
   *
   * Read more: https://www.datocms.com/docs/content-management-api/resources/item-type/reorder_fields_and_fieldsets
   *
   * @throws {ApiError}
   * @throws {TimeoutError}
   *
   * @deprecated This API call is to be considered private and might change without notice
   */
  rawReorderFieldsAndFieldsets(
    itemTypeId: string,
    body: SchemaTypes.ItemTypeReorderFieldsAndFieldsetsSchema,
  ): Promise<SchemaTypes.ItemTypeReorderFieldsAndFieldsetsJobSchema> {
    return this.client.request<SchemaTypes.ItemTypeReorderFieldsAndFieldsetsJobSchema>(
      {
        method: 'POST',
        url: `/item-types/${itemTypeId}/reorder-fields-and-fieldsets`,
        body,
      },
    );
  }
}
