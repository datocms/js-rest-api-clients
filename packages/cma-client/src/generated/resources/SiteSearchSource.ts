import * as Utils from '@datocms/rest-client-utils';
import BaseResource from '../../BaseResource';
import type * as ApiTypes from '../ApiTypes';
import type * as RawApiTypes from '../RawApiTypes';

export default class SiteSearchSource extends BaseResource {
  static readonly TYPE = 'site_search_source' as const;

  /**
   * List all site search sources for a site
   *
   * Read more: https://www.datocms.com/docs/content-management-api/resources/site-search_source/instances
   *
   * @throws {ApiError}
   * @throws {TimeoutError}
   */
  list() {
    return this.rawList().then((body) =>
      Utils.deserializeResponseBody<ApiTypes.SiteSearchSourceInstancesTargetSchema>(
        body,
      ),
    );
  }

  /**
   * List all site search sources for a site
   *
   * Read more: https://www.datocms.com/docs/content-management-api/resources/site-search_source/instances
   *
   * @throws {ApiError}
   * @throws {TimeoutError}
   */
  rawList(): Promise<RawApiTypes.SiteSearchSourceInstancesTargetSchema> {
    return this.client.request<RawApiTypes.SiteSearchSourceInstancesTargetSchema>(
      {
        method: 'GET',
        url: '/site-search-sources',
      },
    );
  }

  /**
   * Retrieve a site search source
   *
   * Read more: https://www.datocms.com/docs/content-management-api/resources/site-search_source/self
   *
   * @throws {ApiError}
   * @throws {TimeoutError}
   */
  find(siteSearchSourceId: string | ApiTypes.SiteSearchSourceData) {
    return this.rawFind(Utils.toId(siteSearchSourceId)).then((body) =>
      Utils.deserializeResponseBody<ApiTypes.SiteSearchSourceSelfTargetSchema>(
        body,
      ),
    );
  }

  /**
   * Retrieve a site search source
   *
   * Read more: https://www.datocms.com/docs/content-management-api/resources/site-search_source/self
   *
   * @throws {ApiError}
   * @throws {TimeoutError}
   */
  rawFind(
    siteSearchSourceId: string,
  ): Promise<RawApiTypes.SiteSearchSourceSelfTargetSchema> {
    return this.client.request<RawApiTypes.SiteSearchSourceSelfTargetSchema>({
      method: 'GET',
      url: `/site-search-sources/${siteSearchSourceId}`,
    });
  }

  /**
   * Create site search source
   *
   * Read more: https://www.datocms.com/docs/content-management-api/resources/site-search_source/create
   *
   * @throws {ApiError}
   * @throws {TimeoutError}
   */
  create(body: ApiTypes.SiteSearchSourceCreateSchema) {
    return this.rawCreate(
      Utils.serializeRequestBody<RawApiTypes.SiteSearchSourceCreateSchema>(
        body,
        {
          type: 'site_search_source',
          attributes: [
            'name',
            'enabled',
            'build_trigger_indexing_enabled',
            'frontend_url',
            'user_agent_suffix',
          ],
          relationships: ['build_triggers'],
        },
      ),
    ).then((body) =>
      Utils.deserializeResponseBody<ApiTypes.SiteSearchSourceCreateTargetSchema>(
        body,
      ),
    );
  }

  /**
   * Create site search source
   *
   * Read more: https://www.datocms.com/docs/content-management-api/resources/site-search_source/create
   *
   * @throws {ApiError}
   * @throws {TimeoutError}
   */
  rawCreate(
    body: RawApiTypes.SiteSearchSourceCreateSchema,
  ): Promise<RawApiTypes.SiteSearchSourceCreateTargetSchema> {
    return this.client.request<RawApiTypes.SiteSearchSourceCreateTargetSchema>({
      method: 'POST',
      url: '/site-search-sources',
      body,
    });
  }

