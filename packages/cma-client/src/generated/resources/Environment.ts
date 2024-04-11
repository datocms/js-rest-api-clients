import * as Utils from '@datocms/rest-client-utils';
import BaseResource from '../../BaseResource';
import type * as SchemaTypes from '../SchemaTypes';
import type * as SimpleSchemaTypes from '../SimpleSchemaTypes';

export default class Environment extends BaseResource {
  static readonly TYPE = 'environment' as const;

  /**
   * Fork an existing environment
   *
   * Read more: https://www.datocms.com/docs/content-management-api/resources/environment/fork
   *
   * @throws {ApiError}
   * @throws {TimeoutError}
   */
  fork(
    environmentId: string | SimpleSchemaTypes.EnvironmentData,
    body: SimpleSchemaTypes.EnvironmentForkSchema,
    queryParams?: SimpleSchemaTypes.EnvironmentForkHrefSchema,
  ) {
    return this.rawFork(
      Utils.toId(environmentId),
      Utils.serializeRequestBody<SchemaTypes.EnvironmentForkSchema>(body, {
        id: Utils.toId(environmentId),
        type: 'environment',
        attributes: [],
        relationships: [],
      }),
      queryParams,
    ).then((body) =>
      Utils.deserializeResponseBody<SimpleSchemaTypes.EnvironmentForkJobSchema>(
        body,
      ),
    );
  }

  /**
   * Fork an existing environment
   *
   * Read more: https://www.datocms.com/docs/content-management-api/resources/environment/fork
   *
   * @throws {ApiError}
   * @throws {TimeoutError}
   */
  rawFork(
    environmentId: string,
    body: SchemaTypes.EnvironmentForkSchema,
    queryParams?: SchemaTypes.EnvironmentForkHrefSchema,
  ): Promise<SchemaTypes.EnvironmentForkJobSchema> {
    return this.client.request<SchemaTypes.EnvironmentForkJobSchema>({
      method: 'POST',
      url: `/environments/${environmentId}/fork`,
      body,
      queryParams,
    });
  }

  /**
   * Promote an environment to primary
   *
   * Read more: https://www.datocms.com/docs/content-management-api/resources/environment/promote
   *
   * @throws {ApiError}
   * @throws {TimeoutError}
   */
  promote(environmentId: string | SimpleSchemaTypes.EnvironmentData) {
    return this.rawPromote(Utils.toId(environmentId)).then((body) =>
      Utils.deserializeResponseBody<SimpleSchemaTypes.EnvironmentPromoteTargetSchema>(
        body,
      ),
    );
  }

  /**
   * Promote an environment to primary
   *
   * Read more: https://www.datocms.com/docs/content-management-api/resources/environment/promote
   *
   * @throws {ApiError}
   * @throws {TimeoutError}
   */
  rawPromote(
    environmentId: string,
  ): Promise<SchemaTypes.EnvironmentPromoteTargetSchema> {
    return this.client.request<SchemaTypes.EnvironmentPromoteTargetSchema>({
      method: 'PUT',
      url: `/environments/${environmentId}/promote`,
    });
  }

  /**
   * Rename an environment
   *
   * Read more: https://www.datocms.com/docs/content-management-api/resources/environment/rename
   *
   * @throws {ApiError}
   * @throws {TimeoutError}
   */
  rename(
    environmentId: string | SimpleSchemaTypes.EnvironmentData,
    body: SimpleSchemaTypes.EnvironmentRenameSchema,
  ) {
    return this.rawRename(
      Utils.toId(environmentId),
      Utils.serializeRequestBody<SchemaTypes.EnvironmentRenameSchema>(body, {
        id: Utils.toId(environmentId),
        type: 'environment',
        attributes: [],
        relationships: [],
      }),
    ).then((body) =>
      Utils.deserializeResponseBody<SimpleSchemaTypes.EnvironmentRenameTargetSchema>(
        body,
      ),
    );
  }

  /**
   * Rename an environment
   *
   * Read more: https://www.datocms.com/docs/content-management-api/resources/environment/rename
   *
   * @throws {ApiError}
   * @throws {TimeoutError}
   */
  rawRename(
    environmentId: string,
    body: SchemaTypes.EnvironmentRenameSchema,
  ): Promise<SchemaTypes.EnvironmentRenameTargetSchema> {
    return this.client.request<SchemaTypes.EnvironmentRenameTargetSchema>({
      method: 'PUT',
      url: `/environments/${environmentId}/rename`,
      body,
    });
  }

  /**
   * List all environments
   *
   * Read more: https://www.datocms.com/docs/content-management-api/resources/environment/instances
   *
   * @throws {ApiError}
   * @throws {TimeoutError}
   */
  list() {
    return this.rawList().then((body) =>
      Utils.deserializeResponseBody<SimpleSchemaTypes.EnvironmentInstancesTargetSchema>(
        body,
      ),
    );
  }

  /**
   * List all environments
   *
   * Read more: https://www.datocms.com/docs/content-management-api/resources/environment/instances
   *
   * @throws {ApiError}
   * @throws {TimeoutError}
   */
  rawList(): Promise<SchemaTypes.EnvironmentInstancesTargetSchema> {
    return this.client.request<SchemaTypes.EnvironmentInstancesTargetSchema>({
      method: 'GET',
      url: '/environments',
    });
  }

  /**
   * Retrieve a environment
   *
   * Read more: https://www.datocms.com/docs/content-management-api/resources/environment/self
   *
   * @throws {ApiError}
   * @throws {TimeoutError}
   */
  find(environmentId: string | SimpleSchemaTypes.EnvironmentData) {
    return this.rawFind(Utils.toId(environmentId)).then((body) =>
      Utils.deserializeResponseBody<SimpleSchemaTypes.EnvironmentSelfTargetSchema>(
        body,
      ),
    );
  }

  /**
   * Retrieve a environment
   *
   * Read more: https://www.datocms.com/docs/content-management-api/resources/environment/self
   *
   * @throws {ApiError}
   * @throws {TimeoutError}
   */
  rawFind(
    environmentId: string,
  ): Promise<SchemaTypes.EnvironmentSelfTargetSchema> {
    return this.client.request<SchemaTypes.EnvironmentSelfTargetSchema>({
      method: 'GET',
      url: `/environments/${environmentId}`,
    });
  }

  /**
   * Delete a environment
   *
   * Read more: https://www.datocms.com/docs/content-management-api/resources/environment/destroy
   *
   * @throws {ApiError}
   * @throws {TimeoutError}
   */
  destroy(environmentId: string | SimpleSchemaTypes.EnvironmentData) {
    return this.rawDestroy(Utils.toId(environmentId)).then((body) =>
      Utils.deserializeResponseBody<SimpleSchemaTypes.EnvironmentDestroyJobSchema>(
        body,
      ),
    );
  }

  /**
   * Delete a environment
   *
   * Read more: https://www.datocms.com/docs/content-management-api/resources/environment/destroy
   *
   * @throws {ApiError}
   * @throws {TimeoutError}
   */
  rawDestroy(
    environmentId: string,
  ): Promise<SchemaTypes.EnvironmentDestroyJobSchema> {
    return this.client.request<SchemaTypes.EnvironmentDestroyJobSchema>({
      method: 'DELETE',
      url: `/environments/${environmentId}`,
    });
  }
}
