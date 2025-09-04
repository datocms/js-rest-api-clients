import * as Utils from '@datocms/rest-client-utils';
import BaseResource from '../../BaseResource';
import type * as ApiTypes from '../ApiTypes';
import type * as RawApiTypes from '../RawApiTypes';

export default class SubscriptionLimit extends BaseResource {
  static readonly TYPE = 'subscription_limit' as const;

  /**
   * Get all the subscription limits
   *
   * @throws {ApiError}
   * @throws {TimeoutError}
   */
  list(siteId: string | ApiTypes.SiteData) {
    return this.rawList(Utils.toId(siteId)).then((body) =>
      Utils.deserializeResponseBody<ApiTypes.SubscriptionLimitInstancesTargetSchema>(
        body,
      ),
    );
  }

  /**
   * Get all the subscription limits
   *
   * @throws {ApiError}
   * @throws {TimeoutError}
   */
  rawList(
    siteId: string,
  ): Promise<RawApiTypes.SubscriptionLimitInstancesTargetSchema> {
    return this.client.request<RawApiTypes.SubscriptionLimitInstancesTargetSchema>(
      {
        method: 'GET',
        url: `/sites/${siteId}/subscription-limits`,
      },
    );
  }
}
