import * as Utils from '@datocms/rest-client-utils';
import BaseResource from '../../BaseResource';
import type * as SchemaTypes from '../SchemaTypes';
import type * as SimpleSchemaTypes from '../SimpleSchemaTypes';

export default class SsoGroup extends BaseResource {
  static readonly TYPE = 'sso_group' as const;

  /**
   * List all SSO groups
   *
   * Read more: https://www.datocms.com/docs/content-management-api/resources/sso-group/instances
   *
   * @throws {ApiError}
   * @throws {TimeoutError}
   */
  list() {
    return this.rawList().then((body) =>
      Utils.deserializeResponseBody<SimpleSchemaTypes.SsoGroupInstancesTargetSchema>(
        body,
      ),
    );
  }

  /**
   * List all SSO groups
   *
   * Read more: https://www.datocms.com/docs/content-management-api/resources/sso-group/instances
   *
   * @throws {ApiError}
   * @throws {TimeoutError}
   */
  rawList(): Promise<SchemaTypes.SsoGroupInstancesTargetSchema> {
    return this.client.request<SchemaTypes.SsoGroupInstancesTargetSchema>({
      method: 'GET',
      url: '/sso-groups',
    });
  }

  /**
   * Sync SSO provider groups to DatoCMS roles
   *
   * Read more: https://www.datocms.com/docs/content-management-api/resources/sso-group/copy_roles
   *
   * @throws {ApiError}
   * @throws {TimeoutError}
   */
  copyRoles(ssoGroupId: string | SimpleSchemaTypes.SsoGroupData) {
    return this.rawCopyRoles(Utils.toId(ssoGroupId)).then((body) =>
      Utils.deserializeResponseBody<SimpleSchemaTypes.SsoGroupCopyRolesTargetSchema>(
        body,
      ),
    );
  }

  /**
   * Sync SSO provider groups to DatoCMS roles
   *
   * Read more: https://www.datocms.com/docs/content-management-api/resources/sso-group/copy_roles
   *
   * @throws {ApiError}
   * @throws {TimeoutError}
   */
  rawCopyRoles(
    ssoGroupId: string,
  ): Promise<SchemaTypes.SsoGroupCopyRolesTargetSchema> {
    return this.client.request<SchemaTypes.SsoGroupCopyRolesTargetSchema>({
      method: 'POST',
      url: `/sso-groups/${ssoGroupId}/copy-roles`,
    });
  }

  /**
   * Update a SSO group
   *
   * Read more: https://www.datocms.com/docs/content-management-api/resources/sso-group/update
   *
   * @throws {ApiError}
   * @throws {TimeoutError}
   */
  update(
    ssoGroupId: string | SimpleSchemaTypes.SsoGroupData,
    body: SimpleSchemaTypes.SsoGroupUpdateSchema,
  ) {
    return this.rawUpdate(
      Utils.toId(ssoGroupId),
      Utils.serializeRequestBody<SchemaTypes.SsoGroupUpdateSchema>(body, {
        id: Utils.toId(ssoGroupId),
        type: 'sso_group',
        attributes: ['priority'],
        relationships: ['role'],
      }),
    ).then((body) =>
      Utils.deserializeResponseBody<SimpleSchemaTypes.SsoGroupUpdateTargetSchema>(
        body,
      ),
    );
  }

  /**
   * Update a SSO group
   *
   * Read more: https://www.datocms.com/docs/content-management-api/resources/sso-group/update
   *
   * @throws {ApiError}
   * @throws {TimeoutError}
   */
  rawUpdate(
    ssoGroupId: string,
    body: SchemaTypes.SsoGroupUpdateSchema,
  ): Promise<SchemaTypes.SsoGroupUpdateTargetSchema> {
    return this.client.request<SchemaTypes.SsoGroupUpdateTargetSchema>({
      method: 'PUT',
      url: `/sso-groups/${ssoGroupId}`,
      body,
    });
  }

  /**
   * Delete a group
   *
   * Read more: https://www.datocms.com/docs/content-management-api/resources/sso-group/destroy
   *
   * @throws {ApiError}
   * @throws {TimeoutError}
   */
  destroy(ssoGroupId: string | SimpleSchemaTypes.SsoGroupData) {
    return this.rawDestroy(Utils.toId(ssoGroupId)).then((body) =>
      Utils.deserializeResponseBody<SimpleSchemaTypes.SsoGroupDestroyTargetSchema>(
        body,
      ),
    );
  }

  /**
   * Delete a group
   *
   * Read more: https://www.datocms.com/docs/content-management-api/resources/sso-group/destroy
   *
   * @throws {ApiError}
   * @throws {TimeoutError}
   */
  rawDestroy(
    ssoGroupId: string,
  ): Promise<SchemaTypes.SsoGroupDestroyTargetSchema> {
    return this.client.request<SchemaTypes.SsoGroupDestroyTargetSchema>({
      method: 'DELETE',
      url: `/sso-groups/${ssoGroupId}`,
    });
  }
}
