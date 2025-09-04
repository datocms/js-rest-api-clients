import * as Utils from '@datocms/rest-client-utils';
import BaseResource from '../../BaseResource';
import type * as ApiTypes from '../ApiTypes';
import type * as RawApiTypes from '../RawApiTypes';

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
  list(queryParams?: ApiTypes.UploadSmartTagInstancesHrefSchema) {
    return this.rawList(queryParams).then((body) =>
      Utils.deserializeResponseBody<ApiTypes.UploadSmartTagInstancesTargetSchema>(
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
    queryParams?: RawApiTypes.UploadSmartTagInstancesHrefSchema,
  ): Promise<RawApiTypes.UploadSmartTagInstancesTargetSchema> {
    return this.client.request<RawApiTypes.UploadSmartTagInstancesTargetSchema>(
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
      ApiTypes.UploadSmartTagInstancesHrefSchema,
      'page'
    >,
    iteratorOptions?: Utils.IteratorOptions,
  ) {
    for await (const element of this.rawListPagedIterator(
      queryParams,
      iteratorOptions,
    )) {
      yield Utils.deserializeJsonEntity<
        ApiTypes.UploadSmartTagInstancesTargetSchema[0]
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
      RawApiTypes.UploadSmartTagInstancesHrefSchema,
      'page'
    >,
    iteratorOptions?: Utils.IteratorOptions,
  ) {
    Utils.warnOnPageQueryParam(queryParams);

    return Utils.rawPageIterator<
      RawApiTypes.UploadSmartTagInstancesTargetSchema['data'][0]
    >(
      {
        defaultLimit: 50,
        maxLimit: 500,
      },
      (page: RawApiTypes.UploadSmartTagInstancesHrefSchema['page']) =>
        this.rawList({ ...queryParams, page }),
      iteratorOptions,
    );
  }
}
