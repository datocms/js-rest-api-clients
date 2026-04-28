import * as Utils from '@datocms/rest-client-utils';
import BaseResource from '../../BaseResource.js';
import type * as ApiTypes from '../ApiTypes.js';
import type * as RawApiTypes from '../RawApiTypes.js';

export default class SubscriptionFeature extends BaseResource {
  static readonly TYPE = 'subscription_feature' as const;

  /**
   * Get all the subscription features
   *
   * @throws {ApiError}
   * @throws {TimeoutError}
   */
  list(siteId: string | ApiTypes.SiteData) {
    return this.rawList(Utils.toId(siteId)).then((body) =>
      Utils.deserializeResponseBody<ApiTypes.SubscriptionFeatureInstancesTargetSchema>(
        body,
      ),
    );
  }

  /**
   * Get all the subscription features
   *
   * @throws {ApiError}
   * @throws {TimeoutError}
   */
  rawList(
    siteId: string,
  ): Promise<RawApiTypes.SubscriptionFeatureInstancesTargetSchema> {
    return this.client.request<RawApiTypes.SubscriptionFeatureInstancesTargetSchema>(
      {
        method: 'GET',
        url: `/sites/${siteId}/subscription-features`,
      },
    );
  }
}
