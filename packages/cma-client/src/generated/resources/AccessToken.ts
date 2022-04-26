import * as Utils from '@datocms/rest-client-utils';
import * as SchemaTypes from '../SchemaTypes';
import * as SimpleSchemaTypes from '../SimpleSchemaTypes';
import BaseResource from '../../BaseResource';

export default class AccessToken extends BaseResource {
  static readonly TYPE: 'access_token' = 'access_token';

  /**
   * Create a new API token
   *
   * Read more: https://www.datocms.com/docs/content-management-api/resources/access-token/create
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