  /**
   * Update site search source
   *
   * Read more: https://www.datocms.com/docs/content-management-api/resources/site-search_source/update
   *
   * @throws {ApiError}
   * @throws {TimeoutError}
   */
  update(
    siteSearchSourceId: string | ApiTypes.SiteSearchSourceData,
    body: ApiTypes.SiteSearchSourceUpdateSchema,
  ) {
    return this.rawUpdate(
      Utils.toId(siteSearchSourceId),
      Utils.serializeRequestBody<RawApiTypes.SiteSearchSourceUpdateSchema>(
        body,
        {
          id: Utils.toId(siteSearchSourceId),
          type: 'site_search_source',
          attributes: [
            'name',
            'enabled',
            'build_trigger_indexing_enabled',
            'frontend_url',
            'user_agent_suffix',
          ],
          relationships: ['build_triggers'],
        },
      ),
    ).then((body) =>
      Utils.deserializeResponseBody<ApiTypes.SiteSearchSourceUpdateTargetSchema>(
        body,
      ),
    );
  }

  /**
   * Update site search source
   *
   * Read more: https://www.datocms.com/docs/content-management-api/resources/site-search_source/update
   *
   * @throws {ApiError}
   * @throws {TimeoutError}
   */
  rawUpdate(
    siteSearchSourceId: string,
    body: RawApiTypes.SiteSearchSourceUpdateSchema,
  ): Promise<RawApiTypes.SiteSearchSourceUpdateTargetSchema> {
    return this.client.request<RawApiTypes.SiteSearchSourceUpdateTargetSchema>({
      method: 'PUT',
      url: `/site-search-sources/${siteSearchSourceId}`,
      body,
    });
  }

  /**
   * Trigger a site search indexing
   *
   * Read more: https://www.datocms.com/docs/content-management-api/resources/site-search_source/trigger
   *
   * @throws {ApiError}
   * @throws {TimeoutError}
   */
  trigger(siteSearchSourceId: string | ApiTypes.SiteSearchSourceData) {
    return this.rawTrigger(Utils.toId(siteSearchSourceId));
  }

  /**
   * Trigger a site search indexing
   *
   * Read more: https://www.datocms.com/docs/content-management-api/resources/site-search_source/trigger
   *
   * @throws {ApiError}
   * @throws {TimeoutError}
   */
  rawTrigger(siteSearchSourceId: string): Promise<void> {
    return this.client.request<void>({
      method: 'POST',
      url: `/site-search-sources/${siteSearchSourceId}/trigger`,
    });
  }

  /**
   * Abort a site search spidering and mark it as failed
   *
   * Read more: https://www.datocms.com/docs/content-management-api/resources/site-search_source/abort
   *
   * @throws {ApiError}
   * @throws {TimeoutError}
   */
  abort(siteSearchSourceId: string | ApiTypes.SiteSearchSourceData) {
    return this.rawAbort(Utils.toId(siteSearchSourceId));
  }

  /**
   * Abort a site search spidering and mark it as failed
   *
   * Read more: https://www.datocms.com/docs/content-management-api/resources/site-search_source/abort
   *
   * @throws {ApiError}
   * @throws {TimeoutError}
   */
  rawAbort(siteSearchSourceId: string): Promise<void> {
    return this.client.request<void>({
      method: 'DELETE',
      url: `/site-search-sources/${siteSearchSourceId}/abort`,
    });
  }

  /**
   * Delete a site search source
   *
   * Read more: https://www.datocms.com/docs/content-management-api/resources/site-search_source/destroy
   *
   * @throws {ApiError}
   * @throws {TimeoutError}
   */
  destroy(siteSearchSourceId: string | ApiTypes.SiteSearchSourceData) {
    return this.rawDestroy(Utils.toId(siteSearchSourceId)).then((body) =>
      Utils.deserializeResponseBody<ApiTypes.SiteSearchSourceDestroyTargetSchema>(
        body,
      ),
    );
  }

  /**
   * Delete a site search source
   *
   * Read more: https://www.datocms.com/docs/content-management-api/resources/site-search_source/destroy
   *
   * @throws {ApiError}
   * @throws {TimeoutError}
   */
  rawDestroy(
    siteSearchSourceId: string,
  ): Promise<RawApiTypes.SiteSearchSourceDestroyTargetSchema> {
    return this.client.request<RawApiTypes.SiteSearchSourceDestroyTargetSchema>(
      {
        method: 'DELETE',
        url: `/site-search-sources/${siteSearchSourceId}`,
      },
    );
  }
}
