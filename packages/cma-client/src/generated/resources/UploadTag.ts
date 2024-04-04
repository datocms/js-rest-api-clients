import * as Utils from '@datocms/rest-client-utils';
import BaseResource from '../../BaseResource';
import type * as SchemaTypes from '../SchemaTypes';
import type * as SimpleSchemaTypes from '../SimpleSchemaTypes';

export default class UploadTag extends BaseResource {
  static readonly TYPE = 'upload_tag' as const;

  /**
   * List all manually created upload tags
   *
   * Read more: https://www.datocms.com/docs/content-management-api/resources/upload-tag/instances
   *
   * @throws {ApiError}
   * @throws {TimeoutError}
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
   *
   * @throws {ApiError}
   * @throws {TimeoutError}
   */
  rawList(
    queryParams?: SchemaTypes.UploadTagInstancesHrefSchema,
  ): Promise<SchemaTypes.UploadTagInstancesTargetSchema> {
    return this.client.request<SchemaTypes.UploadTagInstancesTargetSchema>({
      method: 'GET',
      url: '/upload-tags',
      queryParams,
    });
  }

  /**
   * Async iterator to auto-paginate over elements returned by list()
   *
   * Read more: https://www.datocms.com/docs/content-management-api/resources/upload-tag/instances
   *
   * @throws {ApiError}
   * @throws {TimeoutError}
   */
  async *listPagedIterator(
    queryParams?: Utils.OmitFromKnownKeys<
      SimpleSchemaTypes.UploadTagInstancesHrefSchema,
      'page'
    >,
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
   *
   * @throws {ApiError}
   * @throws {TimeoutError}
   */
  rawListPagedIterator(
    queryParams?: Utils.OmitFromKnownKeys<
      SchemaTypes.UploadTagInstancesHrefSchema,
      'page'
    >,
    iteratorOptions?: Utils.IteratorOptions,
  ) {
    Utils.warnOnPageQueryParam(queryParams);

    return Utils.rawPageIterator<
      SchemaTypes.UploadTagInstancesTargetSchema['data'][0]
    >(
      {
        defaultLimit: 50,
        maxLimit: 500,
      },
      (page: SchemaTypes.UploadTagInstancesHrefSchema['page']) =>
        this.rawList({ ...queryParams, page }),
      iteratorOptions,
    );
  }

  /**
   * Create a new upload tag
   *
   * Read more: https://www.datocms.com/docs/content-management-api/resources/upload-tag/create
   *
   * @throws {ApiError}
   * @throws {TimeoutError}
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
   *
   * @throws {ApiError}
   * @throws {TimeoutError}
   */
  rawCreate(
    body: SchemaTypes.UploadTagCreateSchema,
  ): Promise<SchemaTypes.UploadTagCreateTargetSchema> {
    return this.client.request<SchemaTypes.UploadTagCreateTargetSchema>({
      method: 'POST',
      url: '/upload-tags',
      body,
    });
  }
}
