import * as Utils from '@datocms/rest-client-utils';
import BaseResource from '../../BaseResource';
import type * as SchemaTypes from '../SchemaTypes';
import type * as SimpleSchemaTypes from '../SimpleSchemaTypes';

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
  list(queryParams?: SimpleSchemaTypes.BuildEventInstancesHrefSchema) {
    return this.rawList(queryParams).then((body) =>
      Utils.deserializeResponseBody<SimpleSchemaTypes.BuildEventInstancesTargetSchema>(
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
    queryParams?: SchemaTypes.BuildEventInstancesHrefSchema,
  ): Promise<SchemaTypes.BuildEventInstancesTargetSchema> {
    return this.client.request<SchemaTypes.BuildEventInstancesTargetSchema>({
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
      SimpleSchemaTypes.BuildEventInstancesHrefSchema,
      'page'
    >,
    iteratorOptions?: Utils.IteratorOptions,
  ) {
    for await (const element of this.rawListPagedIterator(
      queryParams,
      iteratorOptions,
    )) {
      yield Utils.deserializeJsonEntity<
        SimpleSchemaTypes.BuildEventInstancesTargetSchema[0]
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
      SchemaTypes.BuildEventInstancesHrefSchema,
      'page'
    >,
    iteratorOptions?: Utils.IteratorOptions,
  ) {
    Utils.warnOnPageQueryParam(queryParams);

    return Utils.rawPageIterator<
      SchemaTypes.BuildEventInstancesTargetSchema['data'][0]
    >(
      {
        defaultLimit: 30,
        maxLimit: 500,
      },
      (page: SchemaTypes.BuildEventInstancesHrefSchema['page']) =>
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
  find(buildEventId: string | SimpleSchemaTypes.BuildEventData) {
    return this.rawFind(Utils.toId(buildEventId)).then((body) =>
      Utils.deserializeResponseBody<SimpleSchemaTypes.BuildEventSelfTargetSchema>(
        body,
      ),
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
  ): Promise<SchemaTypes.BuildEventSelfTargetSchema> {
    return this.client.request<SchemaTypes.BuildEventSelfTargetSchema>({
      method: 'GET',
      url: `/build-events/${buildEventId}`,
    });
  }
}
