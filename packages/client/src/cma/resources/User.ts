import BaseResource from '../BaseResource';
import serializeRequestBody from '../../serializeRequestBody';
import deserializeResponseBody from '../../deserializeResponseBody';
import toId from '../../toId';
import * as SchemaTypes from '../SchemaTypes';
import * as SimpleSchemaTypes from '../SimpleSchemaTypes';

export default class User extends BaseResource {
  static readonly TYPE: 'user' = 'user';

  /**
   * Update a collaborator
   *
   * Read more: https://www.datocms.com/docs/content-management-api/resources/user/update
   */
  update(
    userId: string | SimpleSchemaTypes.UserData,
    body: SimpleSchemaTypes.UserUpdateSchema,
  ) {
    return this.rawUpdate(
      toId(userId),
      serializeRequestBody<SchemaTypes.UserUpdateSchema>({
        body,
        id: toId(userId),
        type: User.TYPE,
      }),
    ).then((body) =>
      deserializeResponseBody<SimpleSchemaTypes.UserUpdateTargetSchema>(body),
    );
  }

  /**
   * Update a collaborator
   *
   * Read more: https://www.datocms.com/docs/content-management-api/resources/user/update
   */
  rawUpdate(
    userId: string,
    body: SchemaTypes.UserUpdateSchema,
  ): Promise<SchemaTypes.UserUpdateTargetSchema> {
    return this.client.request<SchemaTypes.UserUpdateTargetSchema>({
      method: 'PUT',
      url: `/users/${userId}`,
      body,
    });
  }

  /**
   * List all collaborators
   *
   * Read more: https://www.datocms.com/docs/content-management-api/resources/user/instances
   */
  list() {
    return this.rawList().then((body) =>
      deserializeResponseBody<SimpleSchemaTypes.UserInstancesTargetSchema>(
        body,
      ),
    );
  }

  /**
   * List all collaborators
   *
   * Read more: https://www.datocms.com/docs/content-management-api/resources/user/instances
   */
  rawList(): Promise<SchemaTypes.UserInstancesTargetSchema> {
    return this.client.request<SchemaTypes.UserInstancesTargetSchema>({
      method: 'GET',
      url: `/users`,
    });
  }

  /**
   * Retrieve a collaborator
   *
   * Read more: https://www.datocms.com/docs/content-management-api/resources/user/self
   */
  find(userId: string | SimpleSchemaTypes.UserData) {
    return this.rawFind(toId(userId)).then((body) =>
      deserializeResponseBody<SimpleSchemaTypes.UserSelfTargetSchema>(body),
    );
  }

  /**
   * Retrieve a collaborator
   *
   * Read more: https://www.datocms.com/docs/content-management-api/resources/user/self
   */
  rawFind(userId: string): Promise<SchemaTypes.UserSelfTargetSchema> {
    return this.client.request<SchemaTypes.UserSelfTargetSchema>({
      method: 'GET',
      url: `/users/${userId}`,
    });
  }

  /**
   * Delete a collaborator
   *
   * Read more: https://www.datocms.com/docs/content-management-api/resources/user/destroy
   */
  destroy(
    userId: string | SimpleSchemaTypes.UserData,
    queryParams?: SimpleSchemaTypes.UserDestroyHrefSchema,
  ) {
    return this.rawDestroy(toId(userId), queryParams).then((body) =>
      deserializeResponseBody<SimpleSchemaTypes.UserDestroyTargetSchema>(body),
    );
  }

  /**
   * Delete a collaborator
   *
   * Read more: https://www.datocms.com/docs/content-management-api/resources/user/destroy
   */
  rawDestroy(
    userId: string,
    queryParams?: SchemaTypes.UserDestroyHrefSchema,
  ): Promise<SchemaTypes.UserDestroyTargetSchema> {
    return this.client.request<SchemaTypes.UserDestroyTargetSchema>({
      method: 'DELETE',
      url: `/users/${userId}`,
      queryParams,
    });
  }
}
