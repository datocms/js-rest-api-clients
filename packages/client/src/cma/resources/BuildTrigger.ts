import BaseResource from '../BaseResource';
import serializeRequestBody from '../../serializeRequestBody';
import deserializeResponseBody from '../../deserializeResponseBody';
import toId from '../../toId';
import * as SchemaTypes from '../SchemaTypes';
import * as SimpleSchemaTypes from '../SimpleSchemaTypes';

export default class BuildTrigger extends BaseResource {
  static readonly TYPE: 'build_trigger' = 'build_trigger';

  /**
   * List all build triggers for a site
   *
   * Read more: https://www.datocms.com/docs/content-management-api/resources/build-trigger/instances
   */
  list() {
    return this.rawList().then((body) =>
      deserializeResponseBody<SimpleSchemaTypes.BuildTriggerInstancesTargetSchema>(
        body,
      ),
    );
  }

  /**
   * List all build triggers for a site
   *
   * Read more: https://www.datocms.com/docs/content-management-api/resources/build-trigger/instances
   */
  rawList(): Promise<SchemaTypes.BuildTriggerInstancesTargetSchema> {
    return this.client.request<SchemaTypes.BuildTriggerInstancesTargetSchema>({
      method: 'GET',
      url: `/build-triggers`,
    });
  }

  /**
   * Retrieve a build trigger
   *
   * Read more: https://www.datocms.com/docs/content-management-api/resources/build-trigger/self
   */
  find(buildTriggerId: string | SimpleSchemaTypes.BuildTriggerData) {
    return this.rawFind(toId(buildTriggerId)).then((body) =>
      deserializeResponseBody<SimpleSchemaTypes.BuildTriggerSelfTargetSchema>(
        body,
      ),
    );
  }

  /**
   * Retrieve a build trigger
   *
   * Read more: https://www.datocms.com/docs/content-management-api/resources/build-trigger/self
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
   */
  create(body: SimpleSchemaTypes.BuildTriggerCreateSchema) {
    return this.rawCreate(
      serializeRequestBody<SchemaTypes.BuildTriggerCreateSchema>({
        body,
        type: BuildTrigger.TYPE,
      }),
    ).then((body) =>
      deserializeResponseBody<SimpleSchemaTypes.BuildTriggerCreateTargetSchema>(
        body,
      ),
    );
  }

  /**
   * Create build trigger
   *
   * Read more: https://www.datocms.com/docs/content-management-api/resources/build-trigger/create
   */
  rawCreate(
    body: SchemaTypes.BuildTriggerCreateSchema,
  ): Promise<SchemaTypes.BuildTriggerCreateTargetSchema> {
    return this.client.request<SchemaTypes.BuildTriggerCreateTargetSchema>({
      method: 'POST',
      url: `/build-triggers`,
      body,
    });
  }

  /**
   * Update build trigger
   *
   * Read more: https://www.datocms.com/docs/content-management-api/resources/build-trigger/update
   */
  update(
    buildTriggerId: string | SimpleSchemaTypes.BuildTriggerData,
    body: SimpleSchemaTypes.BuildTriggerUpdateSchema,
  ) {
    return this.rawUpdate(
      toId(buildTriggerId),
      serializeRequestBody<SchemaTypes.BuildTriggerUpdateSchema>({
        body,
        id: toId(buildTriggerId),
        type: BuildTrigger.TYPE,
      }),
    ).then((body) =>
      deserializeResponseBody<SimpleSchemaTypes.BuildTriggerUpdateTargetSchema>(
        body,
      ),
    );
  }

  /**
   * Update build trigger
   *
   * Read more: https://www.datocms.com/docs/content-management-api/resources/build-trigger/update
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
   */
  trigger(buildTriggerId: string | SimpleSchemaTypes.BuildTriggerData) {
    return this.rawTrigger(toId(buildTriggerId));
  }

  /**
   * Trigger a deploy
   *
   * Read more: https://www.datocms.com/docs/content-management-api/resources/build-trigger/trigger
   */
  rawTrigger(buildTriggerId: string): Promise<void> {
    return this.client.request<void>({
      method: 'POST',
      url: `/build-triggers/${buildTriggerId}/trigger`,
    });
  }

  /**
   * Trigger a new Site Search spidering of the website
   *
   * Read more: https://www.datocms.com/docs/content-management-api/resources/build-trigger/reindex
   */
  reindex(buildTriggerId: string | SimpleSchemaTypes.BuildTriggerData) {
    return this.rawReindex(toId(buildTriggerId));
  }

  /**
   * Trigger a new Site Search spidering of the website
   *
   * Read more: https://www.datocms.com/docs/content-management-api/resources/build-trigger/reindex
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
   */
  destroy(buildTriggerId: string | SimpleSchemaTypes.BuildTriggerData) {
    return this.rawDestroy(toId(buildTriggerId)).then((body) =>
      deserializeResponseBody<SimpleSchemaTypes.BuildTriggerDestroyTargetSchema>(
        body,
      ),
    );
  }

  /**
   * Delete a build trigger
   *
   * Read more: https://www.datocms.com/docs/content-management-api/resources/build-trigger/destroy
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
