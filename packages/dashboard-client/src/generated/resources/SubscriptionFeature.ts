import * as Utils from '@datocms/rest-client-utils';
import BaseResource from '../../BaseResource';
import type * as SchemaTypes from '../SchemaTypes';
import type * as SimpleSchemaTypes from '../SimpleSchemaTypes';

export default class SubscriptionFeature extends BaseResource {
  static readonly TYPE = 'subscription_feature' as const;

  /**
   * Get all the subscription features
   *
   * @throws {ApiError}
   * @throws {TimeoutError}
   */
  list(siteId: string | SimpleSchemaTypes.SiteData) {
    return this.rawList(Utils.toId(siteId)).then((body) =>
      Utils.deserializeResponseBody<SimpleSchemaTypes.SubscriptionFeatureInstancesTargetSchema>(
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
  ): Promise<SchemaTypes.SubscriptionFeatureInstancesTargetSchema> {
    return this.client.request<SchemaTypes.SubscriptionFeatureInstancesTargetSchema>(
      {
        method: 'GET',
        url: `/sites/${siteId}/subscription-features`,
      },
    );
  }
}
