import * as Utils from '@datocms/rest-client-utils';
import BaseResource from '../../BaseResource';
import type * as ApiTypes from '../ApiTypes';
import type * as RawApiTypes from '../RawApiTypes';

export default class BuildEvent extends BaseResource {
  static readonly TYPE = 'build_event' as const;

  /**
   * List all deploy events
   *
   * Read more: https://www.datocms.com/docs/content-management-api/resources/build-event/instances
   *
   * @throws {ApiError}
   * @throws {TimeoutError}
   */
  list(queryParams?: ApiTypes.BuildEventInstancesHrefSchema) {
    return this.rawList(queryParams).then((body) =>
      Utils.deserializeResponseBody<ApiTypes.BuildEventInstancesTargetSchema>(
        body,
      ),
    );
  }

  /**
   * List all deploy events
   *
   * Read more: https://www.datocms.com/docs/content-management-api/resources/build-event/instances
   *
   * @throws {ApiError}
   * @throws {TimeoutError}
   */
  rawList(
    queryParams?: RawApiTypes.BuildEventInstancesHrefSchema,
  ): Promise<RawApiTypes.BuildEventInstancesTargetSchema> {
    return this.client.request<RawApiTypes.BuildEventInstancesTargetSchema>({
      method: 'GET',
      url: '/build-events',
      queryParams,
    });
  }

  /**
   * Async iterator to auto-paginate over elements returned by list()
   *
   * Read more: https://www.datocms.com/docs/content-management-api/resources/build-event/instances
   *
   * @throws {ApiError}
   * @throws {TimeoutError}
   */
  async *listPagedIterator(
    queryParams?: Utils.OmitFromKnownKeys<
      ApiTypes.BuildEventInstancesHrefSchema,
      'page'
    >,
    iteratorOptions?: Utils.IteratorOptions,
  ) {
    for await (const element of this.rawListPagedIterator(
      queryParams,
      iteratorOptions,
    )) {
      yield Utils.deserializeJsonEntity<
        ApiTypes.BuildEventInstancesTargetSchema[0]
      >(element);
    }
  }

  /**
   * Async iterator to auto-paginate over elements returned by rawList()
   *
   * Read more: https://www.datocms.com/docs/content-management-api/resources/build-event/instances
   *
   * @throws {ApiError}
   * @throws {TimeoutError}
   */
  rawListPagedIterator(
    queryParams?: Utils.OmitFromKnownKeys<
      RawApiTypes.BuildEventInstancesHrefSchema,
      'page'
    >,
    iteratorOptions?: Utils.IteratorOptions,
  ) {
    Utils.warnOnPageQueryParam(queryParams);

    return Utils.rawPageIterator<
      RawApiTypes.BuildEventInstancesTargetSchema['data'][0]
    >(
      {
        defaultLimit: 30,
        maxLimit: 500,
      },
      (page: RawApiTypes.BuildEventInstancesHrefSchema['page']) =>
        this.rawList({ ...queryParams, page }),
      iteratorOptions,
    );
  }

  /**
   * Retrieve a deploy event
   *
   * Read more: https://www.datocms.com/docs/content-management-api/resources/build-event/self
   *
   * @throws {ApiError}
   * @throws {TimeoutError}
   */
  find(buildEventId: string | ApiTypes.BuildEventData) {
    return this.rawFind(Utils.toId(buildEventId)).then((body) =>
      Utils.deserializeResponseBody<ApiTypes.BuildEventSelfTargetSchema>(body),
    );
  }

  /**
   * Retrieve a deploy event
   *
   * Read more: https://www.datocms.com/docs/content-management-api/resources/build-event/self
   *
   * @throws {ApiError}
   * @throws {TimeoutError}
   */
  rawFind(
    buildEventId: string,
  ): Promise<RawApiTypes.BuildEventSelfTargetSchema> {
    return this.client.request<RawApiTypes.BuildEventSelfTargetSchema>({
      method: 'GET',
      url: `/build-events/${buildEventId}`,
    });
  }
}
