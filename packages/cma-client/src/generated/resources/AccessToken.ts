import * as Utils from '@datocms/rest-client-utils';
import BaseResource from '../../BaseResource';
import type * as ApiTypes from '../ApiTypes';
import type * as RawApiTypes from '../RawApiTypes';

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
  create(body: ApiTypes.AccessTokenCreateSchema) {
    return this.rawCreate(
      Utils.serializeRequestBody<RawApiTypes.AccessTokenCreateSchema>(body, {
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
      Utils.deserializeResponseBody<ApiTypes.AccessTokenCreateTargetSchema>(
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
    body: RawApiTypes.AccessTokenCreateSchema,
  ): Promise<RawApiTypes.AccessTokenCreateTargetSchema> {
    return this.client.request<RawApiTypes.AccessTokenCreateTargetSchema>({
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
    accessTokenId: string | ApiTypes.AccessTokenData,
    body: ApiTypes.AccessTokenUpdateSchema,
  ) {
    return this.rawUpdate(
      Utils.toId(accessTokenId),
      Utils.serializeRequestBody<RawApiTypes.AccessTokenUpdateSchema>(body, {
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
      Utils.deserializeResponseBody<ApiTypes.AccessTokenUpdateTargetSchema>(
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
    body: RawApiTypes.AccessTokenUpdateSchema,
  ): Promise<RawApiTypes.AccessTokenUpdateTargetSchema> {
    return this.client.request<RawApiTypes.AccessTokenUpdateTargetSchema>({
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
      Utils.deserializeResponseBody<ApiTypes.AccessTokenInstancesTargetSchema>(
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
  rawList(): Promise<RawApiTypes.AccessTokenInstancesTargetSchema> {
    return this.client.request<RawApiTypes.AccessTokenInstancesTargetSchema>({
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
  find(accessTokenId: string | ApiTypes.AccessTokenData) {
    return this.rawFind(Utils.toId(accessTokenId)).then((body) =>
      Utils.deserializeResponseBody<ApiTypes.AccessTokenSelfTargetSchema>(body),
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
  ): Promise<RawApiTypes.AccessTokenSelfTargetSchema> {
    return this.client.request<RawApiTypes.AccessTokenSelfTargetSchema>({
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
  regenerateToken(accessTokenId: string | ApiTypes.AccessTokenData) {
    return this.rawRegenerateToken(Utils.toId(accessTokenId)).then((body) =>
      Utils.deserializeResponseBody<ApiTypes.AccessTokenRegenerateTokenTargetSchema>(
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
  ): Promise<RawApiTypes.AccessTokenRegenerateTokenTargetSchema> {
    return this.client.request<RawApiTypes.AccessTokenRegenerateTokenTargetSchema>(
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
    accessTokenId: string | ApiTypes.AccessTokenData,
    queryParams?: ApiTypes.AccessTokenDestroyHrefSchema,
  ) {
    return this.rawDestroy(Utils.toId(accessTokenId), queryParams).then(
      (body) =>
        Utils.deserializeResponseBody<ApiTypes.AccessTokenDestroyTargetSchema>(
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
    queryParams?: RawApiTypes.AccessTokenDestroyHrefSchema,
  ): Promise<RawApiTypes.AccessTokenDestroyTargetSchema> {
    return this.client.request<RawApiTypes.AccessTokenDestroyTargetSchema>({
      method: 'DELETE',
      url: `/access_tokens/${accessTokenId}`,
      queryParams,
    });
  }
}
