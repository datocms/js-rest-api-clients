import * as Utils from '@datocms/rest-client-utils';
import BaseResource from '../../BaseResource';
import type * as ApiTypes from '../ApiTypes';
import type * as RawApiTypes from '../RawApiTypes';

export default class PerOwnerPricingSubscription extends BaseResource {
  static readonly TYPE = 'per_owner_pricing_subscription' as const;

  /**
   * Create a new subscription
   *
   * @throws {ApiError}
   * @throws {TimeoutError}
   */
  create(body: ApiTypes.PerOwnerPricingSubscriptionCreateSchema) {
    return this.rawCreate(
      Utils.serializeRequestBody<RawApiTypes.PerOwnerPricingSubscriptionCreateSchema>(
        body,
        {
          type: 'per_owner_pricing_subscription',
          attributes: [
            'payment_intent_id',
            'recurrence',
            'billing_profile',
            'downgrade_reason',
          ],
          relationships: ['plan'],
        },
      ),
    ).then((body) =>
      Utils.deserializeResponseBody<ApiTypes.PerOwnerPricingSubscriptionCreateTargetSchema>(
        body,
      ),
    );
  }

  /**
   * Create a new subscription
   *
   * @throws {ApiError}
   * @throws {TimeoutError}
   */
  rawCreate(
    body: RawApiTypes.PerOwnerPricingSubscriptionCreateSchema,
  ): Promise<RawApiTypes.PerOwnerPricingSubscriptionCreateTargetSchema> {
    return this.client.request<RawApiTypes.PerOwnerPricingSubscriptionCreateTargetSchema>(
      {
        method: 'POST',
        url: '/per-owner-pricing-subscriptions',
        body,
      },
    );
  }

  /**
   * Simulate
   *
   * @throws {ApiError}
   * @throws {TimeoutError}
   */
  simulate(body: ApiTypes.PerOwnerPricingSubscriptionSimulateSchema) {
    return this.rawSimulate(
      Utils.serializeRequestBody<RawApiTypes.PerOwnerPricingSubscriptionSimulateSchema>(
        body,
        {
          type: 'per_owner_pricing_subscription',
          attributes: ['recurrence', 'billing_profile'],
          relationships: ['plan'],
        },
      ),
    ).then((body) =>
      Utils.deserializeResponseBody<ApiTypes.PerOwnerPricingSubscriptionSimulateTargetSchema>(
        body,
      ),
    );
  }

  /**
   * Simulate
   *
   * @throws {ApiError}
   * @throws {TimeoutError}
   */
  rawSimulate(
    body: RawApiTypes.PerOwnerPricingSubscriptionSimulateSchema,
  ): Promise<RawApiTypes.PerOwnerPricingSubscriptionSimulateTargetSchema> {
    return this.client.request<RawApiTypes.PerOwnerPricingSubscriptionSimulateTargetSchema>(
      {
        method: 'POST',
        url: '/per-owner-pricing-subscriptions/simulate',
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
  validate(body: ApiTypes.PerOwnerPricingSubscriptionValidateSchema) {
    return this.rawValidate(
      Utils.serializeRequestBody<RawApiTypes.PerOwnerPricingSubscriptionValidateSchema>(
        body,
        {
          type: 'per_owner_pricing_subscription',
          attributes: [],
          relationships: ['plan'],
        },
      ),
    ).then((body) =>
      Utils.deserializeResponseBody<ApiTypes.PerOwnerPricingSubscriptionValidateTargetSchema>(
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
    body: RawApiTypes.PerOwnerPricingSubscriptionValidateSchema,
  ): Promise<RawApiTypes.PerOwnerPricingSubscriptionValidateTargetSchema> {
    return this.client.request<RawApiTypes.PerOwnerPricingSubscriptionValidateTargetSchema>(
      {
        method: 'POST',
        url: '/per-owner-pricing-subscriptions/validate',
        body,
      },
    );
  }
}
