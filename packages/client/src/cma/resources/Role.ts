import BaseResource from '../BaseResource';
import serializeRequestBody from '../../serializeRequestBody';
import deserializeResponseBody from '../../deserializeResponseBody';
import toId from '../../toId';
import * as SchemaTypes from '../SchemaTypes';
import * as SimpleSchemaTypes from '../SimpleSchemaTypes';

export default class Role extends BaseResource {
  static readonly TYPE: 'role' = 'role';

  /**
   * Create a new role
   *
   * Read more: https://www.datocms.com/docs/content-management-api/resources/role/create
   */
  create(body: SimpleSchemaTypes.RoleCreateSchema) {
    return this.rawCreate(
      serializeRequestBody<SchemaTypes.RoleCreateSchema>({
        body,
        type: Role.TYPE,
      }),
    ).then((body) =>
      deserializeResponseBody<SimpleSchemaTypes.RoleCreateTargetSchema>(body),
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
      toId(roleId),
      serializeRequestBody<SchemaTypes.RoleUpdateSchema>({
        body,
        id: toId(roleId),
        type: Role.TYPE,
      }),
    ).then((body) =>
      deserializeResponseBody<SimpleSchemaTypes.RoleUpdateTargetSchema>(body),
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
      deserializeResponseBody<SimpleSchemaTypes.RoleInstancesTargetSchema>(
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
    return this.rawFind(toId(roleId)).then((body) =>
      deserializeResponseBody<SimpleSchemaTypes.RoleSelfTargetSchema>(body),
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
    return this.rawDestroy(toId(roleId)).then((body) =>
      deserializeResponseBody<SimpleSchemaTypes.RoleDestroyTargetSchema>(body),
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
