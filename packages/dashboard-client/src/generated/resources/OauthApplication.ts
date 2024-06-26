import * as Utils from '@datocms/rest-client-utils';
import BaseResource from '../../BaseResource';
import type * as SchemaTypes from '../SchemaTypes';
import type * as SimpleSchemaTypes from '../SimpleSchemaTypes';

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
      Utils.deserializeResponseBody<SimpleSchemaTypes.OauthApplicationInstancesTargetSchema>(
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
  rawList(): Promise<SchemaTypes.OauthApplicationInstancesTargetSchema> {
    return this.client.request<SchemaTypes.OauthApplicationInstancesTargetSchema>(
      {
        method: 'GET',
        url: '/oauth_applications',
      },
    );
  }

  /**
   * Delete an authorized application
   *
   * @throws {ApiError}
   * @throws {TimeoutError}
   */
  destroy(oauthApplicationId: string | SimpleSchemaTypes.OauthApplicationData) {
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
