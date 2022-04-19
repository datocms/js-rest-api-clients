import BaseResource from '../BaseResource';
import { serializeRequestBody } from '../../serialize';
import {
  deserializeResponseBody,
  deserializeJsonEntity,
} from '../../deserialize';
import toId from '../../toId';
import * as SchemaTypes from '../SchemaTypes';
import * as SimpleSchemaTypes from '../SimpleSchemaTypes';
import { IteratorOptions, rawPageIterator } from '../../rawPageIterator';

export default class AccessToken extends BaseResource {
  static readonly TYPE: 'access_token' = 'access_token';

  /**
   * Create a new API token
   *
   * Read more: https://www.datocms.com/docs/content-management-api/resources/access-token/create
   */
  create(body: SimpleSchemaTypes.AccessTokenCreateSchema) {
    return this.rawCreate(
      serializeRequestBody<SchemaTypes.AccessTokenCreateSchema>({
        body,
        type: AccessToken.TYPE,
      }),
    ).then((body) =>
      deserializeResponseBody<SimpleSchemaTypes.AccessTokenCreateTargetSchema>(
        body,
      ),
    );
  }

  /**
   * Create a new API token
   *
   * Read more: https://www.datocms.com/docs/content-management-api/resources/access-token/create
   */
  rawCreate(
    body: SchemaTypes.AccessTokenCreateSchema,
  ): Promise<SchemaTypes.AccessTokenCreateTargetSchema> {
    return this.client.request<SchemaTypes.AccessTokenCreateTargetSchema>({
      method: 'POST',
      url: `/access_tokens`,
      body,
    });
  }

  /**
   * Update an API token
   *
   * Read more: https://www.datocms.com/docs/content-management-api/resources/access-token/update
   */
  update(
    userId: string | SimpleSchemaTypes.AccessTokenData,
    body: SimpleSchemaTypes.AccessTokenUpdateSchema,
  ) {
    return this.rawUpdate(
      toId(userId),
      serializeRequestBody<SchemaTypes.AccessTokenUpdateSchema>({
        body,
        type: AccessToken.TYPE,
      }),
    ).then((body) =>
      deserializeResponseBody<SimpleSchemaTypes.AccessTokenUpdateTargetSchema>(
        body,
      ),
    );
  }

  /**
   * Update an API token
   *
   * Read more: https://www.datocms.com/docs/content-management-api/resources/access-token/update
   */
  rawUpdate(
    userId: string,
    body: SchemaTypes.AccessTokenUpdateSchema,
  ): Promise<SchemaTypes.AccessTokenUpdateTargetSchema> {
    return this.client.request<SchemaTypes.AccessTokenUpdateTargetSchema>({
      method: 'PUT',
      url: `/access_tokens/${userId}`,
      body,
    });
  }

  /**
   * List all API tokens
   *
   * Read more: https://www.datocms.com/docs/content-management-api/resources/access-token/instances
   */
  list() {
    return this.rawList().then((body) =>
      deserializeResponseBody<SimpleSchemaTypes.AccessTokenInstancesTargetSchema>(
        body,
      ),
    );
  }

  /**
   * List all API tokens
   *
   * Read more: https://www.datocms.com/docs/content-management-api/resources/access-token/instances
   */
  rawList(): Promise<SchemaTypes.AccessTokenInstancesTargetSchema> {
    return this.client.request<SchemaTypes.AccessTokenInstancesTargetSchema>({
      method: 'GET',
      url: `/access_tokens`,
    });
  }

  /**
   * Retrieve an API token
   *
   * Read more: https://www.datocms.com/docs/content-management-api/resources/access-token/self
   */
  find(userId: string | SimpleSchemaTypes.AccessTokenData) {
    return this.rawFind(toId(userId)).then((body) =>
      deserializeResponseBody<SimpleSchemaTypes.AccessTokenSelfTargetSchema>(
        body,
      ),
    );
  }

  /**
   * Retrieve an API token
   *
   * Read more: https://www.datocms.com/docs/content-management-api/resources/access-token/self
   */
  rawFind(userId: string): Promise<SchemaTypes.AccessTokenSelfTargetSchema> {
    return this.client.request<SchemaTypes.AccessTokenSelfTargetSchema>({
      method: 'GET',
      url: `/access_tokens/${userId}`,
    });
  }

  /**
   * Rotate API token
   *
   * Read more: https://www.datocms.com/docs/content-management-api/resources/access-token/regenerate_token
   */
  regenerateToken(userId: string | SimpleSchemaTypes.AccessTokenData) {
    return this.rawRegenerateToken(toId(userId)).then((body) =>
      deserializeResponseBody<SimpleSchemaTypes.AccessTokenRegenerateTokenTargetSchema>(
        body,
      ),
    );
  }

  /**
   * Rotate API token
   *
   * Read more: https://www.datocms.com/docs/content-management-api/resources/access-token/regenerate_token
   */
  rawRegenerateToken(
    userId: string,
  ): Promise<SchemaTypes.AccessTokenRegenerateTokenTargetSchema> {
    return this.client.request<SchemaTypes.AccessTokenRegenerateTokenTargetSchema>(
      {
        method: 'POST',
        url: `/access_tokens/${userId}/regenerate_token`,
      },
    );
  }

  /**
   * Delete an API token
   *
   * Read more: https://www.datocms.com/docs/content-management-api/resources/access-token/destroy
   */
  destroy(
    userId: string | SimpleSchemaTypes.AccessTokenData,
    queryParams?: SimpleSchemaTypes.AccessTokenDestroyHrefSchema,
  ) {
    return this.rawDestroy(toId(userId), queryParams).then((body) =>
      deserializeResponseBody<SimpleSchemaTypes.AccessTokenDestroyTargetSchema>(
        body,
      ),
    );
  }

  /**
   * Delete an API token
   *
   * Read more: https://www.datocms.com/docs/content-management-api/resources/access-token/destroy
   */
  rawDestroy(
    userId: string,
    queryParams?: SchemaTypes.AccessTokenDestroyHrefSchema,
  ): Promise<SchemaTypes.AccessTokenDestroyTargetSchema> {
    return this.client.request<SchemaTypes.AccessTokenDestroyTargetSchema>({
      method: 'DELETE',
      url: `/access_tokens/${userId}`,
      queryParams,
    });
  }
}
