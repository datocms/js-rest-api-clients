import * as Utils from '@datocms/rest-client-utils';
import BaseResource from '../../BaseResource';
import type * as ApiTypes from '../ApiTypes';
import type * as RawApiTypes from '../RawApiTypes';

export default class SearchIndexEvent extends BaseResource {
  static readonly TYPE = 'search_index_event' as const;

  /**
   * List all search indexing events
   *
   * Read more: https://www.datocms.com/docs/content-management-api/resources/search-index_event/instances
   *
   * @throws {ApiError}
   * @throws {TimeoutError}
   */
  list(queryParams?: ApiTypes.SearchIndexEventInstancesHrefSchema) {
    return this.rawList(queryParams).then((body) =>
      Utils.deserializeResponseBody<ApiTypes.SearchIndexEventInstancesTargetSchema>(
        body,
      ),
    );
  }

  /**
   * List all search indexing events
   *
   * Read more: https://www.datocms.com/docs/content-management-api/resources/search-index_event/instances
   *
   * @throws {ApiError}
   * @throws {TimeoutError}
   */
  rawList(
    queryParams?: RawApiTypes.SearchIndexEventInstancesHrefSchema,
  ): Promise<RawApiTypes.SearchIndexEventInstancesTargetSchema> {
    return this.client.request<RawApiTypes.SearchIndexEventInstancesTargetSchema>(
      {
        method: 'GET',
        url: '/search-index-events',
        queryParams,
      },
    );
  }

  /**
   * Async iterator to auto-paginate over elements returned by list()
   *
   * Read more: https://www.datocms.com/docs/content-management-api/resources/search-index_event/instances
   *
   * @throws {ApiError}
   * @throws {TimeoutError}
   */
  async *listPagedIterator(
    queryParams?: Utils.OmitFromKnownKeys<
      ApiTypes.SearchIndexEventInstancesHrefSchema,
      'page'
    >,
    iteratorOptions?: Utils.IteratorOptions,
  ) {
    for await (const element of this.rawListPagedIterator(
      queryParams,
      iteratorOptions,
    )) {
      yield Utils.deserializeJsonEntity<
        ApiTypes.SearchIndexEventInstancesTargetSchema[0]
      >(element);
    }
  }

  /**
   * Async iterator to auto-paginate over elements returned by rawList()
   *
   * Read more: https://www.datocms.com/docs/content-management-api/resources/search-index_event/instances
   *
   * @throws {ApiError}
   * @throws {TimeoutError}
   */
  rawListPagedIterator(
    queryParams?: Utils.OmitFromKnownKeys<
      RawApiTypes.SearchIndexEventInstancesHrefSchema,
      'page'
    >,
    iteratorOptions?: Utils.IteratorOptions,
  ) {
    Utils.warnOnPageQueryParam(queryParams);

    return Utils.rawPageIterator<
      RawApiTypes.SearchIndexEventInstancesTargetSchema['data'][0]
    >(
      {
        defaultLimit: 30,
        maxLimit: 500,
      },
      (page: RawApiTypes.SearchIndexEventInstancesHrefSchema['page']) =>
        this.rawList({ ...queryParams, page }),
      iteratorOptions,
    );
  }

  /**
   * Retrieve a search indexing event
   *
   * Read more: https://www.datocms.com/docs/content-management-api/resources/search-index_event/self
   *
   * @throws {ApiError}
   * @throws {TimeoutError}
   */
  find(searchIndexEventId: string | ApiTypes.SearchIndexEventData) {
    return this.rawFind(Utils.toId(searchIndexEventId)).then((body) =>
      Utils.deserializeResponseBody<ApiTypes.SearchIndexEventSelfTargetSchema>(
        body,
      ),
    );
  }

  /**
   * Retrieve a search indexing event
   *
   * Read more: https://www.datocms.com/docs/content-management-api/resources/search-index_event/self
   *
   * @throws {ApiError}
   * @throws {TimeoutError}
   */
  rawFind(
    searchIndexEventId: string,
  ): Promise<RawApiTypes.SearchIndexEventSelfTargetSchema> {
    return this.client.request<RawApiTypes.SearchIndexEventSelfTargetSchema>({
      method: 'GET',
      url: `/search-index-events/${searchIndexEventId}`,
    });
  }
}
