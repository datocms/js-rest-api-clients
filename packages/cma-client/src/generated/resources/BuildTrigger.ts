import * as Utils from '@datocms/rest-client-utils';
import BaseResource from '../../BaseResource';
import type * as SchemaTypes from '../SchemaTypes';
import type * as SimpleSchemaTypes from '../SimpleSchemaTypes';

export default class BuildTrigger extends BaseResource {
  static readonly TYPE = 'build_trigger' as const;

  /**
   * List all build triggers for a site
   *
   * Read more: https://www.datocms.com/docs/content-management-api/resources/build-trigger/instances
   *
   * @throws {ApiError}
   * @throws {TimeoutError}
   */
  list() {
    return this.rawList().then((body) =>
      Utils.deserializeResponseBody<SimpleSchemaTypes.BuildTriggerInstancesTargetSchema>(
        body,
      ),
    );
  }

  /**
   * List all build triggers for a site
   *
   * Read more: https://www.datocms.com/docs/content-management-api/resources/build-trigger/instances
   *
   * @throws {ApiError}
   * @throws {TimeoutError}
   */
  rawList(): Promise<SchemaTypes.BuildTriggerInstancesTargetSchema> {
    return this.client.request<SchemaTypes.BuildTriggerInstancesTargetSchema>({
      method: 'GET',
      url: '/build-triggers',
    });
  }

  /**
   * Retrieve a build trigger
   *
   * Read more: https://www.datocms.com/docs/content-management-api/resources/build-trigger/self
   *
   * @throws {ApiError}
   * @throws {TimeoutError}
   */
  find(buildTriggerId: string | SimpleSchemaTypes.BuildTriggerData) {
    return this.rawFind(Utils.toId(buildTriggerId)).then((body) =>
      Utils.deserializeResponseBody<SimpleSchemaTypes.BuildTriggerSelfTargetSchema>(
        body,
      ),
    );
  }

  /**
   * Retrieve a build trigger
   *
   * Read more: https://www.datocms.com/docs/content-management-api/resources/build-trigger/self
   *
   * @throws {ApiError}
   * @throws {TimeoutError}
   */
  rawFind(
    buildTriggerId: string,
  ): Promise<SchemaTypes.BuildTriggerSelfTargetSchema> {
    return this.client.request<SchemaTypes.BuildTriggerSelfTargetSchema>({
      method: 'GET',
      url: `/build-triggers/${buildTriggerId}`,
    });
  }

  /**
   * Create build trigger
   *
   * Read more: https://www.datocms.com/docs/content-management-api/resources/build-trigger/create
   *
   * @throws {ApiError}
   * @throws {TimeoutError}
   */
  create(body: SimpleSchemaTypes.BuildTriggerCreateSchema) {
    return this.rawCreate(
      Utils.serializeRequestBody<SchemaTypes.BuildTriggerCreateSchema>(body, {
        type: 'build_trigger',
        attributes: [
          'name',
          'webhook_token',
          'adapter',
          'indexing_enabled',
          'frontend_url',
          'autotrigger_on_scheduled_publications',
          'adapter_settings',
        ],
        relationships: [],
      }),
    ).then((body) =>
      Utils.deserializeResponseBody<SimpleSchemaTypes.BuildTriggerCreateTargetSchema>(
        body,
      ),
    );
  }

  /**
   * Create build trigger
   *
   * Read more: https://www.datocms.com/docs/content-management-api/resources/build-trigger/create
   *
   * @throws {ApiError}
   * @throws {TimeoutError}
   */
  rawCreate(
    body: SchemaTypes.BuildTriggerCreateSchema,
  ): Promise<SchemaTypes.BuildTriggerCreateTargetSchema> {
    return this.client.request<SchemaTypes.BuildTriggerCreateTargetSchema>({
      method: 'POST',
      url: '/build-triggers',
      body,
    });
  }

  /**
   * Update build trigger
   *
   * Read more: https://www.datocms.com/docs/content-management-api/resources/build-trigger/update
   *
   * @throws {ApiError}
   * @throws {TimeoutError}
   */
  update(
    buildTriggerId: string | SimpleSchemaTypes.BuildTriggerData,
    body: SimpleSchemaTypes.BuildTriggerUpdateSchema,
  ) {
    return this.rawUpdate(
      Utils.toId(buildTriggerId),
      Utils.serializeRequestBody<SchemaTypes.BuildTriggerUpdateSchema>(body, {
        id: Utils.toId(buildTriggerId),
        type: 'build_trigger',
        attributes: [
          'name',
          'adapter',
          'indexing_enabled',
          'frontend_url',
          'autotrigger_on_scheduled_publications',
          'adapter_settings',
        ],
        relationships: [],
      }),
    ).then((body) =>
      Utils.deserializeResponseBody<SimpleSchemaTypes.BuildTriggerUpdateTargetSchema>(
        body,
      ),
    );
  }

