import * as Utils from '@datocms/rest-client-utils';
import * as SchemaTypes from '../SchemaTypes';
import * as SimpleSchemaTypes from '../SimpleSchemaTypes';
import BaseResource from '../../BaseResource';

export default class Fieldset extends BaseResource {
  static readonly TYPE: 'fieldset' = 'fieldset';

  /**
   * Create a new fieldset
   *
   * Read more: https://www.datocms.com/docs/content-management-api/resources/fieldset/create
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
