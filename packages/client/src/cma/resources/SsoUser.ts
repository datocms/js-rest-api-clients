import BaseResource from '../BaseResource';
import serializeRequestBody from '../../serializeRequestBody';
import deserializeResponseBody from '../../deserializeResponseBody';
import toId from '../../toId';
import * as SchemaTypes from '../SchemaTypes';
import * as SimpleSchemaTypes from '../SimpleSchemaTypes';

export default class SsoUser extends BaseResource {
  static readonly TYPE: 'sso_user' = 'sso_user';

  /**
   * List all users
   *
   * Read more: https://www.datocms.com/docs/content-management-api/resources/sso-user/instances
   */
  list() {
    return this.rawList().then((body) =>
      deserializeResponseBody<SimpleSchemaTypes.SsoUserInstancesTargetSchema>(
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
  find(userId: string | SimpleSchemaTypes.SsoUserData) {
    return this.rawFind(toId(userId)).then((body) =>
      deserializeResponseBody<SimpleSchemaTypes.SsoUserSelfTargetSchema>(body),
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
      deserializeResponseBody<SimpleSchemaTypes.SsoUserCopyUsersTargetSchema>(
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
    userId: string | SimpleSchemaTypes.SsoUserData,
    queryParams?: SimpleSchemaTypes.SsoUserDestroyHrefSchema,
  ) {
    return this.rawDestroy(toId(userId), queryParams).then((body) =>
      deserializeResponseBody<SimpleSchemaTypes.SsoUserDestroyTargetSchema>(
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
