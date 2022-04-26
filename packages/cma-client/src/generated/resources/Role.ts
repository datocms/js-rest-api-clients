import * as Utils from '@datocms/rest-client-utils';
import * as SchemaTypes from '../SchemaTypes';
import * as SimpleSchemaTypes from '../SimpleSchemaTypes';
import BaseResource from '../../BaseResource';

export default class Role extends BaseResource {
  static readonly TYPE: 'role' = 'role';

  /**
   * Create a new role
   *
   * Read more: https://www.datocms.com/docs/content-management-api/resources/role/create
   */
  create(body: SimpleSchemaTypes.RoleCreateSchema) {
    return this.rawCreate(
      Utils.serializeRequestBody<SchemaTypes.RoleCreateSchema>(body, {
        type: 'role',
        attributes: [
          'name',
          'can_edit_favicon',
          'can_edit_site',
          'can_edit_schema',
          'can_manage_menu',
          'can_edit_environment',
          'can_promote_environments',
          'environments_access',
          'can_manage_users',
          'can_manage_shared_filters',
          'can_manage_build_triggers',
          'can_manage_webhooks',
          'can_manage_environments',
          'can_manage_sso',
          'can_access_audit_log',
          'can_manage_workflows',
          'can_manage_access_tokens',
          'can_perform_site_search',
          'can_access_build_events_log',
          'positive_item_type_permissions',
          'negative_item_type_permissions',
          'positive_upload_permissions',
          'negative_upload_permissions',
          'positive_build_trigger_permissions',
          'negative_build_trigger_permissions',
        ],
        relationships: ['inherits_permissions_from'],
      }),
    ).then((body) =>
      Utils.deserializeResponseBody<SimpleSchemaTypes.RoleCreateTargetSchema>(
        body,
      ),
    );
  }

  /**
   * Create a new role
   *
   * Read more: https://www.datocms.com/docs/content-management-api/resources/role/create
   */
  rawCreate(
    body: SchemaTypes.RoleCreateSchema,
  ): Promise<SchemaTypes.RoleCreateTargetSchema> {
    return this.client.request<SchemaTypes.RoleCreateTargetSchema>({
      method: 'POST',
      url: `/roles`,
      body,
    });
  }

  /**
   * Update a role
   *
   * Read more: https://www.datocms.com/docs/content-management-api/resources/role/update
   */
  update(
    roleId: string | SimpleSchemaTypes.RoleData,
    body: SimpleSchemaTypes.RoleUpdateSchema,
  ) {
    return this.rawUpdate(
      Utils.toId(roleId),
      Utils.serializeRequestBody<SchemaTypes.RoleUpdateSchema>(body, {
        id: Utils.toId(roleId),
        type: 'role',
        attributes: [
          'name',
          'can_edit_favicon',
          'can_edit_site',
          'can_edit_schema',
          'can_manage_menu',
          'can_edit_environment',
          'can_promote_environments',
          'environments_access',
          'can_manage_users',
          'can_manage_shared_filters',
          'can_manage_build_triggers',
          'can_manage_webhooks',
          'can_manage_environments',
          'can_manage_sso',
          'can_access_audit_log',
          'can_manage_workflows',
          'can_manage_access_tokens',
          'can_perform_site_search',
          'can_access_build_events_log',
          'positive_item_type_permissions',
          'negative_item_type_permissions',
          'positive_upload_permissions',
          'negative_upload_permissions',
          'positive_build_trigger_permissions',
          'negative_build_trigger_permissions',
        ],
        relationships: ['inherits_permissions_from'],
      }),
    ).then((body) =>
      Utils.deserializeResponseBody<SimpleSchemaTypes.RoleUpdateTargetSchema>(
        body,
      ),
    );
  }

  /**
   * Update a role
   *
   * Read more: https://www.datocms.com/docs/content-management-api/resources/role/update
   */
  rawUpdate(
    roleId: string,
    body: SchemaTypes.RoleUpdateSchema,
  ): Promise<SchemaTypes.RoleUpdateTargetSchema> {
    return this.client.request<SchemaTypes.RoleUpdateTargetSchema>({
      method: 'PUT',
      url: `/roles/${roleId}`,
      body,
    });
  }

  /**
   * List all roles
   *
   * Read more: https://www.datocms.com/docs/content-management-api/resources/role/instances
   */
  list() {
    return this.rawList().then((body) =>
      Utils.deserializeResponseBody<SimpleSchemaTypes.RoleInstancesTargetSchema>(
        body,
      ),
    );
  }

  /**
   * List all roles
   *
   * Read more: https://www.datocms.com/docs/content-management-api/resources/role/instances
   */
  rawList(): Promise<SchemaTypes.RoleInstancesTargetSchema> {
    return this.client.request<SchemaTypes.RoleInstancesTargetSchema>({
      method: 'GET',
      url: `/roles`,
    });
  }

  /**
   * Retrieve a role
   *
   * Read more: https://www.datocms.com/docs/content-management-api/resources/role/self
   */
  find(roleId: string | SimpleSchemaTypes.RoleData) {
    return this.rawFind(Utils.toId(roleId)).then((body) =>
      Utils.deserializeResponseBody<SimpleSchemaTypes.RoleSelfTargetSchema>(
        body,
      ),
    );
  }

  /**
   * Retrieve a role
   *
   * Read more: https://www.datocms.com/docs/content-management-api/resources/role/self
   */
  rawFind(roleId: string): Promise<SchemaTypes.RoleSelfTargetSchema> {
    return this.client.request<SchemaTypes.RoleSelfTargetSchema>({
      method: 'GET',
      url: `/roles/${roleId}`,
    });
  }

  /**
   * Delete a role
   *
   * Read more: https://www.datocms.com/docs/content-management-api/resources/role/destroy
   */
  destroy(roleId: string | SimpleSchemaTypes.RoleData) {
    return this.rawDestroy(Utils.toId(roleId)).then((body) =>
      Utils.deserializeResponseBody<SimpleSchemaTypes.RoleDestroyTargetSchema>(
        body,
      ),
    );
  }

  /**
   * Delete a role
   *
   * Read more: https://www.datocms.com/docs/content-management-api/resources/role/destroy
   */
  rawDestroy(roleId: string): Promise<SchemaTypes.RoleDestroyTargetSchema> {
    return this.client.request<SchemaTypes.RoleDestroyTargetSchema>({
      method: 'DELETE',
      url: `/roles/${roleId}`,
    });
  }
}
