import * as Utils from '@datocms/rest-client-utils';
import BaseResource from '../../BaseResource';
import type * as ApiTypes from '../ApiTypes';
import type * as RawApiTypes from '../RawApiTypes';

export default class SsoUser extends BaseResource {
  static readonly TYPE = 'sso_user' as const;

  /**
   * List all users
   *
   * Read more: https://www.datocms.com/docs/content-management-api/resources/sso-user/instances
   *
   * @throws {ApiError}
   * @throws {TimeoutError}
   */
  list() {
    return this.rawList().then((body) =>
      Utils.deserializeResponseBody<ApiTypes.SsoUserInstancesTargetSchema>(
        body,
      ),
    );
  }

  /**
   * List all users
   *
   * Read more: https://www.datocms.com/docs/content-management-api/resources/sso-user/instances
   *
   * @throws {ApiError}
   * @throws {TimeoutError}
   */
  rawList(): Promise<RawApiTypes.SsoUserInstancesTargetSchema> {
    return this.client.request<RawApiTypes.SsoUserInstancesTargetSchema>({
      method: 'GET',
      url: '/sso-users',
    });
  }

  /**
   * Returns a SSO user
   *
   * Read more: https://www.datocms.com/docs/content-management-api/resources/sso-user/self
   *
   * @throws {ApiError}
   * @throws {TimeoutError}
   */
  find(userId: string | ApiTypes.UserData) {
    return this.rawFind(Utils.toId(userId)).then((body) =>
      Utils.deserializeResponseBody<ApiTypes.SsoUserSelfTargetSchema>(body),
    );
  }

  /**
   * Returns a SSO user
   *
   * Read more: https://www.datocms.com/docs/content-management-api/resources/sso-user/self
   *
   * @throws {ApiError}
   * @throws {TimeoutError}
   */
  rawFind(userId: string): Promise<RawApiTypes.SsoUserSelfTargetSchema> {
    return this.client.request<RawApiTypes.SsoUserSelfTargetSchema>({
      method: 'GET',
      url: `/sso-users/${userId}`,
    });
  }

  /**
   * Copy editors as SSO users
   *
   * Read more: https://www.datocms.com/docs/content-management-api/resources/sso-user/copy_users
   *
   * @throws {ApiError}
   * @throws {TimeoutError}
   */
  copyUsers() {
    return this.rawCopyUsers().then((body) =>
      Utils.deserializeResponseBody<ApiTypes.SsoUserCopyUsersTargetSchema>(
        body,
      ),
    );
  }

  /**
   * Copy editors as SSO users
   *
   * Read more: https://www.datocms.com/docs/content-management-api/resources/sso-user/copy_users
   *
   * @throws {ApiError}
   * @throws {TimeoutError}
   */
  rawCopyUsers(): Promise<RawApiTypes.SsoUserCopyUsersTargetSchema> {
    return this.client.request<RawApiTypes.SsoUserCopyUsersTargetSchema>({
      method: 'POST',
      url: '/sso-users/copy-users',
    });
  }

  /**
   * Delete a SSO user
   *
   * Read more: https://www.datocms.com/docs/content-management-api/resources/sso-user/destroy
   *
   * @throws {ApiError}
   * @throws {TimeoutError}
   */
  destroy(
    userId: string | ApiTypes.UserData,
    queryParams?: ApiTypes.SsoUserDestroyHrefSchema,
  ) {
    return this.rawDestroy(Utils.toId(userId), queryParams).then((body) =>
      Utils.deserializeResponseBody<ApiTypes.SsoUserDestroyTargetSchema>(body),
    );
  }

  /**
   * Delete a SSO user
   *
   * Read more: https://www.datocms.com/docs/content-management-api/resources/sso-user/destroy
   *
   * @throws {ApiError}
   * @throws {TimeoutError}
   */
  rawDestroy(
    userId: string,
    queryParams?: RawApiTypes.SsoUserDestroyHrefSchema,
  ): Promise<RawApiTypes.SsoUserDestroyTargetSchema> {
    return this.client.request<RawApiTypes.SsoUserDestroyTargetSchema>({
      method: 'DELETE',
      url: `/sso-users/${userId}`,
      queryParams,
    });
  }
}
