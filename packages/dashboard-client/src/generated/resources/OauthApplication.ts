import * as Utils from '@datocms/rest-client-utils';
import BaseResource from '../../BaseResource';
import type * as ApiTypes from '../ApiTypes';
import type * as RawApiTypes from '../RawApiTypes';

export default class OauthApplication extends BaseResource {
  static readonly TYPE = 'oauth_application' as const;

  /**
   * List all authorized applications
   *
   * @throws {ApiError}
   * @throws {TimeoutError}
   */
  list() {
    return this.rawList().then((body) =>
      Utils.deserializeResponseBody<ApiTypes.OauthApplicationInstancesTargetSchema>(
        body,
      ),
    );
  }

  /**
   * List all authorized applications
   *
   * @throws {ApiError}
   * @throws {TimeoutError}
   */
  rawList(): Promise<RawApiTypes.OauthApplicationInstancesTargetSchema> {
    return this.client.request<RawApiTypes.OauthApplicationInstancesTargetSchema>(
      {
        method: 'GET',
        url: '/oauth_applications',
      },
    );
  }

  /**
   * Update site access settings for an authorized application
   *
   * @throws {ApiError}
   * @throws {TimeoutError}
   */
  update(
    oauthApplicationId: string | ApiTypes.OauthApplicationData,
    body: ApiTypes.OauthApplicationUpdateSchema,
  ) {
    return this.rawUpdate(
      Utils.toId(oauthApplicationId),
      Utils.serializeRequestBody<RawApiTypes.OauthApplicationUpdateSchema>(
        body,
        {
          id: Utils.toId(oauthApplicationId),
          type: 'oauth_application',
          attributes: ['site_access_mode'],
          relationships: ['granted_sites'],
        },
      ),
    ).then((body) =>
      Utils.deserializeResponseBody<ApiTypes.OauthApplicationUpdateTargetSchema>(
        body,
      ),
    );
  }

  /**
   * Update site access settings for an authorized application
   *
   * @throws {ApiError}
   * @throws {TimeoutError}
   */
  rawUpdate(
    oauthApplicationId: string,
    body: RawApiTypes.OauthApplicationUpdateSchema,
  ): Promise<RawApiTypes.OauthApplicationUpdateTargetSchema> {
    return this.client.request<RawApiTypes.OauthApplicationUpdateTargetSchema>({
      method: 'PUT',
      url: `/oauth_applications/${oauthApplicationId}`,
      body,
    });
  }

  /**
   * Delete an authorized application
   *
   * @throws {ApiError}
   * @throws {TimeoutError}
   */
  destroy(oauthApplicationId: string | ApiTypes.OauthApplicationData) {
    return this.rawDestroy(Utils.toId(oauthApplicationId));
  }

  /**
   * Delete an authorized application
   *
   * @throws {ApiError}
   * @throws {TimeoutError}
   */
  rawDestroy(oauthApplicationId: string): Promise<void> {
    return this.client.request<void>({
      method: 'DELETE',
      url: `/oauth_applications/${oauthApplicationId}`,
    });
  }
}
