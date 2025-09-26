import * as Utils from '@datocms/rest-client-utils';
import BaseResource from '../../BaseResource';
import type * as ApiTypes from '../ApiTypes';
import type * as RawApiTypes from '../RawApiTypes';

export default class Site extends BaseResource {
  static readonly TYPE = 'site' as const;

  /**
   * Retrieve a project
   *
   * @throws {ApiError}
   * @throws {TimeoutError}
   */
  find(
    siteId: string | ApiTypes.SiteData,
    queryParams?: ApiTypes.SiteSelfHrefSchema,
  ) {
    return this.rawFind(Utils.toId(siteId), queryParams).then((body) =>
      Utils.deserializeResponseBody<ApiTypes.SiteSelfTargetSchema>(body),
    );
  }

  /**
   * Retrieve a project
   *
   * @throws {ApiError}
   * @throws {TimeoutError}
   */
  rawFind(
    siteId: string,
    queryParams?: RawApiTypes.SiteSelfHrefSchema,
  ): Promise<RawApiTypes.SiteSelfTargetSchema> {
    return this.client.request<RawApiTypes.SiteSelfTargetSchema>({
      method: 'GET',
      url: `/sites/${siteId}`,
      queryParams,
    });
  }

  /**
   * List all projects
   *
   * @throws {ApiError}
   * @throws {TimeoutError}
   */
  list(queryParams?: ApiTypes.SiteInstancesHrefSchema) {
    return this.rawList(queryParams).then((body) =>
      Utils.deserializeResponseBody<ApiTypes.SiteInstancesTargetSchema>(body),
    );
  }

  /**
   * List all projects
   *
   * @throws {ApiError}
   * @throws {TimeoutError}
   */
  rawList(
    queryParams?: RawApiTypes.SiteInstancesHrefSchema,
  ): Promise<RawApiTypes.SiteInstancesTargetSchema> {
    return this.client.request<RawApiTypes.SiteInstancesTargetSchema>({
      method: 'GET',
      url: '/sites',
      queryParams,
    });
  }

  /**
   * Async iterator to auto-paginate over elements returned by list()
   *
   * @throws {ApiError}
   * @throws {TimeoutError}
   */
  async *listPagedIterator(
    queryParams?: Utils.OmitFromKnownKeys<
      ApiTypes.SiteInstancesHrefSchema,
      'page'
    >,
    iteratorOptions?: Utils.IteratorOptions,
  ) {
    for await (const element of this.rawListPagedIterator(
      queryParams,
      iteratorOptions,
    )) {
      yield Utils.deserializeJsonEntity<ApiTypes.SiteInstancesTargetSchema[0]>(
        element,
      );
    }
  }

  /**
   * Async iterator to auto-paginate over elements returned by rawList()
   *
   * @throws {ApiError}
   * @throws {TimeoutError}
   */
  rawListPagedIterator(
    queryParams?: Utils.OmitFromKnownKeys<
      RawApiTypes.SiteInstancesHrefSchema,
      'page'
    >,
    iteratorOptions?: Utils.IteratorOptions,
  ) {
    Utils.warnOnPageQueryParam(queryParams);

    return Utils.rawPageIterator<
      RawApiTypes.SiteInstancesTargetSchema['data'][0]
    >(
      {
        defaultLimit: 20,
        maxLimit: 50,
      },
      (page: RawApiTypes.SiteInstancesHrefSchema['page']) =>
        this.rawList({ ...queryParams, page }),
      iteratorOptions,
    );
  }

  /**
   * Create a new project
   *
   * @throws {ApiError}
   * @throws {TimeoutError}
   */
  create(
    body: ApiTypes.SiteCreateSchema,
    queryParams?: ApiTypes.SiteCreateHrefSchema,
  ) {
    return this.rawCreate(
      Utils.serializeRequestBody<RawApiTypes.SiteCreateSchema>(body, {
        type: 'site',
        attributes: [
          'name',
          'internal_subdomain',
          'main_locale',
          'theme_hue',
          'template',
        ],
        relationships: [],
      }),
      queryParams,
    ).then((body) =>
      Utils.deserializeResponseBody<ApiTypes.SiteCreateJobSchema>(body),
    );
  }

  /**
   * Create a new project
   *
   * @throws {ApiError}
   * @throws {TimeoutError}
   */
  rawCreate(
    body: RawApiTypes.SiteCreateSchema,
    queryParams?: RawApiTypes.SiteCreateHrefSchema,
  ): Promise<RawApiTypes.SiteCreateJobSchema> {
    return this.client.request<RawApiTypes.SiteCreateJobSchema>({
      method: 'POST',
      url: '/sites',
      body,
      queryParams,
    });
  }

  /**
   * Update project
   *
   * @throws {ApiError}
   * @throws {TimeoutError}
   */
  update(siteId: string | ApiTypes.SiteData, body: ApiTypes.SiteUpdateSchema) {
    return this.rawUpdate(
      Utils.toId(siteId),
      Utils.serializeRequestBody<RawApiTypes.SiteUpdateSchema>(body, {
        id: Utils.toId(siteId),
        type: 'site',
        attributes: [
          'name',
          'domain',
          'internal_subdomain',
          'is_public_template',
        ],
        relationships: [],
      }),
    ).then((body) =>
      Utils.deserializeResponseBody<ApiTypes.SiteUpdateTargetSchema>(body),
    );
  }

  /**
   * Update project
   *
   * @throws {ApiError}
   * @throws {TimeoutError}
   */
  rawUpdate(
    siteId: string,
    body: RawApiTypes.SiteUpdateSchema,
  ): Promise<RawApiTypes.SiteUpdateTargetSchema> {
    return this.client.request<RawApiTypes.SiteUpdateTargetSchema>({
      method: 'PUT',
      url: `/sites/${siteId}`,
      body,
    });
  }

  /**
   * Delete a project
   *
   * @throws {ApiError}
   * @throws {TimeoutError}
   */
  destroy(siteId: string | ApiTypes.SiteData) {
    return this.rawDestroy(Utils.toId(siteId)).then((body) =>
      Utils.deserializeResponseBody<ApiTypes.SiteDestroyJobSchema>(body),
    );
  }

  /**
   * Delete a project
   *
   * @throws {ApiError}
   * @throws {TimeoutError}
   */
  rawDestroy(siteId: string): Promise<RawApiTypes.SiteDestroyJobSchema> {
    return this.client.request<RawApiTypes.SiteDestroyJobSchema>({
      method: 'DELETE',
      url: `/sites/${siteId}`,
    });
  }

  /**
   * Duplicate an existing project
   *
   * @throws {ApiError}
   * @throws {TimeoutError}
   */
  rawDuplicate(
    siteId: string,
    body: RawApiTypes.SiteDuplicateSchema,
    queryParams?: RawApiTypes.SiteDuplicateHrefSchema,
  ): Promise<RawApiTypes.SiteDuplicateJobSchema> {
    return this.client.request<RawApiTypes.SiteDuplicateJobSchema>({
      method: 'POST',
      url: `/sites/${siteId}/duplicate`,
      body,
      queryParams,
    });
  }
}