  /**
   * Update build trigger
   *
   * Read more: https://www.datocms.com/docs/content-management-api/resources/build-trigger/update
   *
   * @throws {ApiError}
   * @throws {TimeoutError}
   */
  rawUpdate(
    buildTriggerId: string,
    body: SchemaTypes.BuildTriggerUpdateSchema,
  ): Promise<SchemaTypes.BuildTriggerUpdateTargetSchema> {
    return this.client.request<SchemaTypes.BuildTriggerUpdateTargetSchema>({
      method: 'PUT',
      url: `/build-triggers/${buildTriggerId}`,
      body,
    });
  }

  /**
   * Trigger a deploy
   *
   * Read more: https://www.datocms.com/docs/content-management-api/resources/build-trigger/trigger
   *
   * @throws {ApiError}
   * @throws {TimeoutError}
   */
  trigger(buildTriggerId: string | SimpleSchemaTypes.BuildTriggerData) {
    return this.rawTrigger(Utils.toId(buildTriggerId));
  }

  /**
   * Trigger a deploy
   *
   * Read more: https://www.datocms.com/docs/content-management-api/resources/build-trigger/trigger
   *
   * @throws {ApiError}
   * @throws {TimeoutError}
   */
  rawTrigger(buildTriggerId: string): Promise<void> {
    return this.client.request<void>({
      method: 'POST',
      url: `/build-triggers/${buildTriggerId}/trigger`,
    });
  }

  /**
   * Abort a deploy and mark it as failed
   *
   * Read more: https://www.datocms.com/docs/content-management-api/resources/build-trigger/abort
   *
   * @throws {ApiError}
   * @throws {TimeoutError}
   */
  abort(buildTriggerId: string | SimpleSchemaTypes.BuildTriggerData) {
    return this.rawAbort(Utils.toId(buildTriggerId));
  }

  /**
   * Abort a deploy and mark it as failed
   *
   * Read more: https://www.datocms.com/docs/content-management-api/resources/build-trigger/abort
   *
   * @throws {ApiError}
   * @throws {TimeoutError}
   */
  rawAbort(buildTriggerId: string): Promise<void> {
    return this.client.request<void>({
      method: 'DELETE',
      url: `/build-triggers/${buildTriggerId}/abort`,
    });
  }

  /**
   * Abort a site search spidering and mark it as failed
   *
   * Read more: https://www.datocms.com/docs/content-management-api/resources/build-trigger/abort_indexing
   *
   * @throws {ApiError}
   * @throws {TimeoutError}
   */
  abortIndexing(buildTriggerId: string | SimpleSchemaTypes.BuildTriggerData) {
    return this.rawAbortIndexing(Utils.toId(buildTriggerId));
  }

  /**
   * Abort a site search spidering and mark it as failed
   *
   * Read more: https://www.datocms.com/docs/content-management-api/resources/build-trigger/abort_indexing
   *
   * @throws {ApiError}
   * @throws {TimeoutError}
   */
  rawAbortIndexing(buildTriggerId: string): Promise<void> {
    return this.client.request<void>({
      method: 'DELETE',
      url: `/build-triggers/${buildTriggerId}/abort_indexing`,
    });
  }

  /**
   * Trigger a new site search spidering of the website
   *
   * Read more: https://www.datocms.com/docs/content-management-api/resources/build-trigger/reindex
   *
   * @throws {ApiError}
   * @throws {TimeoutError}
   */
  reindex(buildTriggerId: string | SimpleSchemaTypes.BuildTriggerData) {
    return this.rawReindex(Utils.toId(buildTriggerId));
  }

  /**
   * Trigger a new site search spidering of the website
   *
   * Read more: https://www.datocms.com/docs/content-management-api/resources/build-trigger/reindex
   *
   * @throws {ApiError}
   * @throws {TimeoutError}
   */
  rawReindex(buildTriggerId: string): Promise<void> {
    return this.client.request<void>({
      method: 'PUT',
      url: `/build-triggers/${buildTriggerId}/reindex`,
    });
  }

  /**
   * Delete a build trigger
   *
   * Read more: https://www.datocms.com/docs/content-management-api/resources/build-trigger/destroy
   *
   * @throws {ApiError}
   * @throws {TimeoutError}
   */
  destroy(buildTriggerId: string | SimpleSchemaTypes.BuildTriggerData) {
    return this.rawDestroy(Utils.toId(buildTriggerId)).then((body) =>
      Utils.deserializeResponseBody<SimpleSchemaTypes.BuildTriggerDestroyTargetSchema>(
        body,
      ),
    );
  }

  /**
   * Delete a build trigger
   *
   * Read more: https://www.datocms.com/docs/content-management-api/resources/build-trigger/destroy
   *
   * @throws {ApiError}
   * @throws {TimeoutError}
   */
  rawDestroy(
    buildTriggerId: string,
  ): Promise<SchemaTypes.BuildTriggerDestroyTargetSchema> {
    return this.client.request<SchemaTypes.BuildTriggerDestroyTargetSchema>({
      method: 'DELETE',
      url: `/build-triggers/${buildTriggerId}`,
    });
  }
}
