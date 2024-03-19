import * as Utils from '@datocms/rest-client-utils';
import BaseResource from '../../BaseResource';
import * as SchemaTypes from '../SchemaTypes';
import * as SimpleSchemaTypes from '../SimpleSchemaTypes';

export default class SiteSubscription extends BaseResource {
  static readonly TYPE = 'site_subscription' as const;

  /**
   * Create a new subscription
   *
   * @throws {ApiError}
   * @throws {TimeoutError}
   */
  rawCreate(
    siteId: string,
    body: SchemaTypes.SiteSubscriptionCreateSchema,
  ): Promise<SchemaTypes.SiteSubscriptionCreateTargetSchema> {
    return this.client.request<SchemaTypes.SiteSubscriptionCreateTargetSchema>({
      method: 'POST',
      url: `/sites/${siteId}/subscriptions`,
      body,
    });
  }

  /**
   * Simulate
   *
   * @throws {ApiError}
   * @throws {TimeoutError}
   */
  rawSimulate(
    siteId: string,
    body: SchemaTypes.SiteSubscriptionSimulateSchema,
  ): Promise<SchemaTypes.SiteSubscriptionSimulateTargetSchema> {
    return this.client.request<SchemaTypes.SiteSubscriptionSimulateTargetSchema>(
      {
        method: 'POST',
        url: `/sites/${siteId}/subscriptions/simulate`,
        body,
      },
    );
  }

  /**
   * Validate a new subscription
   *
   * @throws {ApiError}
   * @throws {TimeoutError}
   */
  validate(
    siteId: string | SimpleSchemaTypes.SiteData,
    body: SimpleSchemaTypes.SiteSubscriptionValidateSchema,
  ) {
    return this.rawValidate(
      Utils.toId(siteId),
      Utils.serializeRequestBody<SchemaTypes.SiteSubscriptionValidateSchema>(
        body,
        {
          type: 'site_subscription',
          attributes: ['extra_packets', 'ignore_content', 'is_duplicate'],
          relationships: ['plan'],
        },
      ),
    ).then((body) =>
      Utils.deserializeResponseBody<SimpleSchemaTypes.SiteSubscriptionValidateTargetSchema>(
        body,
      ),
    );
  }

  /**
   * Validate a new subscription
   *
   * @throws {ApiError}
   * @throws {TimeoutError}
   */
  rawValidate(
    siteId: string,
    body: SchemaTypes.SiteSubscriptionValidateSchema,
  ): Promise<SchemaTypes.SiteSubscriptionValidateTargetSchema> {
    return this.client.request<SchemaTypes.SiteSubscriptionValidateTargetSchema>(
      {
        method: 'POST',
        url: `/sites/${siteId}/subscriptions/validate`,
        body,
      },
    );
  }
}
