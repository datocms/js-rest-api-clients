import * as Utils from '@datocms/rest-client-utils';
import BaseResource from '../../BaseResource';
import type * as ApiTypes from '../ApiTypes';
import type * as RawApiTypes from '../RawApiTypes';

export default class Fieldset extends BaseResource {
  static readonly TYPE = 'fieldset' as const;

  /**
   * Create a new fieldset
   *
   * Read more: https://www.datocms.com/docs/content-management-api/resources/fieldset/create
   *
   * @throws {ApiError}
   * @throws {TimeoutError}
   */
  create(
    itemTypeId: string | ApiTypes.ItemTypeData,
    body: ApiTypes.FieldsetCreateSchema,
  ) {
    return this.rawCreate(
      Utils.toId(itemTypeId),
      Utils.serializeRequestBody<RawApiTypes.FieldsetCreateSchema>(body, {
        type: 'fieldset',
        attributes: [
          'title',
          'hint',
          'position',
          'collapsible',
          'start_collapsed',
        ],
        relationships: [],
      }),
    ).then((body) =>
      Utils.deserializeResponseBody<ApiTypes.FieldsetCreateTargetSchema>(body),
    );
  }

  /**
   * Create a new fieldset
   *
   * Read more: https://www.datocms.com/docs/content-management-api/resources/fieldset/create
   *
   * @throws {ApiError}
   * @throws {TimeoutError}
   */
  rawCreate(
    itemTypeId: string,
    body: RawApiTypes.FieldsetCreateSchema,
  ): Promise<RawApiTypes.FieldsetCreateTargetSchema> {
    return this.client.request<RawApiTypes.FieldsetCreateTargetSchema>({
      method: 'POST',
      url: `/item-types/${itemTypeId}/fieldsets`,
      body,
    });
  }

  /**
   * Update a fieldset
   *
   * Read more: https://www.datocms.com/docs/content-management-api/resources/fieldset/update
   *
   * @throws {ApiError}
   * @throws {TimeoutError}
   */
  update(
    fieldsetId: string | ApiTypes.FieldsetData,
    body: ApiTypes.FieldsetUpdateSchema,
  ) {
    return this.rawUpdate(
      Utils.toId(fieldsetId),
      Utils.serializeRequestBody<RawApiTypes.FieldsetUpdateSchema>(body, {
        id: Utils.toId(fieldsetId),
        type: 'fieldset',
        attributes: [
          'title',
          'hint',
          'position',
          'collapsible',
          'start_collapsed',
        ],
        relationships: [],
      }),
    ).then((body) =>
      Utils.deserializeResponseBody<ApiTypes.FieldsetUpdateTargetSchema>(body),
    );
  }

  /**
   * Update a fieldset
   *
   * Read more: https://www.datocms.com/docs/content-management-api/resources/fieldset/update
   *
   * @throws {ApiError}
   * @throws {TimeoutError}
   */
  rawUpdate(
    fieldsetId: string,
    body: RawApiTypes.FieldsetUpdateSchema,
  ): Promise<RawApiTypes.FieldsetUpdateTargetSchema> {
    return this.client.request<RawApiTypes.FieldsetUpdateTargetSchema>({
      method: 'PUT',
      url: `/fieldsets/${fieldsetId}`,
      body,
    });
  }

  /**
   * List all fieldsets of a model/block
   *
   * Read more: https://www.datocms.com/docs/content-management-api/resources/fieldset/instances
   *
   * @throws {ApiError}
   * @throws {TimeoutError}
   */
  list(itemTypeId: string | ApiTypes.ItemTypeData) {
    return this.rawList(Utils.toId(itemTypeId)).then((body) =>
      Utils.deserializeResponseBody<ApiTypes.FieldsetInstancesTargetSchema>(
        body,
      ),
    );
  }

  /**
   * List all fieldsets of a model/block
   *
   * Read more: https://www.datocms.com/docs/content-management-api/resources/fieldset/instances
   *
   * @throws {ApiError}
   * @throws {TimeoutError}
   */
  rawList(
    itemTypeId: string,
  ): Promise<RawApiTypes.FieldsetInstancesTargetSchema> {
    return this.client.request<RawApiTypes.FieldsetInstancesTargetSchema>({
      method: 'GET',
      url: `/item-types/${itemTypeId}/fieldsets`,
    });
  }

  /**
   * Retrieve a fieldset
   *
   * Read more: https://www.datocms.com/docs/content-management-api/resources/fieldset/self
   *
   * @throws {ApiError}
   * @throws {TimeoutError}
   */
  find(fieldsetId: string | ApiTypes.FieldsetData) {
    return this.rawFind(Utils.toId(fieldsetId)).then((body) =>
      Utils.deserializeResponseBody<ApiTypes.FieldsetSelfTargetSchema>(body),
    );
  }

  /**
   * Retrieve a fieldset
   *
   * Read more: https://www.datocms.com/docs/content-management-api/resources/fieldset/self
   *
   * @throws {ApiError}
   * @throws {TimeoutError}
   */
  rawFind(fieldsetId: string): Promise<RawApiTypes.FieldsetSelfTargetSchema> {
    return this.client.request<RawApiTypes.FieldsetSelfTargetSchema>({
      method: 'GET',
      url: `/fieldsets/${fieldsetId}`,
    });
  }

  /**
   * Delete a fieldset
   *
   * Read more: https://www.datocms.com/docs/content-management-api/resources/fieldset/destroy
   *
   * @throws {ApiError}
   * @throws {TimeoutError}
   */
  destroy(fieldsetId: string | ApiTypes.FieldsetData) {
    return this.rawDestroy(Utils.toId(fieldsetId)).then((body) =>
      Utils.deserializeResponseBody<ApiTypes.FieldsetDestroyTargetSchema>(body),
    );
  }

  /**
   * Delete a fieldset
   *
   * Read more: https://www.datocms.com/docs/content-management-api/resources/fieldset/destroy
   *
   * @throws {ApiError}
   * @throws {TimeoutError}
   */
  rawDestroy(
    fieldsetId: string,
  ): Promise<RawApiTypes.FieldsetDestroyTargetSchema> {
    return this.client.request<RawApiTypes.FieldsetDestroyTargetSchema>({
      method: 'DELETE',
      url: `/fieldsets/${fieldsetId}`,
    });
  }
}
