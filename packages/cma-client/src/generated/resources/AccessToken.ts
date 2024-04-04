import * as Utils from '@datocms/rest-client-utils';
import BaseResource from '../../BaseResource';
import type * as SchemaTypes from '../SchemaTypes';
import type * as SimpleSchemaTypes from '../SimpleSchemaTypes';

export default class AccessToken extends BaseResource {
  static readonly TYPE = 'access_token' as const;

  /**
   * Create a new API token
   *
   * Read more: https://www.datocms.com/docs/content-management-api/resources/access-token/create
   *
   * @throws {ApiError}
   * @throws {TimeoutError}
   */
  create(body: SimpleSchemaTypes.AccessTokenCreateSchema) {
    return this.rawCreate(
      Utils.serializeRequestBody<SchemaTypes.AccessTokenCreateSchema>(body, {
        type: 'access_token',
        attributes: [
          'name',
          'can_access_cda',
          'can_access_cda_preview',
          'can_access_cma',
        ],
        relationships: ['role'],
      }),
    ).then((body) =>
      Utils.deserializeResponseBody<SimpleSchemaTypes.AccessTokenCreateTargetSchema>(
        body,
      ),
    );
  }

  /**
   * Create a new API token
   *
   * Read more: https://www.datocms.com/docs/content-management-api/resources/access-token/create
   *
   * @throws {ApiError}
   * @throws {TimeoutError}
   */
  rawCreate(
    body: SchemaTypes.AccessTokenCreateSchema,
  ): Promise<SchemaTypes.AccessTokenCreateTargetSchema> {
    return this.client.request<SchemaTypes.AccessTokenCreateTargetSchema>({
      method: 'POST',
      url: '/access_tokens',
      body,
    });
  }

  /**
   * Update an API token
   *
   * Read more: https://www.datocms.com/docs/content-management-api/resources/access-token/update
   *
   * @throws {ApiError}
   * @throws {TimeoutError}
   */
  update(
    accessTokenId: string | SimpleSchemaTypes.AccessTokenData,
    body: SimpleSchemaTypes.AccessTokenUpdateSchema,
  ) {
    return this.rawUpdate(
      Utils.toId(accessTokenId),
      Utils.serializeRequestBody<SchemaTypes.AccessTokenUpdateSchema>(body, {
        id: Utils.toId(accessTokenId),
        type: 'access_token',
        attributes: [
          'name',
          'can_access_cda',
          'can_access_cda_preview',
          'can_access_cma',
        ],
        relationships: ['role'],
      }),
    ).then((body) =>
      Utils.deserializeResponseBody<SimpleSchemaTypes.AccessTokenUpdateTargetSchema>(
        body,
      ),
    );
  }

  /**
   * Update an API token
   *
   * Read more: https://www.datocms.com/docs/content-management-api/resources/access-token/update
   *
   * @throws {ApiError}
   * @throws {TimeoutError}
   */
  rawUpdate(
    accessTokenId: string,
    body: SchemaTypes.AccessTokenUpdateSchema,
  ): Promise<SchemaTypes.AccessTokenUpdateTargetSchema> {
    return this.client.request<SchemaTypes.AccessTokenUpdateTargetSchema>({
      method: 'PUT',
      url: `/access_tokens/${accessTokenId}`,
      body,
    });
  }

  /**
   * List all API tokens
   *
   * Read more: https://www.datocms.com/docs/content-management-api/resources/access-token/instances
   *
   * @throws {ApiError}
   * @throws {TimeoutError}
   */
  list() {
    return this.rawList().then((body) =>
      Utils.deserializeResponseBody<SimpleSchemaTypes.AccessTokenInstancesTargetSchema>(
        body,
      ),
    );
  }

  /**
   * List all API tokens
   *
   * Read more: https://www.datocms.com/docs/content-management-api/resources/access-token/instances
   *
   * @throws {ApiError}
   * @throws {TimeoutError}
   */
  rawList(): Promise<SchemaTypes.AccessTokenInstancesTargetSchema> {
    return this.client.request<SchemaTypes.AccessTokenInstancesTargetSchema>({
      method: 'GET',
      url: '/access_tokens',
    });
  }

  /**
   * Retrieve an API token
   *
   * Read more: https://www.datocms.com/docs/content-management-api/resources/access-token/self
   *
   * @throws {ApiError}
   * @throws {TimeoutError}
   */
  find(accessTokenId: string | SimpleSchemaTypes.AccessTokenData) {
    return this.rawFind(Utils.toId(accessTokenId)).then((body) =>
      Utils.deserializeResponseBody<SimpleSchemaTypes.AccessTokenSelfTargetSchema>(
        body,
      ),
    );
  }

  /**
   * Retrieve an API token
   *
   * Read more: https://www.datocms.com/docs/content-management-api/resources/access-token/self
   *
   * @throws {ApiError}
   * @throws {TimeoutError}
   */
  rawFind(
    accessTokenId: string,
  ): Promise<SchemaTypes.AccessTokenSelfTargetSchema> {
    return this.client.request<SchemaTypes.AccessTokenSelfTargetSchema>({
      method: 'GET',
      url: `/access_tokens/${accessTokenId}`,
    });
  }

  /**
   * Rotate API token
   *
   * Read more: https://www.datocms.com/docs/content-management-api/resources/access-token/regenerate_token
   *
   * @throws {ApiError}
   * @throws {TimeoutError}
   */
  regenerateToken(accessTokenId: string | SimpleSchemaTypes.AccessTokenData) {
    return this.rawRegenerateToken(Utils.toId(accessTokenId)).then((body) =>
      Utils.deserializeResponseBody<SimpleSchemaTypes.AccessTokenRegenerateTokenTargetSchema>(
        body,
      ),
    );
  }

  /**
   * Rotate API token
   *
   * Read more: https://www.datocms.com/docs/content-management-api/resources/access-token/regenerate_token
   *
   * @throws {ApiError}
   * @throws {TimeoutError}
   */
  rawRegenerateToken(
    accessTokenId: string,
  ): Promise<SchemaTypes.AccessTokenRegenerateTokenTargetSchema> {
    return this.client.request<SchemaTypes.AccessTokenRegenerateTokenTargetSchema>(
      {
        method: 'POST',
        url: `/access_tokens/${accessTokenId}/regenerate_token`,
      },
    );
  }

  /**
   * Delete an API token
   *
   * Read more: https://www.datocms.com/docs/content-management-api/resources/access-token/destroy
   *
   * @throws {ApiError}
   * @throws {TimeoutError}
   */
  destroy(
    accessTokenId: string | SimpleSchemaTypes.AccessTokenData,
    queryParams?: SimpleSchemaTypes.AccessTokenDestroyHrefSchema,
  ) {
    return this.rawDestroy(Utils.toId(accessTokenId), queryParams).then(
      (body) =>
        Utils.deserializeResponseBody<SimpleSchemaTypes.AccessTokenDestroyTargetSchema>(
          body,
        ),
    );
  }

  /**
   * Delete an API token
   *
   * Read more: https://www.datocms.com/docs/content-management-api/resources/access-token/destroy
   *
   * @throws {ApiError}
   * @throws {TimeoutError}
   */
  rawDestroy(
    accessTokenId: string,
    queryParams?: SchemaTypes.AccessTokenDestroyHrefSchema,
  ): Promise<SchemaTypes.AccessTokenDestroyTargetSchema> {
    return this.client.request<SchemaTypes.AccessTokenDestroyTargetSchema>({
      method: 'DELETE',
      url: `/access_tokens/${accessTokenId}`,
      queryParams,
    });
  }
}
