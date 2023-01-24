import * as Utils from '@datocms/rest-client-utils';
import * as SchemaTypes from '../SchemaTypes';
import * as SimpleSchemaTypes from '../SimpleSchemaTypes';
import BaseResource from '../../BaseResource';

export default class OrganizationRole extends BaseResource {
  static readonly TYPE: 'organization_role' = 'organization_role';

  /**
   * List organization roles
   *
   * @throws {ApiError}
   * @throws {TimeoutError}
   */
  list() {
    return this.rawList().then((body) =>
      Utils.deserializeResponseBody<SimpleSchemaTypes.OrganizationRoleInstancesTargetSchema>(
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
  rawList(): Promise<SchemaTypes.OrganizationRoleInstancesTargetSchema> {
    return this.client.request<SchemaTypes.OrganizationRoleInstancesTargetSchema>(
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
  find(organizationRoleId: string | SimpleSchemaTypes.OrganizationRoleData) {
    return this.rawFind(Utils.toId(organizationRoleId)).then((body) =>
      Utils.deserializeResponseBody<SimpleSchemaTypes.OrganizationRoleSelfTargetSchema>(
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
  ): Promise<SchemaTypes.OrganizationRoleSelfTargetSchema> {
    return this.client.request<SchemaTypes.OrganizationRoleSelfTargetSchema>({
      method: 'GET',
      url: `/organization-roles/${organizationRoleId}`,
    });
  }
}
