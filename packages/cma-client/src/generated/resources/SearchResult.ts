import * as Utils from '@datocms/rest-client-utils';
import BaseResource from '../../BaseResource';
import type * as SchemaTypes from '../SchemaTypes';
import type * as SimpleSchemaTypes from '../SimpleSchemaTypes';

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
  list(queryParams: SimpleSchemaTypes.SearchResultInstancesHrefSchema) {
    return this.rawList(queryParams).then((body) =>
      Utils.deserializeResponseBody<SimpleSchemaTypes.SearchResultInstancesTargetSchema>(
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
    queryParams: SchemaTypes.SearchResultInstancesHrefSchema,
  ): Promise<SchemaTypes.SearchResultInstancesTargetSchema> {
    return this.client.request<SchemaTypes.SearchResultInstancesTargetSchema>({
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
      SimpleSchemaTypes.SearchResultInstancesHrefSchema,
      'page'
    >,
    iteratorOptions?: Utils.IteratorOptions,
  ) {
    for await (const element of this.rawListPagedIterator(
      queryParams,
      iteratorOptions,
    )) {
      yield Utils.deserializeJsonEntity<
        SimpleSchemaTypes.SearchResultInstancesTargetSchema[0]
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
      SchemaTypes.SearchResultInstancesHrefSchema,
      'page'
    >,
    iteratorOptions?: Utils.IteratorOptions,
  ) {
    Utils.warnOnPageQueryParam(queryParams);

    return Utils.rawPageIterator<
      SchemaTypes.SearchResultInstancesTargetSchema['data'][0]
    >(
      {
        defaultLimit: 20,
        maxLimit: 100,
      },
      (page: SchemaTypes.SearchResultInstancesHrefSchema['page']) =>
        this.rawList({ ...queryParams, page }),
      iteratorOptions,
    );
  }
}
