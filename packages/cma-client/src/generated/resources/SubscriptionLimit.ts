import * as Utils from '@datocms/rest-client-utils';
import BaseResource from '../../BaseResource';
import type * as ApiTypes from '../ApiTypes';
import type * as RawApiTypes from '../RawApiTypes';

export default class SubscriptionLimit extends BaseResource {
  static readonly TYPE = 'subscription_limit' as const;

  /**
   * Get all the subscription limits
   *
   * Read more: https://www.datocms.com/docs/content-management-api/resources/subscription-limit/instances
   *
   * @throws {ApiError}
   * @throws {TimeoutError}
   */
  list() {
    return this.rawList().then((body) =>
      Utils.deserializeResponseBody<ApiTypes.SubscriptionLimitInstancesTargetSchema>(
        body,
      ),
    );
  }

  /**
   * Get all the subscription limits
   *
   * Read more: https://www.datocms.com/docs/content-management-api/resources/subscription-limit/instances
   *
   * @throws {ApiError}
   * @throws {TimeoutError}
   */
  rawList(): Promise<RawApiTypes.SubscriptionLimitInstancesTargetSchema> {
    return this.client.request<RawApiTypes.SubscriptionLimitInstancesTargetSchema>(
      {
        method: 'GET',
        url: '/subscription-limits',
      },
    );
  }

  /**
   * Get a single subscription limit
   *
   * Read more: https://www.datocms.com/docs/content-management-api/resources/subscription-limit/self
   *
   * @throws {ApiError}
   * @throws {TimeoutError}
   */
  find(subscriptionLimitId: string | ApiTypes.SubscriptionLimitData) {
    return this.rawFind(Utils.toId(subscriptionLimitId)).then((body) =>
      Utils.deserializeResponseBody<ApiTypes.SubscriptionLimitSelfTargetSchema>(
        body,
      ),
    );
  }

  /**
   * Get a single subscription limit
   *
   * Read more: https://www.datocms.com/docs/content-management-api/resources/subscription-limit/self
   *
   * @throws {ApiError}
   * @throws {TimeoutError}
   */
  rawFind(
    subscriptionLimitId: string,
  ): Promise<RawApiTypes.SubscriptionLimitSelfTargetSchema> {
    return this.client.request<RawApiTypes.SubscriptionLimitSelfTargetSchema>({
      method: 'GET',
      url: `/subscription-limits/${subscriptionLimitId}`,
    });
  }
}
