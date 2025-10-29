import * as Utils from '@datocms/rest-client-utils';
import BaseResource from '../../BaseResource';
import type * as ApiTypes from '../ApiTypes';
import type * as RawApiTypes from '../RawApiTypes';

export default class SiteSearchSourceEvent extends BaseResource {
  static readonly TYPE = 'site_search_source_event' as const;

  /**
   * List all site search indexing events
   *
   * Read more: https://www.datocms.com/docs/content-management-api/resources/site-search_source_event/instances
   *
   * @throws {ApiError}
   * @throws {TimeoutError}
   */
  list(queryParams?: ApiTypes.SiteSearchSourceEventInstancesHrefSchema) {
    return this.rawList(queryParams).then((body) =>
      Utils.deserializeResponseBody<ApiTypes.SiteSearchSourceEventInstancesTargetSchema>(
        body,
      ),
    );
  }

  /**
   * List all site search indexing events
   *
   * Read more: https://www.datocms.com/docs/content-management-api/resources/site-search_source_event/instances
   *
   * @throws {ApiError}
   * @throws {TimeoutError}
   */
  rawList(
    queryParams?: RawApiTypes.SiteSearchSourceEventInstancesHrefSchema,
  ): Promise<RawApiTypes.SiteSearchSourceEventInstancesTargetSchema> {
    return this.client.request<RawApiTypes.SiteSearchSourceEventInstancesTargetSchema>(
      {
        method: 'GET',
        url: '/site-search-source-events',
        queryParams,
      },
    );
  }

  /**
   * Async iterator to auto-paginate over elements returned by list()
   *
   * Read more: https://www.datocms.com/docs/content-management-api/resources/site-search_source_event/instances
   *
   * @throws {ApiError}
   * @throws {TimeoutError}
   */
  async *listPagedIterator(
    queryParams?: Utils.OmitFromKnownKeys<
      ApiTypes.SiteSearchSourceEventInstancesHrefSchema,
      'page'
    >,
    iteratorOptions?: Utils.IteratorOptions,
  ) {
    for await (const element of this.rawListPagedIterator(
      queryParams,
      iteratorOptions,
    )) {
      yield Utils.deserializeJsonEntity<
        ApiTypes.SiteSearchSourceEventInstancesTargetSchema[0]
      >(element);
    }
  }

  /**
   * Async iterator to auto-paginate over elements returned by rawList()
   *
   * Read more: https://www.datocms.com/docs/content-management-api/resources/site-search_source_event/instances
   *
   * @throws {ApiError}
   * @throws {TimeoutError}
   */
  rawListPagedIterator(
    queryParams?: Utils.OmitFromKnownKeys<
      RawApiTypes.SiteSearchSourceEventInstancesHrefSchema,
      'page'
    >,
    iteratorOptions?: Utils.IteratorOptions,
  ) {
    Utils.warnOnPageQueryParam(queryParams);

    return Utils.rawPageIterator<
      RawApiTypes.SiteSearchSourceEventInstancesTargetSchema['data'][0]
    >(
      {
        defaultLimit: 30,
        maxLimit: 500,
      },
      (page: RawApiTypes.SiteSearchSourceEventInstancesHrefSchema['page']) =>
        this.rawList({ ...queryParams, page }),
      iteratorOptions,
    );
  }

  /**
   * Retrieve a site search indexing event
   *
   * Read more: https://www.datocms.com/docs/content-management-api/resources/site-search_source_event/self
   *
   * @throws {ApiError}
   * @throws {TimeoutError}
   */
  find(siteSearchSourceEventId: string | ApiTypes.SiteSearchSourceEventData) {
    return this.rawFind(Utils.toId(siteSearchSourceEventId)).then((body) =>
      Utils.deserializeResponseBody<ApiTypes.SiteSearchSourceEventSelfTargetSchema>(
        body,
      ),
    );
  }

  /**
   * Retrieve a site search indexing event
   *
   * Read more: https://www.datocms.com/docs/content-management-api/resources/site-search_source_event/self
   *
   * @throws {ApiError}
   * @throws {TimeoutError}
   */
  rawFind(
    siteSearchSourceEventId: string,
  ): Promise<RawApiTypes.SiteSearchSourceEventSelfTargetSchema> {
    return this.client.request<RawApiTypes.SiteSearchSourceEventSelfTargetSchema>(
      {
        method: 'GET',
        url: `/site-search-source-events/${siteSearchSourceEventId}`,
      },
    );
  }
}
