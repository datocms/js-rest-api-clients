import * as Utils from '@datocms/rest-client-utils';
import BaseResource from '../../BaseResource';
import type * as ApiTypes from '../ApiTypes';
import type * as RawApiTypes from '../RawApiTypes';

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
    body: RawApiTypes.SiteSubscriptionCreateSchema,
  ): Promise<RawApiTypes.SiteSubscriptionCreateTargetSchema> {
    return this.client.request<RawApiTypes.SiteSubscriptionCreateTargetSchema>({
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
    body: RawApiTypes.SiteSubscriptionSimulateSchema,
  ): Promise<RawApiTypes.SiteSubscriptionSimulateTargetSchema> {
    return this.client.request<RawApiTypes.SiteSubscriptionSimulateTargetSchema>(
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
    siteId: string | ApiTypes.SiteData,
    body: ApiTypes.SiteSubscriptionValidateSchema,
  ) {
    return this.rawValidate(
      Utils.toId(siteId),
      Utils.serializeRequestBody<RawApiTypes.SiteSubscriptionValidateSchema>(
        body,
        {
          type: 'site_subscription',
          attributes: ['extra_packets', 'ignore_content', 'is_duplicate'],
          relationships: ['plan'],
        },
      ),
    ).then((body) =>
      Utils.deserializeResponseBody<ApiTypes.SiteSubscriptionValidateTargetSchema>(
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
    body: RawApiTypes.SiteSubscriptionValidateSchema,
  ): Promise<RawApiTypes.SiteSubscriptionValidateTargetSchema> {
    return this.client.request<RawApiTypes.SiteSubscriptionValidateTargetSchema>(
      {
        method: 'POST',
        url: `/sites/${siteId}/subscriptions/validate`,
        body,
      },
    );
  }
}
