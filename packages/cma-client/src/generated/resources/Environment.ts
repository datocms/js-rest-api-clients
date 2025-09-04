import * as Utils from '@datocms/rest-client-utils';
import BaseResource from '../../BaseResource';
import type * as ApiTypes from '../ApiTypes';
import type * as RawApiTypes from '../RawApiTypes';

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
    environmentId: string | ApiTypes.EnvironmentData,
    body: ApiTypes.EnvironmentForkSchema,
    queryParams?: ApiTypes.EnvironmentForkHrefSchema,
  ) {
    return this.rawFork(
      Utils.toId(environmentId),
      Utils.serializeRequestBody<RawApiTypes.EnvironmentForkSchema>(body, {
        id: Utils.toId(environmentId),
        type: 'environment',
        attributes: [],
        relationships: [],
      }),
      queryParams,
    ).then((body) =>
      Utils.deserializeResponseBody<ApiTypes.EnvironmentForkJobSchema>(body),
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
    body: RawApiTypes.EnvironmentForkSchema,
    queryParams?: RawApiTypes.EnvironmentForkHrefSchema,
  ): Promise<RawApiTypes.EnvironmentForkJobSchema> {
    return this.client.request<RawApiTypes.EnvironmentForkJobSchema>({
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
  promote(environmentId: string | ApiTypes.EnvironmentData) {
    return this.rawPromote(Utils.toId(environmentId)).then((body) =>
      Utils.deserializeResponseBody<ApiTypes.EnvironmentPromoteTargetSchema>(
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
  ): Promise<RawApiTypes.EnvironmentPromoteTargetSchema> {
    return this.client.request<RawApiTypes.EnvironmentPromoteTargetSchema>({
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
    environmentId: string | ApiTypes.EnvironmentData,
    body: ApiTypes.EnvironmentRenameSchema,
  ) {
    return this.rawRename(
      Utils.toId(environmentId),
      Utils.serializeRequestBody<RawApiTypes.EnvironmentRenameSchema>(body, {
        id: Utils.toId(environmentId),
        type: 'environment',
        attributes: [],
        relationships: [],
      }),
    ).then((body) =>
      Utils.deserializeResponseBody<ApiTypes.EnvironmentRenameTargetSchema>(
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
    body: RawApiTypes.EnvironmentRenameSchema,
  ): Promise<RawApiTypes.EnvironmentRenameTargetSchema> {
    return this.client.request<RawApiTypes.EnvironmentRenameTargetSchema>({
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
      Utils.deserializeResponseBody<ApiTypes.EnvironmentInstancesTargetSchema>(
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
  rawList(): Promise<RawApiTypes.EnvironmentInstancesTargetSchema> {
    return this.client.request<RawApiTypes.EnvironmentInstancesTargetSchema>({
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
  find(environmentId: string | ApiTypes.EnvironmentData) {
    return this.rawFind(Utils.toId(environmentId)).then((body) =>
      Utils.deserializeResponseBody<ApiTypes.EnvironmentSelfTargetSchema>(body),
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
  ): Promise<RawApiTypes.EnvironmentSelfTargetSchema> {
    return this.client.request<RawApiTypes.EnvironmentSelfTargetSchema>({
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
  destroy(environmentId: string | ApiTypes.EnvironmentData) {
    return this.rawDestroy(Utils.toId(environmentId)).then((body) =>
      Utils.deserializeResponseBody<ApiTypes.EnvironmentDestroyJobSchema>(body),
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
  ): Promise<RawApiTypes.EnvironmentDestroyJobSchema> {
    return this.client.request<RawApiTypes.EnvironmentDestroyJobSchema>({
      method: 'DELETE',
      url: `/environments/${environmentId}`,
    });
  }
}
