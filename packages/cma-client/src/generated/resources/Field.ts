import * as Utils from '@datocms/rest-client-utils';
import * as SchemaTypes from '../SchemaTypes';
import * as SimpleSchemaTypes from '../SimpleSchemaTypes';
import BaseResource from '../../BaseResource';

export default class Field extends BaseResource {
  static readonly TYPE: 'field' = 'field';

  /**
   * Create a new field
   *
   * Read more: https://www.datocms.com/docs/content-management-api/resources/field/create
   */
  create(
    itemTypeId: string | SimpleSchemaTypes.ItemTypeData,
    body: SimpleSchemaTypes.FieldCreateSchema,
  ) {
    return this.rawCreate(
      Utils.toId(itemTypeId),
      Utils.serializeRequestBody<SchemaTypes.FieldCreateSchema>(body, {
        type: 'field',
        attributes: [
          'label',
          'field_type',
          'api_key',
          'localized',
          'validators',
          'appeareance',
          'appearance',
          'position',
          'hint',
          'default_value',
        ],
        relationships: ['fieldset'],
      }),
    ).then((body) =>
      Utils.deserializeResponseBody<SimpleSchemaTypes.FieldCreateJobSchema>(
        body,
      ),
    );
  }

  /**
   * Create a new field
   *
   * Read more: https://www.datocms.com/docs/content-management-api/resources/field/create
   */
  rawCreate(
    itemTypeId: string,
    body: SchemaTypes.FieldCreateSchema,
  ): Promise<SchemaTypes.FieldCreateJobSchema> {
    return this.client.request<SchemaTypes.FieldCreateJobSchema>({
      method: 'POST',
      url: `/item-types/${itemTypeId}/fields`,
      body,
    });
  }

  /**
   * Update a field
   *
   * Read more: https://www.datocms.com/docs/content-management-api/resources/field/update
   */
  update(
    fieldId: string | SimpleSchemaTypes.FieldData,
    body: SimpleSchemaTypes.FieldUpdateSchema,
  ) {
    return this.rawUpdate(
      Utils.toId(fieldId),
      Utils.serializeRequestBody<SchemaTypes.FieldUpdateSchema>(body, {
        id: Utils.toId(fieldId),
        type: 'field',
        attributes: [
          'default_value',
          'label',
          'api_key',
          'localized',
          'validators',
          'appeareance',
          'appearance',
          'position',
          'field_type',
          'hint',
        ],
        relationships: ['fieldset'],
      }),
    ).then((body) =>
      Utils.deserializeResponseBody<SimpleSchemaTypes.FieldUpdateJobSchema>(
        body,
      ),
    );
  }

  /**
   * Update a field
   *
   * Read more: https://www.datocms.com/docs/content-management-api/resources/field/update
   */
  rawUpdate(
    fieldId: string,
    body: SchemaTypes.FieldUpdateSchema,
  ): Promise<SchemaTypes.FieldUpdateJobSchema> {
    return this.client.request<SchemaTypes.FieldUpdateJobSchema>({
      method: 'PUT',
      url: `/fields/${fieldId}`,
      body,
    });
  }

  /**
   * List all fields
   *
   * Read more: https://www.datocms.com/docs/content-management-api/resources/field/instances
   */
  list(itemTypeId: string | SimpleSchemaTypes.ItemTypeData) {
    return this.rawList(Utils.toId(itemTypeId)).then((body) =>
      Utils.deserializeResponseBody<SimpleSchemaTypes.FieldInstancesTargetSchema>(
        body,
      ),
    );
  }

  /**
   * List all fields
   *
   * Read more: https://www.datocms.com/docs/content-management-api/resources/field/instances
   */
  rawList(itemTypeId: string): Promise<SchemaTypes.FieldInstancesTargetSchema> {
    return this.client.request<SchemaTypes.FieldInstancesTargetSchema>({
      method: 'GET',
      url: `/item-types/${itemTypeId}/fields`,
    });
  }

  /**
   * List referenced fields
   *
   * Read more: https://www.datocms.com/docs/content-management-api/resources/field/referencing
   *
   * @deprecated This API call is to be considered private and might change without notice
   */
  referencing(itemTypeId: string | SimpleSchemaTypes.ItemTypeData) {
    return this.rawReferencing(Utils.toId(itemTypeId)).then((body) =>
      Utils.deserializeResponseBody<SimpleSchemaTypes.FieldReferencingTargetSchema>(
        body,
      ),
    );
  }

