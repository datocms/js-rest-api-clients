import * as Utils from '@datocms/rest-client-utils';
import BaseResource from '../../BaseResource';
import type * as ApiTypes from '../ApiTypes';
import type * as RawApiTypes from '../RawApiTypes';

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
      Utils.deserializeResponseBody<ApiTypes.SsoGroupInstancesTargetSchema>(
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
  rawList(): Promise<RawApiTypes.SsoGroupInstancesTargetSchema> {
    return this.client.request<RawApiTypes.SsoGroupInstancesTargetSchema>({
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
  copyRoles(ssoGroupId: string | ApiTypes.SsoGroupData) {
    return this.rawCopyRoles(Utils.toId(ssoGroupId)).then((body) =>
      Utils.deserializeResponseBody<ApiTypes.SsoGroupCopyRolesTargetSchema>(
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
  ): Promise<RawApiTypes.SsoGroupCopyRolesTargetSchema> {
    return this.client.request<RawApiTypes.SsoGroupCopyRolesTargetSchema>({
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
    ssoGroupId: string | ApiTypes.SsoGroupData,
    body: ApiTypes.SsoGroupUpdateSchema,
  ) {
    return this.rawUpdate(
      Utils.toId(ssoGroupId),
      Utils.serializeRequestBody<RawApiTypes.SsoGroupUpdateSchema>(body, {
        id: Utils.toId(ssoGroupId),
        type: 'sso_group',
        attributes: ['priority'],
        relationships: ['role'],
      }),
    ).then((body) =>
      Utils.deserializeResponseBody<ApiTypes.SsoGroupUpdateTargetSchema>(body),
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
    body: RawApiTypes.SsoGroupUpdateSchema,
  ): Promise<RawApiTypes.SsoGroupUpdateTargetSchema> {
    return this.client.request<RawApiTypes.SsoGroupUpdateTargetSchema>({
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
  destroy(ssoGroupId: string | ApiTypes.SsoGroupData) {
    return this.rawDestroy(Utils.toId(ssoGroupId)).then((body) =>
      Utils.deserializeResponseBody<ApiTypes.SsoGroupDestroyTargetSchema>(body),
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
  ): Promise<RawApiTypes.SsoGroupDestroyTargetSchema> {
    return this.client.request<RawApiTypes.SsoGroupDestroyTargetSchema>({
      method: 'DELETE',
      url: `/sso-groups/${ssoGroupId}`,
    });
  }
}
