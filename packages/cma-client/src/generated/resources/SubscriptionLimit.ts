import * as Utils from '@datocms/rest-client-utils';
import BaseResource from '../../BaseResource';
import type * as SchemaTypes from '../SchemaTypes';
import type * as SimpleSchemaTypes from '../SimpleSchemaTypes';

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
      Utils.deserializeResponseBody<SimpleSchemaTypes.SubscriptionLimitInstancesTargetSchema>(
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
  rawList(): Promise<SchemaTypes.SubscriptionLimitInstancesTargetSchema> {
    return this.client.request<SchemaTypes.SubscriptionLimitInstancesTargetSchema>(
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
  find(subscriptionLimitId: string | SimpleSchemaTypes.SubscriptionLimitData) {
    return this.rawFind(Utils.toId(subscriptionLimitId)).then((body) =>
      Utils.deserializeResponseBody<SimpleSchemaTypes.SubscriptionLimitSelfTargetSchema>(
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
  ): Promise<SchemaTypes.SubscriptionLimitSelfTargetSchema> {
    return this.client.request<SchemaTypes.SubscriptionLimitSelfTargetSchema>({
      method: 'GET',
      url: `/subscription-limits/${subscriptionLimitId}`,
    });
  }
}
