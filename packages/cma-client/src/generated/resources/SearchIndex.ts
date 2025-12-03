import * as Utils from '@datocms/rest-client-utils';
import BaseResource from '../../BaseResource';
import type * as ApiTypes from '../ApiTypes';
import type * as RawApiTypes from '../RawApiTypes';

export default class SearchIndex extends BaseResource {
  static readonly TYPE = 'search_index' as const;

  /**
   * List all search indexes for a site
   *
   * Read more: https://www.datocms.com/docs/content-management-api/resources/search-index/instances
   *
   * @throws {ApiError}
   * @throws {TimeoutError}
   */
  list() {
    return this.rawList().then((body) =>
      Utils.deserializeResponseBody<ApiTypes.SearchIndexInstancesTargetSchema>(
        body,
      ),
    );
  }

  /**
   * List all search indexes for a site
   *
   * Read more: https://www.datocms.com/docs/content-management-api/resources/search-index/instances
   *
   * @throws {ApiError}
   * @throws {TimeoutError}
   */
  rawList(): Promise<RawApiTypes.SearchIndexInstancesTargetSchema> {
    return this.client.request<RawApiTypes.SearchIndexInstancesTargetSchema>({
      method: 'GET',
      url: '/search-indexes',
    });
  }

  /**
   * Retrieve a search index
   *
   * Read more: https://www.datocms.com/docs/content-management-api/resources/search-index/self
   *
   * @throws {ApiError}
   * @throws {TimeoutError}
   */
  find(searchIndexId: string | ApiTypes.SearchIndexData) {
    return this.rawFind(Utils.toId(searchIndexId)).then((body) =>
      Utils.deserializeResponseBody<ApiTypes.SearchIndexSelfTargetSchema>(body),
    );
  }

  /**
   * Retrieve a search index
   *
   * Read more: https://www.datocms.com/docs/content-management-api/resources/search-index/self
   *
   * @throws {ApiError}
   * @throws {TimeoutError}
   */
  rawFind(
    searchIndexId: string,
  ): Promise<RawApiTypes.SearchIndexSelfTargetSchema> {
    return this.client.request<RawApiTypes.SearchIndexSelfTargetSchema>({
      method: 'GET',
      url: `/search-indexes/${searchIndexId}`,
    });
  }

  /**
   * Create a search index
   *
   * Read more: https://www.datocms.com/docs/content-management-api/resources/search-index/create
   *
   * @throws {ApiError}
   * @throws {TimeoutError}
   */
  create(body: ApiTypes.SearchIndexCreateSchema) {
    return this.rawCreate(
      Utils.serializeRequestBody<RawApiTypes.SearchIndexCreateSchema>(body, {
        type: 'search_index',
        attributes: ['name', 'enabled', 'frontend_url', 'user_agent_suffix'],
        relationships: ['build_triggers'],
      }),
    ).then((body) =>
      Utils.deserializeResponseBody<ApiTypes.SearchIndexCreateTargetSchema>(
        body,
      ),
    );
  }

  /**
   * Create a search index
   *
   * Read more: https://www.datocms.com/docs/content-management-api/resources/search-index/create
   *
   * @throws {ApiError}
   * @throws {TimeoutError}
   */
  rawCreate(
    body: RawApiTypes.SearchIndexCreateSchema,
  ): Promise<RawApiTypes.SearchIndexCreateTargetSchema> {
    return this.client.request<RawApiTypes.SearchIndexCreateTargetSchema>({
      method: 'POST',
      url: '/search-indexes',
      body,
    });
  }

  /**
   * Update a search index
   *
   * Read more: https://www.datocms.com/docs/content-management-api/resources/search-index/update
   *
   * @throws {ApiError}
   * @throws {TimeoutError}
   */
  update(
    searchIndexId: string | ApiTypes.SearchIndexData,
    body: ApiTypes.SearchIndexUpdateSchema,
  ) {
    return this.rawUpdate(
      Utils.toId(searchIndexId),
      Utils.serializeRequestBody<RawApiTypes.SearchIndexUpdateSchema>(body, {
        id: Utils.toId(searchIndexId),
        type: 'search_index',
        attributes: ['name', 'enabled', 'frontend_url', 'user_agent_suffix'],
        relationships: ['build_triggers'],
      }),
    ).then((body) =>
      Utils.deserializeResponseBody<ApiTypes.SearchIndexUpdateTargetSchema>(
        body,
      ),
    );
  }

  /**
   * Update a search index
   *
   * Read more: https://www.datocms.com/docs/content-management-api/resources/search-index/update
   *
   * @throws {ApiError}
   * @throws {TimeoutError}
   */
  rawUpdate(
    searchIndexId: string,
    body: RawApiTypes.SearchIndexUpdateSchema,
  ): Promise<RawApiTypes.SearchIndexUpdateTargetSchema> {
    return this.client.request<RawApiTypes.SearchIndexUpdateTargetSchema>({
      method: 'PUT',
      url: `/search-indexes/${searchIndexId}`,
      body,
    });
  }

  /**
   * Trigger the indexing process
   *
   * Read more: https://www.datocms.com/docs/content-management-api/resources/search-index/trigger
   *
   * @throws {ApiError}
   * @throws {TimeoutError}
   */
  trigger(searchIndexId: string | ApiTypes.SearchIndexData) {
    return this.rawTrigger(Utils.toId(searchIndexId));
  }

  /**
   * Trigger the indexing process
   *
   * Read more: https://www.datocms.com/docs/content-management-api/resources/search-index/trigger
   *
   * @throws {ApiError}
   * @throws {TimeoutError}
   */
  rawTrigger(searchIndexId: string): Promise<void> {
    return this.client.request<void>({
      method: 'POST',
      url: `/search-indexes/${searchIndexId}/trigger`,
    });
  }

  /**
   * Abort a the current indexing process and mark it as failed
   *
   * Read more: https://www.datocms.com/docs/content-management-api/resources/search-index/abort
   *
   * @throws {ApiError}
   * @throws {TimeoutError}
   */
  abort(searchIndexId: string | ApiTypes.SearchIndexData) {
    return this.rawAbort(Utils.toId(searchIndexId));
  }

  /**
   * Abort a the current indexing process and mark it as failed
   *
   * Read more: https://www.datocms.com/docs/content-management-api/resources/search-index/abort
   *
   * @throws {ApiError}
   * @throws {TimeoutError}
   */
  rawAbort(searchIndexId: string): Promise<void> {
    return this.client.request<void>({
      method: 'DELETE',
      url: `/search-indexes/${searchIndexId}/abort`,
    });
  }

  /**
   * Delete a search index
   *
   * Read more: https://www.datocms.com/docs/content-management-api/resources/search-index/destroy
   *
   * @throws {ApiError}
   * @throws {TimeoutError}
   */
  destroy(searchIndexId: string | ApiTypes.SearchIndexData) {
    return this.rawDestroy(Utils.toId(searchIndexId)).then((body) =>
      Utils.deserializeResponseBody<ApiTypes.SearchIndexDestroyTargetSchema>(
        body,
      ),
    );
  }

  /**
   * Delete a search index
   *
   * Read more: https://www.datocms.com/docs/content-management-api/resources/search-index/destroy
   *
   * @throws {ApiError}
   * @throws {TimeoutError}
   */
  rawDestroy(
    searchIndexId: string,
  ): Promise<RawApiTypes.SearchIndexDestroyTargetSchema> {
    return this.client.request<RawApiTypes.SearchIndexDestroyTargetSchema>({
      method: 'DELETE',
      url: `/search-indexes/${searchIndexId}`,
    });
  }
}
