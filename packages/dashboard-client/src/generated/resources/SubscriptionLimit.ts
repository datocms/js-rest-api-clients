import * as Utils from '@datocms/rest-client-utils';
import BaseResource from '../../BaseResource';
import * as SchemaTypes from '../SchemaTypes';
import * as SimpleSchemaTypes from '../SimpleSchemaTypes';

export default class SubscriptionLimit extends BaseResource {
  static readonly TYPE = 'subscription_limit' as const;

  /**
   * Get all the subscription limits
   *
   * @throws {ApiError}
   * @throws {TimeoutError}
   */
  list(siteId: string | SimpleSchemaTypes.SiteData) {
    return this.rawList(Utils.toId(siteId)).then((body) =>
      Utils.deserializeResponseBody<SimpleSchemaTypes.SubscriptionLimitInstancesTargetSchema>(
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
  ): Promise<SchemaTypes.SubscriptionLimitInstancesTargetSchema> {
    return this.client.request<SchemaTypes.SubscriptionLimitInstancesTargetSchema>(
      {
        method: 'GET',
        url: `/sites/${siteId}/subscription-limits`,
      },
    );
  }
}
