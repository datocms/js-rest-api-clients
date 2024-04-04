import * as Utils from '@datocms/rest-client-utils';
import BaseResource from '../../BaseResource';
import type * as SchemaTypes from '../SchemaTypes';
import type * as SimpleSchemaTypes from '../SimpleSchemaTypes';

export default class UploadFilter extends BaseResource {
  static readonly TYPE = 'upload_filter' as const;

  /**
   * Create a new filter
   *
   * Read more: https://www.datocms.com/docs/content-management-api/resources/upload-filter/create
   *
   * @throws {ApiError}
   * @throws {TimeoutError}
   */
  create(body: SimpleSchemaTypes.UploadFilterCreateSchema) {
    return this.rawCreate(
      Utils.serializeRequestBody<SchemaTypes.UploadFilterCreateSchema>(body, {
        type: 'upload_filter',
        attributes: ['name', 'filter', 'shared'],
        relationships: [],
      }),
    ).then((body) =>
      Utils.deserializeResponseBody<SimpleSchemaTypes.UploadFilterCreateTargetSchema>(
        body,
      ),
    );
  }

  /**
   * Create a new filter
   *
   * Read more: https://www.datocms.com/docs/content-management-api/resources/upload-filter/create
   *
   * @throws {ApiError}
   * @throws {TimeoutError}
   */
  rawCreate(
    body: SchemaTypes.UploadFilterCreateSchema,
  ): Promise<SchemaTypes.UploadFilterCreateTargetSchema> {
    return this.client.request<SchemaTypes.UploadFilterCreateTargetSchema>({
      method: 'POST',
      url: '/upload-filters',
      body,
    });
  }

  /**
   * Update a filter
   *
   * Read more: https://www.datocms.com/docs/content-management-api/resources/upload-filter/update
   *
   * @throws {ApiError}
   * @throws {TimeoutError}
   */
  update(
    uploadFilterId: string | SimpleSchemaTypes.UploadFilterData,
    body: SimpleSchemaTypes.UploadFilterUpdateSchema,
  ) {
    return this.rawUpdate(
      Utils.toId(uploadFilterId),
      Utils.serializeRequestBody<SchemaTypes.UploadFilterUpdateSchema>(body, {
        id: Utils.toId(uploadFilterId),
        type: 'upload_filter',
        attributes: ['name', 'shared', 'filter'],
        relationships: [],
      }),
    ).then((body) =>
      Utils.deserializeResponseBody<SimpleSchemaTypes.UploadFilterUpdateTargetSchema>(
        body,
      ),
    );
  }

  /**
   * Update a filter
   *
   * Read more: https://www.datocms.com/docs/content-management-api/resources/upload-filter/update
   *
   * @throws {ApiError}
   * @throws {TimeoutError}
   */
  rawUpdate(
    uploadFilterId: string,
    body: SchemaTypes.UploadFilterUpdateSchema,
  ): Promise<SchemaTypes.UploadFilterUpdateTargetSchema> {
    return this.client.request<SchemaTypes.UploadFilterUpdateTargetSchema>({
      method: 'PUT',
      url: `/upload-filters/${uploadFilterId}`,
      body,
    });
  }

  /**
   * List all filters
   *
   * Read more: https://www.datocms.com/docs/content-management-api/resources/upload-filter/instances
   *
   * @throws {ApiError}
   * @throws {TimeoutError}
   */
  list() {
    return this.rawList().then((body) =>
      Utils.deserializeResponseBody<SimpleSchemaTypes.UploadFilterInstancesTargetSchema>(
        body,
      ),
    );
  }

  /**
   * List all filters
   *
   * Read more: https://www.datocms.com/docs/content-management-api/resources/upload-filter/instances
   *
   * @throws {ApiError}
   * @throws {TimeoutError}
   */
  rawList(): Promise<SchemaTypes.UploadFilterInstancesTargetSchema> {
    return this.client.request<SchemaTypes.UploadFilterInstancesTargetSchema>({
      method: 'GET',
      url: '/upload-filters',
    });
  }

  /**
   * Retrieve a filter
   *
   * Read more: https://www.datocms.com/docs/content-management-api/resources/upload-filter/self
   *
   * @throws {ApiError}
   * @throws {TimeoutError}
   */
  find(uploadFilterId: string | SimpleSchemaTypes.UploadFilterData) {
    return this.rawFind(Utils.toId(uploadFilterId)).then((body) =>
      Utils.deserializeResponseBody<SimpleSchemaTypes.UploadFilterSelfTargetSchema>(
        body,
      ),
    );
  }

  /**
   * Retrieve a filter
   *
   * Read more: https://www.datocms.com/docs/content-management-api/resources/upload-filter/self
   *
   * @throws {ApiError}
   * @throws {TimeoutError}
   */
  rawFind(
    uploadFilterId: string,
  ): Promise<SchemaTypes.UploadFilterSelfTargetSchema> {
    return this.client.request<SchemaTypes.UploadFilterSelfTargetSchema>({
      method: 'GET',
      url: `/upload-filters/${uploadFilterId}`,
    });
  }

  /**
   * Delete a filter
   *
   * Read more: https://www.datocms.com/docs/content-management-api/resources/upload-filter/destroy
   *
   * @throws {ApiError}
   * @throws {TimeoutError}
   */
  destroy(uploadFilterId: string | SimpleSchemaTypes.UploadFilterData) {
    return this.rawDestroy(Utils.toId(uploadFilterId)).then((body) =>
      Utils.deserializeResponseBody<SimpleSchemaTypes.UploadFilterDestroyTargetSchema>(
        body,
      ),
    );
  }

  /**
   * Delete a filter
   *
   * Read more: https://www.datocms.com/docs/content-management-api/resources/upload-filter/destroy
   *
   * @throws {ApiError}
   * @throws {TimeoutError}
   */
  rawDestroy(
    uploadFilterId: string,
  ): Promise<SchemaTypes.UploadFilterDestroyTargetSchema> {
    return this.client.request<SchemaTypes.UploadFilterDestroyTargetSchema>({
      method: 'DELETE',
      url: `/upload-filters/${uploadFilterId}`,
    });
  }
}
