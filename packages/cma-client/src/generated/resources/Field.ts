import * as Utils from '@datocms/rest-client-utils';
import BaseResource from '../../BaseResource';
import type * as ApiTypes from '../ApiTypes';
import type * as RawApiTypes from '../RawApiTypes';

export default class Field extends BaseResource {
  static readonly TYPE = 'field' as const;

  /**
   * Create a new field
   *
   * Read more: https://www.datocms.com/docs/content-management-api/resources/field/create
   *
   * @throws {ApiError}
   * @throws {TimeoutError}
   */
  create(
    itemTypeId: string | ApiTypes.ItemTypeData,
    body: ApiTypes.FieldCreateSchema,
  ) {
    return this.rawCreate(
      Utils.toId(itemTypeId),
      Utils.serializeRequestBody<RawApiTypes.FieldCreateSchema>(body, {
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
          'deep_filtering_enabled',
        ],
        relationships: ['fieldset'],
      }),
    ).then((body) =>
      Utils.deserializeResponseBody<ApiTypes.FieldCreateJobSchema>(body),
    );
  }

  /**
   * Create a new field
   *
   * Read more: https://www.datocms.com/docs/content-management-api/resources/field/create
   *
   * @throws {ApiError}
   * @throws {TimeoutError}
   */
  rawCreate(
    itemTypeId: string,
    body: RawApiTypes.FieldCreateSchema,
  ): Promise<RawApiTypes.FieldCreateJobSchema> {
    return this.client.request<RawApiTypes.FieldCreateJobSchema>({
      method: 'POST',
      url: `/item-types/${itemTypeId}/fields`,
      body,
    });
  }

  /**
   * Update a field
   *
   * Read more: https://www.datocms.com/docs/content-management-api/resources/field/update
   *
   * @throws {ApiError}
   * @throws {TimeoutError}
   */
  update(
    fieldId: string | ApiTypes.FieldData,
    body: ApiTypes.FieldUpdateSchema,
  ) {
    return this.rawUpdate(
      Utils.toId(fieldId),
      Utils.serializeRequestBody<RawApiTypes.FieldUpdateSchema>(body, {
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
          'deep_filtering_enabled',
        ],
        relationships: ['fieldset'],
      }),
    ).then((body) =>
      Utils.deserializeResponseBody<ApiTypes.FieldUpdateJobSchema>(body),
    );
  }

  /**
   * Update a field
   *
   * Read more: https://www.datocms.com/docs/content-management-api/resources/field/update
   *
   * @throws {ApiError}
   * @throws {TimeoutError}
   */
  rawUpdate(
    fieldId: string,
    body: RawApiTypes.FieldUpdateSchema,
  ): Promise<RawApiTypes.FieldUpdateJobSchema> {
    return this.client.request<RawApiTypes.FieldUpdateJobSchema>({
      method: 'PUT',
      url: `/fields/${fieldId}`,
      body,
    });
  }

  /**
   * List all fields of a model/block
   *
   * Read more: https://www.datocms.com/docs/content-management-api/resources/field/instances
   *
   * @throws {ApiError}
   * @throws {TimeoutError}
   */
  list(itemTypeId: string | ApiTypes.ItemTypeData) {
    return this.rawList(Utils.toId(itemTypeId)).then((body) =>
      Utils.deserializeResponseBody<ApiTypes.FieldInstancesTargetSchema>(body),
    );
  }

  /**
   * List all fields of a model/block
   *
   * Read more: https://www.datocms.com/docs/content-management-api/resources/field/instances
   *
   * @throws {ApiError}
   * @throws {TimeoutError}
   */
  rawList(itemTypeId: string): Promise<RawApiTypes.FieldInstancesTargetSchema> {
    return this.client.request<RawApiTypes.FieldInstancesTargetSchema>({
      method: 'GET',
      url: `/item-types/${itemTypeId}/fields`,
    });
  }

  /**
   * List fields referencing a model/block
   *
   * Read more: https://www.datocms.com/docs/content-management-api/resources/field/referencing
   *
   * @throws {ApiError}
   * @throws {TimeoutError}
   */
  referencing(itemTypeId: string | ApiTypes.ItemTypeData) {
    return this.rawReferencing(Utils.toId(itemTypeId)).then((body) =>
      Utils.deserializeResponseBody<ApiTypes.FieldReferencingTargetSchema>(
        body,
      ),
    );
  }

  /**
   * List fields referencing a model/block
   *
   * Read more: https://www.datocms.com/docs/content-management-api/resources/field/referencing
   *
   * @throws {ApiError}
   * @throws {TimeoutError}
   */
  rawReferencing(
    itemTypeId: string,
  ): Promise<RawApiTypes.FieldReferencingTargetSchema> {
    return this.client.request<RawApiTypes.FieldReferencingTargetSchema>({
      method: 'GET',
      url: `/item-types/${itemTypeId}/fields/referencing`,
    });
  }

  /**
   * List related fields
   *
   * Read more: https://www.datocms.com/docs/content-management-api/resources/field/related
   *
   * @throws {ApiError}
   * @throws {TimeoutError}
   *
   * @deprecated This API call is to be considered private and might change without notice
   */
  related(itemTypeId: string | ApiTypes.ItemTypeData) {
    return this.rawRelated(Utils.toId(itemTypeId)).then((body) =>
      Utils.deserializeResponseBody<ApiTypes.FieldRelatedTargetSchema>(body),
    );
  }

  /**
   * List related fields
   *
   * Read more: https://www.datocms.com/docs/content-management-api/resources/field/related
   *
   * @throws {ApiError}
   * @throws {TimeoutError}
   *
   * @deprecated This API call is to be considered private and might change without notice
   */
  rawRelated(
    itemTypeId: string,
  ): Promise<RawApiTypes.FieldRelatedTargetSchema> {
    return this.client.request<RawApiTypes.FieldRelatedTargetSchema>({
      method: 'GET',
      url: `/item-types/${itemTypeId}/fields/related`,
    });
  }

  /**
   * Retrieve a field
   *
   * Read more: https://www.datocms.com/docs/content-management-api/resources/field/self
   *
   * @throws {ApiError}
   * @throws {TimeoutError}
   */
  find(fieldId: string | ApiTypes.FieldData) {
    return this.rawFind(Utils.toId(fieldId)).then((body) =>
      Utils.deserializeResponseBody<ApiTypes.FieldSelfTargetSchema>(body),
    );
  }

  /**
   * Retrieve a field
   *
   * Read more: https://www.datocms.com/docs/content-management-api/resources/field/self
   *
   * @throws {ApiError}
   * @throws {TimeoutError}
   */
  rawFind(fieldId: string): Promise<RawApiTypes.FieldSelfTargetSchema> {
    return this.client.request<RawApiTypes.FieldSelfTargetSchema>({
      method: 'GET',
      url: `/fields/${fieldId}`,
    });
  }

  /**
   * Delete a field
   *
   * Read more: https://www.datocms.com/docs/content-management-api/resources/field/destroy
   *
   * @throws {ApiError}
   * @throws {TimeoutError}
   */
  destroy(fieldId: string | ApiTypes.FieldData) {
    return this.rawDestroy(Utils.toId(fieldId)).then((body) =>
      Utils.deserializeResponseBody<ApiTypes.FieldDestroyJobSchema>(body),
    );
  }

  /**
   * Delete a field
   *
   * Read more: https://www.datocms.com/docs/content-management-api/resources/field/destroy
   *
   * @throws {ApiError}
   * @throws {TimeoutError}
   */
  rawDestroy(fieldId: string): Promise<RawApiTypes.FieldDestroyJobSchema> {
    return this.client.request<RawApiTypes.FieldDestroyJobSchema>({
      method: 'DELETE',
      url: `/fields/${fieldId}`,
    });
  }

  /**
   * Duplicate a field
   *
   * Read more: https://www.datocms.com/docs/content-management-api/resources/field/duplicate
   *
   * @throws {ApiError}
   * @throws {TimeoutError}
   */
  duplicate(fieldId: string | ApiTypes.FieldData) {
    return this.rawDuplicate(Utils.toId(fieldId)).then((body) =>
      Utils.deserializeResponseBody<ApiTypes.FieldDuplicateJobSchema>(body),
    );
  }

  /**
   * Duplicate a field
   *
   * Read more: https://www.datocms.com/docs/content-management-api/resources/field/duplicate
   *
   * @throws {ApiError}
   * @throws {TimeoutError}
   */
  rawDuplicate(fieldId: string): Promise<RawApiTypes.FieldDuplicateJobSchema> {
    return this.client.request<RawApiTypes.FieldDuplicateJobSchema>({
      method: 'POST',
      url: `/fields/${fieldId}/duplicate`,
    });
  }
}
