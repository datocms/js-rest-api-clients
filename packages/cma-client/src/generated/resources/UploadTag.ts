import * as Utils from '@datocms/rest-client-utils';
import BaseResource from '../../BaseResource';
import type * as ApiTypes from '../ApiTypes';
import type * as RawApiTypes from '../RawApiTypes';

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
  list(queryParams?: ApiTypes.UploadTagInstancesHrefSchema) {
    return this.rawList(queryParams).then((body) =>
      Utils.deserializeResponseBody<ApiTypes.UploadTagInstancesTargetSchema>(
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
    queryParams?: RawApiTypes.UploadTagInstancesHrefSchema,
  ): Promise<RawApiTypes.UploadTagInstancesTargetSchema> {
    return this.client.request<RawApiTypes.UploadTagInstancesTargetSchema>({
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
      ApiTypes.UploadTagInstancesHrefSchema,
      'page'
    >,
    iteratorOptions?: Utils.IteratorOptions,
  ) {
    for await (const element of this.rawListPagedIterator(
      queryParams,
      iteratorOptions,
    )) {
      yield Utils.deserializeJsonEntity<
        ApiTypes.UploadTagInstancesTargetSchema[0]
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
      RawApiTypes.UploadTagInstancesHrefSchema,
      'page'
    >,
    iteratorOptions?: Utils.IteratorOptions,
  ) {
    Utils.warnOnPageQueryParam(queryParams);

    return Utils.rawPageIterator<
      RawApiTypes.UploadTagInstancesTargetSchema['data'][0]
    >(
      {
        defaultLimit: 50,
        maxLimit: 500,
      },
      (page: RawApiTypes.UploadTagInstancesHrefSchema['page']) =>
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
  create(body: ApiTypes.UploadTagCreateSchema) {
    return this.rawCreate(
      Utils.serializeRequestBody<RawApiTypes.UploadTagCreateSchema>(body, {
        type: 'upload_tag',
        attributes: ['name'],
        relationships: [],
      }),
    ).then((body) =>
      Utils.deserializeResponseBody<ApiTypes.UploadTagCreateTargetSchema>(body),
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
    body: RawApiTypes.UploadTagCreateSchema,
  ): Promise<RawApiTypes.UploadTagCreateTargetSchema> {
    return this.client.request<RawApiTypes.UploadTagCreateTargetSchema>({
      method: 'POST',
      url: '/upload-tags',
      body,
    });
  }
}