  /**
   * List referenced fields
   *
   * Read more: https://www.datocms.com/docs/content-management-api/resources/field/referencing
   *
   * @deprecated This API call is to be considered private and might change without notice
   */
  rawReferencing(
    itemTypeId: string,
  ): Promise<SchemaTypes.FieldReferencingTargetSchema> {
    return this.client.request<SchemaTypes.FieldReferencingTargetSchema>({
      method: 'GET',
      url: `/item-types/${itemTypeId}/fields/referencing`,
    });
  }

  /**
   * List related fields
   *
   * Read more: https://www.datocms.com/docs/content-management-api/resources/field/related
   *
   * @deprecated This API call is to be considered private and might change without notice
   */
  related(itemTypeId: string | SimpleSchemaTypes.ItemTypeData) {
    return this.rawRelated(Utils.toId(itemTypeId)).then((body) =>
      Utils.deserializeResponseBody<SimpleSchemaTypes.FieldRelatedTargetSchema>(
        body,
      ),
    );
  }

  /**
   * List related fields
   *
   * Read more: https://www.datocms.com/docs/content-management-api/resources/field/related
   *
   * @deprecated This API call is to be considered private and might change without notice
   */
  rawRelated(
    itemTypeId: string,
  ): Promise<SchemaTypes.FieldRelatedTargetSchema> {
    return this.client.request<SchemaTypes.FieldRelatedTargetSchema>({
      method: 'GET',
      url: `/item-types/${itemTypeId}/fields/related`,
    });
  }

  /**
   * Retrieve a field
   *
   * Read more: https://www.datocms.com/docs/content-management-api/resources/field/self
   */
  find(fieldId: string | SimpleSchemaTypes.FieldData) {
    return this.rawFind(Utils.toId(fieldId)).then((body) =>
      Utils.deserializeResponseBody<SimpleSchemaTypes.FieldSelfTargetSchema>(
        body,
      ),
    );
  }

  /**
   * Retrieve a field
   *
   * Read more: https://www.datocms.com/docs/content-management-api/resources/field/self
   */
  rawFind(fieldId: string): Promise<SchemaTypes.FieldSelfTargetSchema> {
    return this.client.request<SchemaTypes.FieldSelfTargetSchema>({
      method: 'GET',
      url: `/fields/${fieldId}`,
    });
  }

  /**
   * Delete a field
   *
   * Read more: https://www.datocms.com/docs/content-management-api/resources/field/destroy
   */
  destroy(fieldId: string | SimpleSchemaTypes.FieldData) {
    return this.rawDestroy(Utils.toId(fieldId)).then((body) =>
      Utils.deserializeResponseBody<SimpleSchemaTypes.FieldDestroyJobSchema>(
        body,
      ),
    );
  }

  /**
   * Delete a field
   *
   * Read more: https://www.datocms.com/docs/content-management-api/resources/field/destroy
   */
  rawDestroy(fieldId: string): Promise<SchemaTypes.FieldDestroyJobSchema> {
    return this.client.request<SchemaTypes.FieldDestroyJobSchema>({
      method: 'DELETE',
      url: `/fields/${fieldId}`,
    });
  }

  /**
   * Duplicate a field
   *
   * Read more: https://www.datocms.com/docs/content-management-api/resources/field/duplicate
   */
  duplicate(fieldId: string | SimpleSchemaTypes.FieldData) {
    return this.rawDuplicate(Utils.toId(fieldId)).then((body) =>
      Utils.deserializeResponseBody<SimpleSchemaTypes.FieldDuplicateJobSchema>(
        body,
      ),
    );
  }

  /**
   * Duplicate a field
   *
   * Read more: https://www.datocms.com/docs/content-management-api/resources/field/duplicate
   */
  rawDuplicate(fieldId: string): Promise<SchemaTypes.FieldDuplicateJobSchema> {
    return this.client.request<SchemaTypes.FieldDuplicateJobSchema>({
      method: 'POST',
      url: `/fields/${fieldId}/duplicate`,
    });
  }
}
