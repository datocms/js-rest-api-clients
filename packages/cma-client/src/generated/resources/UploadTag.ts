import * as Utils from '@datocms/rest-client-utils';
import * as SchemaTypes from '../SchemaTypes';
import * as SimpleSchemaTypes from '../SimpleSchemaTypes';
import BaseResource from '../../BaseResource';

export default class UploadTag extends BaseResource {
  static readonly TYPE: 'upload_tag' = 'upload_tag';

  /**
   * List all manually created upload tags
   *
   * Read more: https://www.datocms.com/docs/content-management-api/resources/upload-tag/instances
   */
  list(queryParams?: SimpleSchemaTypes.UploadTagInstancesHrefSchema) {
    return this.rawList(queryParams).then((body) =>
      Utils.deserializeResponseBody<SimpleSchemaTypes.UploadTagInstancesTargetSchema>(
        body,
      ),
    );
  }

  /**
   * List all manually created upload tags
   *
   * Read more: https://www.datocms.com/docs/content-management-api/resources/upload-tag/instances
   */
  rawList(
    queryParams?: SchemaTypes.UploadTagInstancesHrefSchema,
  ): Promise<SchemaTypes.UploadTagInstancesTargetSchema> {
    return this.client.request<SchemaTypes.UploadTagInstancesTargetSchema>({
      method: 'GET',
      url: `/upload-tags`,
      queryParams,
    });
  }

  /**
   * Async iterator to auto-paginate over elements returned by list()
   *
   * Read more: https://www.datocms.com/docs/content-management-api/resources/upload-tag/instances
   */
  async *listPagedIterator(
    queryParams?: SimpleSchemaTypes.UploadTagInstancesHrefSchema,
    iteratorOptions?: Utils.IteratorOptions,
  ) {
    for await (const element of this.rawListPagedIterator(
      queryParams,
      iteratorOptions,
    )) {
      yield Utils.deserializeJsonEntity<
        SimpleSchemaTypes.UploadTagInstancesTargetSchema[0]
      >(element);
    }
  }

  /**
   * Async iterator to auto-paginate over elements returned by rawList()
   *
   * Read more: https://www.datocms.com/docs/content-management-api/resources/upload-tag/instances
   */
  rawListPagedIterator(
    queryParams?: SchemaTypes.UploadTagInstancesHrefSchema,
    iteratorOptions?: Utils.IteratorOptions,
  ) {
    return Utils.rawPageIterator<
      SchemaTypes.UploadTagInstancesTargetSchema['data'][0]
    >(
      {
        defaultLimit: 50,
        maxLimit: 500,
      },
      (page) => this.rawList({ ...queryParams, page }),
      iteratorOptions,
    );
  }

  /**
   * Create a new upload tag
   *
   * Read more: https://www.datocms.com/docs/content-management-api/resources/upload-tag/create
   */
  create(body: SimpleSchemaTypes.UploadTagCreateSchema) {
    return this.rawCreate(
      Utils.serializeRequestBody<SchemaTypes.UploadTagCreateSchema>(body, {
        type: 'upload_tag',
        attributes: ['name'],
        relationships: [],
      }),
    ).then((body) =>
      Utils.deserializeResponseBody<SimpleSchemaTypes.UploadTagCreateTargetSchema>(
        body,
      ),
    );
  }

  /**
   * Create a new upload tag
   *
   * Read more: https://www.datocms.com/docs/content-management-api/resources/upload-tag/create
   */
  rawCreate(
    body: SchemaTypes.UploadTagCreateSchema,
  ): Promise<SchemaTypes.UploadTagCreateTargetSchema> {
    return this.client.request<SchemaTypes.UploadTagCreateTargetSchema>({
      method: 'POST',
      url: `/upload-tags`,
      body,
    });
  }
}
