import * as Utils from '@datocms/rest-client-utils';
import BaseResource from '../../BaseResource';
import type * as SchemaTypes from '../SchemaTypes';
import type * as SimpleSchemaTypes from '../SimpleSchemaTypes';

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
      Utils.deserializeResponseBody<SimpleSchemaTypes.SsoUserInstancesTargetSchema>(
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
  rawList(): Promise<SchemaTypes.SsoUserInstancesTargetSchema> {
    return this.client.request<SchemaTypes.SsoUserInstancesTargetSchema>({
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
  find(userId: string | SimpleSchemaTypes.UserData) {
    return this.rawFind(Utils.toId(userId)).then((body) =>
      Utils.deserializeResponseBody<SimpleSchemaTypes.SsoUserSelfTargetSchema>(
        body,
      ),
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
  rawFind(userId: string): Promise<SchemaTypes.SsoUserSelfTargetSchema> {
    return this.client.request<SchemaTypes.SsoUserSelfTargetSchema>({
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
      Utils.deserializeResponseBody<SimpleSchemaTypes.SsoUserCopyUsersTargetSchema>(
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
  rawCopyUsers(): Promise<SchemaTypes.SsoUserCopyUsersTargetSchema> {
    return this.client.request<SchemaTypes.SsoUserCopyUsersTargetSchema>({
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
    userId: string | SimpleSchemaTypes.UserData,
    queryParams?: SimpleSchemaTypes.SsoUserDestroyHrefSchema,
  ) {
    return this.rawDestroy(Utils.toId(userId), queryParams).then((body) =>
      Utils.deserializeResponseBody<SimpleSchemaTypes.SsoUserDestroyTargetSchema>(
        body,
      ),
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
    queryParams?: SchemaTypes.SsoUserDestroyHrefSchema,
  ): Promise<SchemaTypes.SsoUserDestroyTargetSchema> {
    return this.client.request<SchemaTypes.SsoUserDestroyTargetSchema>({
      method: 'DELETE',
      url: `/sso-users/${userId}`,
      queryParams,
    });
  }
}
