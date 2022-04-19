import * as Utils from '@datocms/rest-client-utils';
import * as SchemaTypes from '../SchemaTypes';
import * as SimpleSchemaTypes from '../SimpleSchemaTypes';
import BaseResource from '../../BaseResource';

export default class SubscriptionLimit extends BaseResource {
  static readonly TYPE: 'subscription_limit' = 'subscription_limit';

  /**
   * Get all the subscription limits
   *
   * Read more: https://www.datocms.com/docs/content-management-api/resources/subscription-limit/instances
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
   */
  rawList(): Promise<SchemaTypes.SubscriptionLimitInstancesTargetSchema> {
    return this.client.request<SchemaTypes.SubscriptionLimitInstancesTargetSchema>(
      {
        method: 'GET',
        url: `/subscription-limits`,
      },
    );
  }

  /**
   * Get a single subscription limit
   *
   * Read more: https://www.datocms.com/docs/content-management-api/resources/subscription-limit/self
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
