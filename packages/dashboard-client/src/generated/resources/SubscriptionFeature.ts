import * as Utils from '@datocms/rest-client-utils';
import * as SchemaTypes from '../SchemaTypes';
import * as SimpleSchemaTypes from '../SimpleSchemaTypes';
import BaseResource from '../../BaseResource';

export default class SubscriptionFeature extends BaseResource {
  static readonly TYPE: 'subscription_feature' = 'subscription_feature';

  /**
   * Get all the subscription features
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
