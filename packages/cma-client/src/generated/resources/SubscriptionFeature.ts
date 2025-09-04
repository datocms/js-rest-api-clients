import * as Utils from '@datocms/rest-client-utils';
import BaseResource from '../../BaseResource';
import type * as ApiTypes from '../ApiTypes';
import type * as RawApiTypes from '../RawApiTypes';

export default class SubscriptionFeature extends BaseResource {
  static readonly TYPE = 'subscription_feature' as const;

  /**
   * Get all the subscription features
   *
   * Read more: https://www.datocms.com/docs/content-management-api/resources/subscription-feature/instances
   *
   * @throws {ApiError}
   * @throws {TimeoutError}
   */
  list() {
    return this.rawList().then((body) =>
      Utils.deserializeResponseBody<ApiTypes.SubscriptionFeatureInstancesTargetSchema>(
        body,
      ),
    );
  }

  /**
   * Get all the subscription features
   *
   * Read more: https://www.datocms.com/docs/content-management-api/resources/subscription-feature/instances
   *
   * @throws {ApiError}
   * @throws {TimeoutError}
   */
  rawList(): Promise<RawApiTypes.SubscriptionFeatureInstancesTargetSchema> {
    return this.client.request<RawApiTypes.SubscriptionFeatureInstancesTargetSchema>(
      {
        method: 'GET',
        url: '/subscription-features',
      },
    );
  }
}
