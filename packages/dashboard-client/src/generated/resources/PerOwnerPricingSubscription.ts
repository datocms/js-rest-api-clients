import * as Utils from '@datocms/rest-client-utils';
import BaseResource from '../../BaseResource';
import * as SchemaTypes from '../SchemaTypes';
import * as SimpleSchemaTypes from '../SimpleSchemaTypes';

export default class PerOwnerPricingSubscription extends BaseResource {
  static readonly TYPE = 'per_owner_pricing_subscription' as const;

  /**
   * Create a new subscription
   *
   * @throws {ApiError}
   * @throws {TimeoutError}
   */
  create(body: SimpleSchemaTypes.PerOwnerPricingSubscriptionCreateSchema) {
    return this.rawCreate(
      Utils.serializeRequestBody<SchemaTypes.PerOwnerPricingSubscriptionCreateSchema>(
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
      Utils.deserializeResponseBody<SimpleSchemaTypes.PerOwnerPricingSubscriptionCreateTargetSchema>(
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
    body: SchemaTypes.PerOwnerPricingSubscriptionCreateSchema,
  ): Promise<SchemaTypes.PerOwnerPricingSubscriptionCreateTargetSchema> {
    return this.client.request<SchemaTypes.PerOwnerPricingSubscriptionCreateTargetSchema>(
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
  simulate(body: SimpleSchemaTypes.PerOwnerPricingSubscriptionSimulateSchema) {
    return this.rawSimulate(
      Utils.serializeRequestBody<SchemaTypes.PerOwnerPricingSubscriptionSimulateSchema>(
        body,
        {
          type: 'per_owner_pricing_subscription',
          attributes: ['recurrence', 'billing_profile'],
          relationships: ['plan'],
        },
      ),
    ).then((body) =>
      Utils.deserializeResponseBody<SimpleSchemaTypes.PerOwnerPricingSubscriptionSimulateTargetSchema>(
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
    body: SchemaTypes.PerOwnerPricingSubscriptionSimulateSchema,
  ): Promise<SchemaTypes.PerOwnerPricingSubscriptionSimulateTargetSchema> {
    return this.client.request<SchemaTypes.PerOwnerPricingSubscriptionSimulateTargetSchema>(
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
  validate(body: SimpleSchemaTypes.PerOwnerPricingSubscriptionValidateSchema) {
    return this.rawValidate(
      Utils.serializeRequestBody<SchemaTypes.PerOwnerPricingSubscriptionValidateSchema>(
        body,
        {
          type: 'per_owner_pricing_subscription',
          attributes: [],
          relationships: ['plan'],
        },
      ),
    ).then((body) =>
      Utils.deserializeResponseBody<SimpleSchemaTypes.PerOwnerPricingSubscriptionValidateTargetSchema>(
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
    body: SchemaTypes.PerOwnerPricingSubscriptionValidateSchema,
  ): Promise<SchemaTypes.PerOwnerPricingSubscriptionValidateTargetSchema> {
    return this.client.request<SchemaTypes.PerOwnerPricingSubscriptionValidateTargetSchema>(
      {
        method: 'POST',
        url: '/per-owner-pricing-subscriptions/validate',
        body,
      },
    );
  }
}
