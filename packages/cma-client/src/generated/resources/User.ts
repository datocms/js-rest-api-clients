import * as Utils from '@datocms/rest-client-utils';
import BaseResource from '../../BaseResource';
import type * as ApiTypes from '../ApiTypes';
import type * as RawApiTypes from '../RawApiTypes';

export default class User extends BaseResource {
  static readonly TYPE = 'user' as const;

  /**
   * Update a collaborator
   *
   * Read more: https://www.datocms.com/docs/content-management-api/resources/user/update
   *
   * @throws {ApiError}
   * @throws {TimeoutError}
   */
  update(userId: string | ApiTypes.UserData, body: ApiTypes.UserUpdateSchema) {
    return this.rawUpdate(
      Utils.toId(userId),
      Utils.serializeRequestBody<RawApiTypes.UserUpdateSchema>(body, {
        id: Utils.toId(userId),
        type: 'user',
        attributes: ['is_active'],
        relationships: ['role'],
      }),
    ).then((body) =>
      Utils.deserializeResponseBody<ApiTypes.UserUpdateTargetSchema>(body),
    );
  }

  /**
   * Update a collaborator
   *
   * Read more: https://www.datocms.com/docs/content-management-api/resources/user/update
   *
   * @throws {ApiError}
   * @throws {TimeoutError}
   */
  rawUpdate(
    userId: string,
    body: RawApiTypes.UserUpdateSchema,
  ): Promise<RawApiTypes.UserUpdateTargetSchema> {
    return this.client.request<RawApiTypes.UserUpdateTargetSchema>({
      method: 'PUT',
      url: `/users/${userId}`,
      body,
    });
  }

  /**
   * List all collaborators
   *
   * Read more: https://www.datocms.com/docs/content-management-api/resources/user/instances
   *
   * @throws {ApiError}
   * @throws {TimeoutError}
   */
  list() {
    return this.rawList().then((body) =>
      Utils.deserializeResponseBody<ApiTypes.UserInstancesTargetSchema>(body),
    );
  }

  /**
   * List all collaborators
   *
   * Read more: https://www.datocms.com/docs/content-management-api/resources/user/instances
   *
   * @throws {ApiError}
   * @throws {TimeoutError}
   */
  rawList(): Promise<RawApiTypes.UserInstancesTargetSchema> {
    return this.client.request<RawApiTypes.UserInstancesTargetSchema>({
      method: 'GET',
      url: '/users',
    });
  }

  /**
   * Retrieve a collaborator
   *
   * Read more: https://www.datocms.com/docs/content-management-api/resources/user/self
   *
   * @throws {ApiError}
   * @throws {TimeoutError}
   */
  find(
    userId: string | ApiTypes.UserData,
    queryParams?: ApiTypes.UserSelfHrefSchema,
  ) {
    return this.rawFind(Utils.toId(userId), queryParams).then((body) =>
      Utils.deserializeResponseBody<ApiTypes.UserSelfTargetSchema>(body),
    );
  }

  /**
   * Retrieve a collaborator
   *
   * Read more: https://www.datocms.com/docs/content-management-api/resources/user/self
   *
   * @throws {ApiError}
   * @throws {TimeoutError}
   */
  rawFind(
    userId: string,
    queryParams?: RawApiTypes.UserSelfHrefSchema,
  ): Promise<RawApiTypes.UserSelfTargetSchema> {
    return this.client.request<RawApiTypes.UserSelfTargetSchema>({
      method: 'GET',
      url: `/users/${userId}`,
      queryParams,
    });
  }

  /**
   * Retrieve current signed-in user
   *
   * Read more: https://www.datocms.com/docs/content-management-api/resources/user/me
   *
   * @throws {ApiError}
   * @throws {TimeoutError}
   */
  findMe(queryParams?: ApiTypes.UserMeHrefSchema) {
    return this.rawFindMe(queryParams).then((body) =>
      Utils.deserializeResponseBody<ApiTypes.UserMeTargetSchema>(body),
    );
  }

  /**
   * Retrieve current signed-in user
   *
   * Read more: https://www.datocms.com/docs/content-management-api/resources/user/me
   *
   * @throws {ApiError}
   * @throws {TimeoutError}
   */
  rawFindMe(
    queryParams?: RawApiTypes.UserMeHrefSchema,
  ): Promise<RawApiTypes.UserMeTargetSchema> {
    return this.client.request<RawApiTypes.UserMeTargetSchema>({
      method: 'GET',
      url: '/users/me',
      queryParams,
    });
  }

  /**
   * Delete a collaborator
   *
   * Read more: https://www.datocms.com/docs/content-management-api/resources/user/destroy
   *
   * @throws {ApiError}
   * @throws {TimeoutError}
   */
  destroy(
    userId: string | ApiTypes.UserData,
    queryParams?: ApiTypes.UserDestroyHrefSchema,
  ) {
    return this.rawDestroy(Utils.toId(userId), queryParams).then((body) =>
      Utils.deserializeResponseBody<ApiTypes.UserDestroyTargetSchema>(body),
    );
  }

  /**
   * Delete a collaborator
   *
   * Read more: https://www.datocms.com/docs/content-management-api/resources/user/destroy
   *
   * @throws {ApiError}
   * @throws {TimeoutError}
   */
  rawDestroy(
    userId: string,
    queryParams?: RawApiTypes.UserDestroyHrefSchema,
  ): Promise<RawApiTypes.UserDestroyTargetSchema> {
    return this.client.request<RawApiTypes.UserDestroyTargetSchema>({
      method: 'DELETE',
      url: `/users/${userId}`,
      queryParams,
    });
  }
}
