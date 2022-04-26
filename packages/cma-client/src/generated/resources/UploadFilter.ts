import * as Utils from '@datocms/rest-client-utils';
import * as SchemaTypes from '../SchemaTypes';
import * as SimpleSchemaTypes from '../SimpleSchemaTypes';
import BaseResource from '../../BaseResource';

export default class UploadFilter extends BaseResource {
  static readonly TYPE: 'upload_filter' = 'upload_filter';

  /**
   * Create a new filter
   *
   * Read more: https://www.datocms.com/docs/content-management-api/resources/upload-filter/create
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
   */
  rawCreate(
    body: SchemaTypes.UploadFilterCreateSchema,
  ): Promise<SchemaTypes.UploadFilterCreateTargetSchema> {
    return this.client.request<SchemaTypes.UploadFilterCreateTargetSchema>({
      method: 'POST',
      url: `/upload-filters`,
      body,
    });
  }

  /**
   * Update a filter
   *
   * Read more: https://www.datocms.com/docs/content-management-api/resources/upload-filter/update
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
   */
  rawList(): Promise<SchemaTypes.UploadFilterInstancesTargetSchema> {
    return this.client.request<SchemaTypes.UploadFilterInstancesTargetSchema>({
      method: 'GET',
      url: `/upload-filters`,
    });
  }

  /**
   * Retrieve a filter
   *
   * Read more: https://www.datocms.com/docs/content-management-api/resources/upload-filter/self
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
