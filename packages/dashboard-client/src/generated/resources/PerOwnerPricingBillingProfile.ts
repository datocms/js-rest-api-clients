import * as Utils from '@datocms/rest-client-utils';
import BaseResource from '../../BaseResource';
import type * as SchemaTypes from '../SchemaTypes';
import type * as SimpleSchemaTypes from '../SimpleSchemaTypes';

export default class PerOwnerPricingBillingProfile extends BaseResource {
  static readonly TYPE = 'per_owner_pricing_billing_profile' as const;

  /**
   * Retrieve a billing profile
   *
   * @throws {ApiError}
   * @throws {TimeoutError}
   */
  find() {
    return this.rawFind().then((body) =>
      Utils.deserializeResponseBody<SimpleSchemaTypes.PerOwnerPricingBillingProfileSelfTargetSchema>(
        body,
      ),
    );
  }

  /**
   * Retrieve a billing profile
   *
   * @throws {ApiError}
   * @throws {TimeoutError}
   */
  rawFind(): Promise<SchemaTypes.PerOwnerPricingBillingProfileSelfTargetSchema> {
    return this.client.request<SchemaTypes.PerOwnerPricingBillingProfileSelfTargetSchema>(
      {
        method: 'GET',
        url: '/per-owner-pricing-billing-profile',
      },
    );
  }

  /**
   * Update a billing profile's credit card
   *
   * @throws {ApiError}
   * @throws {TimeoutError}
   */
  updateCreditCard(
    body: SimpleSchemaTypes.PerOwnerPricingBillingProfileUpdateCreditCardSchema,
  ) {
    return this.rawUpdateCreditCard(
      Utils.serializeRequestBody<SchemaTypes.PerOwnerPricingBillingProfileUpdateCreditCardSchema>(
        body,
        {
          type: 'card',
          attributes: ['payment_intent_id'],
          relationships: [],
        },
      ),
    ).then((body) =>
      Utils.deserializeResponseBody<SimpleSchemaTypes.PerOwnerPricingBillingProfileUpdateCreditCardTargetSchema>(
        body,
      ),
    );
  }

  /**
   * Update a billing profile's credit card
   *
   * @throws {ApiError}
   * @throws {TimeoutError}
   */
  rawUpdateCreditCard(
    body: SchemaTypes.PerOwnerPricingBillingProfileUpdateCreditCardSchema,
  ): Promise<SchemaTypes.PerOwnerPricingBillingProfileUpdateCreditCardTargetSchema> {
    return this.client.request<SchemaTypes.PerOwnerPricingBillingProfileUpdateCreditCardTargetSchema>(
      {
        method: 'PUT',
        url: '/per-owner-pricing-billing-profile/credit-card',
        body,
      },
    );
  }

  /**
   * Update a billing profile's billing information
   *
   * @throws {ApiError}
   * @throws {TimeoutError}
   */
  updateInfo(
    body: SimpleSchemaTypes.PerOwnerPricingBillingProfileUpdateInfoSchema,
  ) {
    return this.rawUpdateInfo(
      Utils.serializeRequestBody<SchemaTypes.PerOwnerPricingBillingProfileUpdateInfoSchema>(
        body,
        {
          type: 'per_owner_pricing_billing_profile',
          attributes: ['billing_profile'],
          relationships: [],
        },
      ),
    ).then((body) =>
      Utils.deserializeResponseBody<SimpleSchemaTypes.PerOwnerPricingBillingProfileUpdateInfoTargetSchema>(
        body,
      ),
    );
  }

  /**
   * Update a billing profile's billing information
   *
   * @throws {ApiError}
   * @throws {TimeoutError}
   */
  rawUpdateInfo(
    body: SchemaTypes.PerOwnerPricingBillingProfileUpdateInfoSchema,
  ): Promise<SchemaTypes.PerOwnerPricingBillingProfileUpdateInfoTargetSchema> {
    return this.client.request<SchemaTypes.PerOwnerPricingBillingProfileUpdateInfoTargetSchema>(
      {
        method: 'PUT',
        url: '/per-owner-pricing-billing-profile/info',
        body,
      },
    );
  }
}
