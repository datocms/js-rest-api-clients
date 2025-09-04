import * as Utils from '@datocms/rest-client-utils';
import BaseResource from '../../BaseResource';
import type * as ApiTypes from '../ApiTypes';
import type * as RawApiTypes from '../RawApiTypes';

export default class SearchResult extends BaseResource {
  static readonly TYPE = 'search_result' as const;

  /**
   * Search for results
   *
   * Read more: https://www.datocms.com/docs/content-management-api/resources/search-result/instances
   *
   * @throws {ApiError}
   * @throws {TimeoutError}
   */
  list(queryParams: ApiTypes.SearchResultInstancesHrefSchema) {
    return this.rawList(queryParams).then((body) =>
      Utils.deserializeResponseBody<ApiTypes.SearchResultInstancesTargetSchema>(
        body,
      ),
    );
  }

  /**
   * Search for results
   *
   * Read more: https://www.datocms.com/docs/content-management-api/resources/search-result/instances
   *
   * @throws {ApiError}
   * @throws {TimeoutError}
   */
  rawList(
    queryParams: RawApiTypes.SearchResultInstancesHrefSchema,
  ): Promise<RawApiTypes.SearchResultInstancesTargetSchema> {
    return this.client.request<RawApiTypes.SearchResultInstancesTargetSchema>({
      method: 'GET',
      url: '/search-results',
      queryParams,
    });
  }

  /**
   * Async iterator to auto-paginate over elements returned by list()
   *
   * Read more: https://www.datocms.com/docs/content-management-api/resources/search-result/instances
   *
   * @throws {ApiError}
   * @throws {TimeoutError}
   */
  async *listPagedIterator(
    queryParams: Utils.OmitFromKnownKeys<
      ApiTypes.SearchResultInstancesHrefSchema,
      'page'
    >,
    iteratorOptions?: Utils.IteratorOptions,
  ) {
    for await (const element of this.rawListPagedIterator(
      queryParams,
      iteratorOptions,
    )) {
      yield Utils.deserializeJsonEntity<
        ApiTypes.SearchResultInstancesTargetSchema[0]
      >(element);
    }
  }

  /**
   * Async iterator to auto-paginate over elements returned by rawList()
   *
   * Read more: https://www.datocms.com/docs/content-management-api/resources/search-result/instances
   *
   * @throws {ApiError}
   * @throws {TimeoutError}
   */
  rawListPagedIterator(
    queryParams: Utils.OmitFromKnownKeys<
      RawApiTypes.SearchResultInstancesHrefSchema,
      'page'
    >,
    iteratorOptions?: Utils.IteratorOptions,
  ) {
    Utils.warnOnPageQueryParam(queryParams);

    return Utils.rawPageIterator<
      RawApiTypes.SearchResultInstancesTargetSchema['data'][0]
    >(
      {
        defaultLimit: 20,
        maxLimit: 100,
      },
      (page: RawApiTypes.SearchResultInstancesHrefSchema['page']) =>
        this.rawList({ ...queryParams, page }),
      iteratorOptions,
    );
  }
}
