import * as Utils from '@datocms/rest-client-utils';
import BaseResource from '../../BaseResource';
import type * as ApiTypes from '../ApiTypes';
import type * as RawApiTypes from '../RawApiTypes';

export default class ItemType extends BaseResource {
  static readonly TYPE = 'item_type' as const;

  /**
   * Create a new model/block model
   *
   * Read more: https://www.datocms.com/docs/content-management-api/resources/item-type/create
   *
   * @throws {ApiError}
   * @throws {TimeoutError}
   */
  create(
    body: ApiTypes.ItemTypeCreateSchema,
    queryParams?: ApiTypes.ItemTypeCreateHrefSchema,
  ) {
    return this.rawCreate(
      Utils.serializeRequestBody<RawApiTypes.ItemTypeCreateSchema>(body, {
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
      Utils.deserializeResponseBody<ApiTypes.ItemTypeCreateTargetSchema>(body),
    );
  }

  /**
   * Create a new model/block model
   *
   * Read more: https://www.datocms.com/docs/content-management-api/resources/item-type/create
   *
   * @throws {ApiError}
   * @throws {TimeoutError}
   */
  rawCreate(
    body: RawApiTypes.ItemTypeCreateSchema,
    queryParams?: RawApiTypes.ItemTypeCreateHrefSchema,
  ): Promise<RawApiTypes.ItemTypeCreateTargetSchema> {
    return this.client.request<RawApiTypes.ItemTypeCreateTargetSchema>({
      method: 'POST',
      url: '/item-types',
      body,
      queryParams,
    });
  }

  /**
   * Update a model/block model
   *
   * Read more: https://www.datocms.com/docs/content-management-api/resources/item-type/update
   *
   * @throws {ApiError}
   * @throws {TimeoutError}
   */
  update(
    itemTypeId: string | ApiTypes.ItemTypeData,
    body: ApiTypes.ItemTypeUpdateSchema,
  ) {
    return this.rawUpdate(
      Utils.toId(itemTypeId),
      Utils.serializeRequestBody<RawApiTypes.ItemTypeUpdateSchema>(body, {
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
      Utils.deserializeResponseBody<ApiTypes.ItemTypeUpdateJobSchema>(body),
    );
  }

  /**
   * Update a model/block model
   *
   * Read more: https://www.datocms.com/docs/content-management-api/resources/item-type/update
   *
   * @throws {ApiError}
   * @throws {TimeoutError}
   */
  rawUpdate(
    itemTypeId: string,
    body: RawApiTypes.ItemTypeUpdateSchema,
  ): Promise<RawApiTypes.ItemTypeUpdateJobSchema> {
    return this.client.request<RawApiTypes.ItemTypeUpdateJobSchema>({
      method: 'PUT',
      url: `/item-types/${itemTypeId}`,
      body,
    });
  }

  /**
   * List all models/block models
   *
   * Read more: https://www.datocms.com/docs/content-management-api/resources/item-type/instances
   *
   * @throws {ApiError}
   * @throws {TimeoutError}
   */
  list() {
    return this.rawList().then((body) =>
      Utils.deserializeResponseBody<ApiTypes.ItemTypeInstancesTargetSchema>(
        body,
      ),
    );
  }

  /**
   * List all models/block models
   *
   * Read more: https://www.datocms.com/docs/content-management-api/resources/item-type/instances
   *
   * @throws {ApiError}
   * @throws {TimeoutError}
   */
  rawList(): Promise<RawApiTypes.ItemTypeInstancesTargetSchema> {
    return this.client.request<RawApiTypes.ItemTypeInstancesTargetSchema>({
      method: 'GET',
      url: '/item-types',
    });
  }

  /**
   * Retrieve a model/block model
   *
   * Read more: https://www.datocms.com/docs/content-management-api/resources/item-type/self
   *
   * @throws {ApiError}
   * @throws {TimeoutError}
   */
  find(itemTypeId: string | ApiTypes.ItemTypeData) {
    return this.rawFind(Utils.toId(itemTypeId)).then((body) =>
      Utils.deserializeResponseBody<ApiTypes.ItemTypeSelfTargetSchema>(body),
    );
  }

  /**
   * Retrieve a model/block model
   *
   * Read more: https://www.datocms.com/docs/content-management-api/resources/item-type/self
   *
   * @throws {ApiError}
   * @throws {TimeoutError}
   */
  rawFind(itemTypeId: string): Promise<RawApiTypes.ItemTypeSelfTargetSchema> {
    return this.client.request<RawApiTypes.ItemTypeSelfTargetSchema>({
      method: 'GET',
      url: `/item-types/${itemTypeId}`,
    });
  }

  /**
   * Duplicate model/block model
   *
   * Read more: https://www.datocms.com/docs/content-management-api/resources/item-type/duplicate
   *
   * @throws {ApiError}
   * @throws {TimeoutError}
   */
  duplicate(itemTypeId: string | ApiTypes.ItemTypeData) {
    return this.rawDuplicate(Utils.toId(itemTypeId)).then((body) =>
      Utils.deserializeResponseBody<ApiTypes.ItemTypeDuplicateTargetSchema>(
        body,
      ),
    );
  }

  /**
   * Duplicate model/block model
   *
   * Read more: https://www.datocms.com/docs/content-management-api/resources/item-type/duplicate
   *
   * @throws {ApiError}
   * @throws {TimeoutError}
   */
  rawDuplicate(
    itemTypeId: string,
  ): Promise<RawApiTypes.ItemTypeDuplicateTargetSchema> {
    return this.client.request<RawApiTypes.ItemTypeDuplicateTargetSchema>({
      method: 'POST',
      url: `/item-types/${itemTypeId}/duplicate`,
    });
  }

  /**
   * Delete a model/block model
   *
   * Read more: https://www.datocms.com/docs/content-management-api/resources/item-type/destroy
   *
   * @throws {ApiError}
   * @throws {TimeoutError}
   */
  destroy(
    itemTypeId: string | ApiTypes.ItemTypeData,
    queryParams?: ApiTypes.ItemTypeDestroyHrefSchema,
  ) {
    return this.rawDestroy(Utils.toId(itemTypeId), queryParams).then((body) =>
      Utils.deserializeResponseBody<ApiTypes.ItemTypeDestroyJobSchema>(body),
    );
  }

  /**
   * Delete a model/block model
   *
   * Read more: https://www.datocms.com/docs/content-management-api/resources/item-type/destroy
   *
   * @throws {ApiError}
   * @throws {TimeoutError}
   */
  rawDestroy(
    itemTypeId: string,
    queryParams?: RawApiTypes.ItemTypeDestroyHrefSchema,
  ): Promise<RawApiTypes.ItemTypeDestroyJobSchema> {
    return this.client.request<RawApiTypes.ItemTypeDestroyJobSchema>({
      method: 'DELETE',
      url: `/item-types/${itemTypeId}`,
      queryParams,
    });
  }

  /**
   * List models referencing another model/block
   *
   * Read more: https://www.datocms.com/docs/content-management-api/resources/item-type/referencing
   *
   * @throws {ApiError}
   * @throws {TimeoutError}
   */
  referencing(itemTypeId: string | ApiTypes.ItemTypeData) {
    return this.rawReferencing(Utils.toId(itemTypeId)).then((body) =>
      Utils.deserializeResponseBody<ApiTypes.ItemTypeReferencingTargetSchema>(
        body,
      ),
    );
  }

  /**
   * List models referencing another model/block
   *
   * Read more: https://www.datocms.com/docs/content-management-api/resources/item-type/referencing
   *
   * @throws {ApiError}
   * @throws {TimeoutError}
   */
  rawReferencing(
    itemTypeId: string,
  ): Promise<RawApiTypes.ItemTypeReferencingTargetSchema> {
    return this.client.request<RawApiTypes.ItemTypeReferencingTargetSchema>({
      method: 'GET',
      url: `/item-types/${itemTypeId}/referencing`,
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
    body: RawApiTypes.ItemTypeReorderFieldsAndFieldsetsSchema,
  ): Promise<RawApiTypes.ItemTypeReorderFieldsAndFieldsetsJobSchema> {
    return this.client.request<RawApiTypes.ItemTypeReorderFieldsAndFieldsetsJobSchema>(
      {
        method: 'POST',
        url: `/item-types/${itemTypeId}/reorder-fields-and-fieldsets`,
        body,
      },
    );
  }
}
