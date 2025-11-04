import * as Utils from '@datocms/rest-client-utils';
import BaseResource from '../../BaseResource';
import type * as ApiTypes from '../ApiTypes';
import type * as RawApiTypes from '../RawApiTypes';

export default class Role extends BaseResource {
  static readonly TYPE = 'role' as const;

  /**
   * Create a new role
   *
   * Read more: https://www.datocms.com/docs/content-management-api/resources/role/create
   *
   * @throws {ApiError}
   * @throws {TimeoutError}
   */
  create(body: ApiTypes.RoleCreateSchema) {
    return this.rawCreate(
      Utils.serializeRequestBody<RawApiTypes.RoleCreateSchema>(body, {
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
          'can_manage_search_indexes',
          'can_manage_upload_collections',
          'can_manage_build_triggers',
          'can_manage_webhooks',
          'can_manage_environments',
          'can_manage_sso',
          'can_access_audit_log',
          'can_manage_workflows',
          'can_manage_access_tokens',
          'can_perform_site_search',
          'can_access_build_events_log',
          'can_access_search_index_events_log',
          'positive_item_type_permissions',
          'negative_item_type_permissions',
          'positive_upload_permissions',
          'negative_upload_permissions',
          'positive_build_trigger_permissions',
          'negative_build_trigger_permissions',
          'positive_search_index_permissions',
          'negative_search_index_permissions',
        ],
        relationships: ['inherits_permissions_from'],
      }),
    ).then((body) =>
      Utils.deserializeResponseBody<ApiTypes.RoleCreateTargetSchema>(body),
    );
  }

  /**
   * Create a new role
   *
   * Read more: https://www.datocms.com/docs/content-management-api/resources/role/create
   *
   * @throws {ApiError}
   * @throws {TimeoutError}
   */
  rawCreate(
    body: RawApiTypes.RoleCreateSchema,
  ): Promise<RawApiTypes.RoleCreateTargetSchema> {
    return this.client.request<RawApiTypes.RoleCreateTargetSchema>({
      method: 'POST',
      url: '/roles',
      body,
    });
  }

  /**
   * Update a role
   *
   * Read more: https://www.datocms.com/docs/content-management-api/resources/role/update
   *
   * @throws {ApiError}
   * @throws {TimeoutError}
   */
  update(roleId: string | ApiTypes.RoleData, body: ApiTypes.RoleUpdateSchema) {
    return this.rawUpdate(
      Utils.toId(roleId),
      Utils.serializeRequestBody<RawApiTypes.RoleUpdateSchema>(body, {
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
          'can_manage_search_indexes',
          'can_manage_upload_collections',
          'can_manage_build_triggers',
          'can_manage_webhooks',
          'can_manage_environments',
          'can_manage_sso',
          'can_access_audit_log',
          'can_manage_workflows',
          'can_manage_access_tokens',
          'can_perform_site_search',
          'can_access_build_events_log',
          'can_access_search_index_events_log',
          'positive_item_type_permissions',
          'negative_item_type_permissions',
          'positive_upload_permissions',
          'negative_upload_permissions',
          'positive_build_trigger_permissions',
          'negative_build_trigger_permissions',
          'positive_search_index_permissions',
          'negative_search_index_permissions',
        ],
        relationships: ['inherits_permissions_from'],
      }),
    ).then((body) =>
      Utils.deserializeResponseBody<ApiTypes.RoleUpdateTargetSchema>(body),
    );
  }

  /**
   * Update a role
   *
   * Read more: https://www.datocms.com/docs/content-management-api/resources/role/update
   *
   * @throws {ApiError}
   * @throws {TimeoutError}
   */
  rawUpdate(
    roleId: string,
    body: RawApiTypes.RoleUpdateSchema,
  ): Promise<RawApiTypes.RoleUpdateTargetSchema> {
    return this.client.request<RawApiTypes.RoleUpdateTargetSchema>({
      method: 'PUT',
      url: `/roles/${roleId}`,
      body,
    });
  }

  /**
   * List all roles
   *
   * Read more: https://www.datocms.com/docs/content-management-api/resources/role/instances
   *
   * @throws {ApiError}
   * @throws {TimeoutError}
   */
  list() {
    return this.rawList().then((body) =>
      Utils.deserializeResponseBody<ApiTypes.RoleInstancesTargetSchema>(body),
    );
  }

  /**
   * List all roles
   *
   * Read more: https://www.datocms.com/docs/content-management-api/resources/role/instances
   *
   * @throws {ApiError}
   * @throws {TimeoutError}
   */
  rawList(): Promise<RawApiTypes.RoleInstancesTargetSchema> {
    return this.client.request<RawApiTypes.RoleInstancesTargetSchema>({
      method: 'GET',
      url: '/roles',
    });
  }

  /**
   * Retrieve a role
   *
   * Read more: https://www.datocms.com/docs/content-management-api/resources/role/self
   *
   * @throws {ApiError}
   * @throws {TimeoutError}
   */
  find(roleId: string | ApiTypes.RoleData) {
    return this.rawFind(Utils.toId(roleId)).then((body) =>
      Utils.deserializeResponseBody<ApiTypes.RoleSelfTargetSchema>(body),
    );
  }

  /**
   * Retrieve a role
   *
   * Read more: https://www.datocms.com/docs/content-management-api/resources/role/self
   *
   * @throws {ApiError}
   * @throws {TimeoutError}
   */
  rawFind(roleId: string): Promise<RawApiTypes.RoleSelfTargetSchema> {
    return this.client.request<RawApiTypes.RoleSelfTargetSchema>({
      method: 'GET',
      url: `/roles/${roleId}`,
    });
  }

  /**
   * Delete a role
   *
   * Read more: https://www.datocms.com/docs/content-management-api/resources/role/destroy
   *
   * @throws {ApiError}
   * @throws {TimeoutError}
   */
  destroy(roleId: string | ApiTypes.RoleData) {
    return this.rawDestroy(Utils.toId(roleId)).then((body) =>
      Utils.deserializeResponseBody<ApiTypes.RoleDestroyTargetSchema>(body),
    );
  }

  /**
   * Delete a role
   *
   * Read more: https://www.datocms.com/docs/content-management-api/resources/role/destroy
   *
   * @throws {ApiError}
   * @throws {TimeoutError}
   */
  rawDestroy(roleId: string): Promise<RawApiTypes.RoleDestroyTargetSchema> {
    return this.client.request<RawApiTypes.RoleDestroyTargetSchema>({
      method: 'DELETE',
      url: `/roles/${roleId}`,
    });
  }

  /**
   * Duplicate a role
   *
   * Read more: https://www.datocms.com/docs/content-management-api/resources/role/duplicate
   *
   * @throws {ApiError}
   * @throws {TimeoutError}
   */
  duplicate(roleId: string | ApiTypes.RoleData) {
    return this.rawDuplicate(Utils.toId(roleId)).then((body) =>
      Utils.deserializeResponseBody<ApiTypes.RoleDuplicateTargetSchema>(body),
    );
  }

  /**
   * Duplicate a role
   *
   * Read more: https://www.datocms.com/docs/content-management-api/resources/role/duplicate
   *
   * @throws {ApiError}
   * @throws {TimeoutError}
   */
  rawDuplicate(roleId: string): Promise<RawApiTypes.RoleDuplicateTargetSchema> {
    return this.client.request<RawApiTypes.RoleDuplicateTargetSchema>({
      method: 'POST',
      url: `/roles/${roleId}/duplicate`,
    });
  }
}
