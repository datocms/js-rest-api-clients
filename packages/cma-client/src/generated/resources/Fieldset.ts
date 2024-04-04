import * as Utils from '@datocms/rest-client-utils';
import BaseResource from '../../BaseResource';
import type * as SchemaTypes from '../SchemaTypes';
import type * as SimpleSchemaTypes from '../SimpleSchemaTypes';

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
    itemTypeId: string | SimpleSchemaTypes.ItemTypeData,
    body: SimpleSchemaTypes.FieldsetCreateSchema,
  ) {
    return this.rawCreate(
      Utils.toId(itemTypeId),
      Utils.serializeRequestBody<SchemaTypes.FieldsetCreateSchema>(body, {
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
      Utils.deserializeResponseBody<SimpleSchemaTypes.FieldsetCreateTargetSchema>(
        body,
      ),
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
    body: SchemaTypes.FieldsetCreateSchema,
  ): Promise<SchemaTypes.FieldsetCreateTargetSchema> {
    return this.client.request<SchemaTypes.FieldsetCreateTargetSchema>({
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
    fieldsetId: string | SimpleSchemaTypes.FieldsetData,
    body: SimpleSchemaTypes.FieldsetUpdateSchema,
  ) {
    return this.rawUpdate(
      Utils.toId(fieldsetId),
      Utils.serializeRequestBody<SchemaTypes.FieldsetUpdateSchema>(body, {
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
      Utils.deserializeResponseBody<SimpleSchemaTypes.FieldsetUpdateTargetSchema>(
        body,
      ),
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
    body: SchemaTypes.FieldsetUpdateSchema,
  ): Promise<SchemaTypes.FieldsetUpdateTargetSchema> {
    return this.client.request<SchemaTypes.FieldsetUpdateTargetSchema>({
      method: 'PUT',
      url: `/fieldsets/${fieldsetId}`,
      body,
    });
  }

  /**
   * List all fieldsets
   *
   * Read more: https://www.datocms.com/docs/content-management-api/resources/fieldset/instances
   *
   * @throws {ApiError}
   * @throws {TimeoutError}
   */
  list(itemTypeId: string | SimpleSchemaTypes.ItemTypeData) {
    return this.rawList(Utils.toId(itemTypeId)).then((body) =>
      Utils.deserializeResponseBody<SimpleSchemaTypes.FieldsetInstancesTargetSchema>(
        body,
      ),
    );
  }

  /**
   * List all fieldsets
   *
   * Read more: https://www.datocms.com/docs/content-management-api/resources/fieldset/instances
   *
   * @throws {ApiError}
   * @throws {TimeoutError}
   */
  rawList(
    itemTypeId: string,
  ): Promise<SchemaTypes.FieldsetInstancesTargetSchema> {
    return this.client.request<SchemaTypes.FieldsetInstancesTargetSchema>({
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
  find(fieldsetId: string | SimpleSchemaTypes.FieldsetData) {
    return this.rawFind(Utils.toId(fieldsetId)).then((body) =>
      Utils.deserializeResponseBody<SimpleSchemaTypes.FieldsetSelfTargetSchema>(
        body,
      ),
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
  rawFind(fieldsetId: string): Promise<SchemaTypes.FieldsetSelfTargetSchema> {
    return this.client.request<SchemaTypes.FieldsetSelfTargetSchema>({
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
  destroy(fieldsetId: string | SimpleSchemaTypes.FieldsetData) {
    return this.rawDestroy(Utils.toId(fieldsetId)).then((body) =>
      Utils.deserializeResponseBody<SimpleSchemaTypes.FieldsetDestroyTargetSchema>(
        body,
      ),
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
  ): Promise<SchemaTypes.FieldsetDestroyTargetSchema> {
    return this.client.request<SchemaTypes.FieldsetDestroyTargetSchema>({
      method: 'DELETE',
      url: `/fieldsets/${fieldsetId}`,
    });
  }
}
