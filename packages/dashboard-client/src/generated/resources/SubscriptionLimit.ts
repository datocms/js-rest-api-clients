import * as Utils from '@datocms/rest-client-utils';
import * as SchemaTypes from '../SchemaTypes';
import * as SimpleSchemaTypes from '../SimpleSchemaTypes';
import BaseResource from '../../BaseResource';

export default class SubscriptionLimit extends BaseResource {
  static readonly TYPE: 'subscription_limit' = 'subscription_limit';

  /**
   * Get all the subscription limits
   */
  list(siteId: string | SimpleSchemaTypes.SubscriptionLimitData) {
    return this.rawList(Utils.toId(siteId)).then((body) =>
      Utils.deserializeResponseBody<SimpleSchemaTypes.SubscriptionLimitInstancesTargetSchema>(
        body,
      ),
    );
  }

  /**
   * Get all the subscription limits
   */
  rawList(
    siteId: string,
  ): Promise<SchemaTypes.SubscriptionLimitInstancesTargetSchema> {
    return this.client.request<SchemaTypes.SubscriptionLimitInstancesTargetSchema>(
      {
        method: 'GET',
        url: `/sites/${siteId}/subscription-limits`,
      },
    );
  }
}
