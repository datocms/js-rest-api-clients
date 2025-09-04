import * as Utils from '@datocms/rest-client-utils';
import BaseResource from '../../BaseResource';
import type * as ApiTypes from '../ApiTypes';
import type * as RawApiTypes from '../RawApiTypes';

export default class OrganizationRole extends BaseResource {
  static readonly TYPE = 'organization_role' as const;

  /**
   * List organization roles
   *
   * @throws {ApiError}
   * @throws {TimeoutError}
   */
  list() {
    return this.rawList().then((body) =>
      Utils.deserializeResponseBody<ApiTypes.OrganizationRoleInstancesTargetSchema>(
        body,
      ),
    );
  }

  /**
   * List organization roles
   *
   * @throws {ApiError}
   * @throws {TimeoutError}
   */
  rawList(): Promise<RawApiTypes.OrganizationRoleInstancesTargetSchema> {
    return this.client.request<RawApiTypes.OrganizationRoleInstancesTargetSchema>(
      {
        method: 'GET',
        url: '/organization-roles',
      },
    );
  }

  /**
   * Retrieve an organization role
   *
   * @throws {ApiError}
   * @throws {TimeoutError}
   */
  find(organizationRoleId: string | ApiTypes.OrganizationRoleData) {
    return this.rawFind(Utils.toId(organizationRoleId)).then((body) =>
      Utils.deserializeResponseBody<ApiTypes.OrganizationRoleSelfTargetSchema>(
        body,
      ),
    );
  }

  /**
   * Retrieve an organization role
   *
   * @throws {ApiError}
   * @throws {TimeoutError}
   */
  rawFind(
    organizationRoleId: string,
  ): Promise<RawApiTypes.OrganizationRoleSelfTargetSchema> {
    return this.client.request<RawApiTypes.OrganizationRoleSelfTargetSchema>({
      method: 'GET',
      url: `/organization-roles/${organizationRoleId}`,
    });
  }
}
