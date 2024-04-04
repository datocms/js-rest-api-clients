import * as Utils from '@datocms/rest-client-utils';
import BaseResource from '../../BaseResource';
import type * as SchemaTypes from '../SchemaTypes';
import type * as SimpleSchemaTypes from '../SimpleSchemaTypes';

export default class UploadSmartTag extends BaseResource {
  static readonly TYPE = 'upload_smart_tag' as const;

  /**
   * List all automatically created upload tags
   *
   * Read more: https://www.datocms.com/docs/content-management-api/resources/upload-smart_tag/instances
   *
   * @throws {ApiError}
   * @throws {TimeoutError}
   */
  list(queryParams?: SimpleSchemaTypes.UploadSmartTagInstancesHrefSchema) {
    return this.rawList(queryParams).then((body) =>
      Utils.deserializeResponseBody<SimpleSchemaTypes.UploadSmartTagInstancesTargetSchema>(
        body,
      ),
    );
  }

  /**
   * List all automatically created upload tags
   *
   * Read more: https://www.datocms.com/docs/content-management-api/resources/upload-smart_tag/instances
   *
   * @throws {ApiError}
   * @throws {TimeoutError}
   */
  rawList(
    queryParams?: SchemaTypes.UploadSmartTagInstancesHrefSchema,
  ): Promise<SchemaTypes.UploadSmartTagInstancesTargetSchema> {
    return this.client.request<SchemaTypes.UploadSmartTagInstancesTargetSchema>(
      {
        method: 'GET',
        url: '/upload-smart-tags',
        queryParams,
      },
    );
  }

  /**
   * Async iterator to auto-paginate over elements returned by list()
   *
   * Read more: https://www.datocms.com/docs/content-management-api/resources/upload-smart_tag/instances
   *
   * @throws {ApiError}
   * @throws {TimeoutError}
   */
  async *listPagedIterator(
    queryParams?: Utils.OmitFromKnownKeys<
      SimpleSchemaTypes.UploadSmartTagInstancesHrefSchema,
      'page'
    >,
    iteratorOptions?: Utils.IteratorOptions,
  ) {
    for await (const element of this.rawListPagedIterator(
      queryParams,
      iteratorOptions,
    )) {
      yield Utils.deserializeJsonEntity<
        SimpleSchemaTypes.UploadSmartTagInstancesTargetSchema[0]
      >(element);
    }
  }

  /**
   * Async iterator to auto-paginate over elements returned by rawList()
   *
   * Read more: https://www.datocms.com/docs/content-management-api/resources/upload-smart_tag/instances
   *
   * @throws {ApiError}
   * @throws {TimeoutError}
   */
  rawListPagedIterator(
    queryParams?: Utils.OmitFromKnownKeys<
      SchemaTypes.UploadSmartTagInstancesHrefSchema,
      'page'
    >,
    iteratorOptions?: Utils.IteratorOptions,
  ) {
    Utils.warnOnPageQueryParam(queryParams);

    return Utils.rawPageIterator<
      SchemaTypes.UploadSmartTagInstancesTargetSchema['data'][0]
    >(
      {
        defaultLimit: 50,
        maxLimit: 500,
      },
      (page: SchemaTypes.UploadSmartTagInstancesHrefSchema['page']) =>
        this.rawList({ ...queryParams, page }),
      iteratorOptions,
    );
  }
}
