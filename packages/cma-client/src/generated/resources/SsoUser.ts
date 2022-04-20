import * as Utils from '@datocms/rest-client-utils';
import * as SchemaTypes from '../SchemaTypes';
import * as SimpleSchemaTypes from '../SimpleSchemaTypes';
import BaseResource from '../../BaseResource';

export default class SsoUser extends BaseResource {
  static readonly TYPE: 'sso_user' = 'sso_user';

  /**
   * List all users
   *
   * Read more: https://www.datocms.com/docs/content-management-api/resources/sso-user/instances
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
   */
  rawList(): Promise<SchemaTypes.SsoUserInstancesTargetSchema> {
    return this.client.request<SchemaTypes.SsoUserInstancesTargetSchema>({
      method: 'GET',
      url: `/sso-users`,
    });
  }

  /**
   * Returns a SSO user
   *
   * Read more: https://www.datocms.com/docs/content-management-api/resources/sso-user/self
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
   */
  rawCopyUsers(): Promise<SchemaTypes.SsoUserCopyUsersTargetSchema> {
    return this.client.request<SchemaTypes.SsoUserCopyUsersTargetSchema>({
      method: 'POST',
      url: `/sso-users/copy-users`,
    });
  }

  /**
   * Delete a SSO user
   *
   * Read more: https://www.datocms.com/docs/content-management-api/resources/sso-user/destroy
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
