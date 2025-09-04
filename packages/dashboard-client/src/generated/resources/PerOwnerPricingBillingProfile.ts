import * as Utils from '@datocms/rest-client-utils';
import BaseResource from '../../BaseResource';
import type * as ApiTypes from '../ApiTypes';
import type * as RawApiTypes from '../RawApiTypes';

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
      Utils.deserializeResponseBody<ApiTypes.PerOwnerPricingBillingProfileSelfTargetSchema>(
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
  rawFind(): Promise<RawApiTypes.PerOwnerPricingBillingProfileSelfTargetSchema> {
    return this.client.request<RawApiTypes.PerOwnerPricingBillingProfileSelfTargetSchema>(
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
    body: ApiTypes.PerOwnerPricingBillingProfileUpdateCreditCardSchema,
  ) {
    return this.rawUpdateCreditCard(
      Utils.serializeRequestBody<RawApiTypes.PerOwnerPricingBillingProfileUpdateCreditCardSchema>(
        body,
        {
          type: 'card',
          attributes: ['payment_intent_id'],
          relationships: [],
        },
      ),
    ).then((body) =>
      Utils.deserializeResponseBody<ApiTypes.PerOwnerPricingBillingProfileUpdateCreditCardTargetSchema>(
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
    body: RawApiTypes.PerOwnerPricingBillingProfileUpdateCreditCardSchema,
  ): Promise<RawApiTypes.PerOwnerPricingBillingProfileUpdateCreditCardTargetSchema> {
    return this.client.request<RawApiTypes.PerOwnerPricingBillingProfileUpdateCreditCardTargetSchema>(
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
  updateInfo(body: ApiTypes.PerOwnerPricingBillingProfileUpdateInfoSchema) {
    return this.rawUpdateInfo(
      Utils.serializeRequestBody<RawApiTypes.PerOwnerPricingBillingProfileUpdateInfoSchema>(
        body,
        {
          type: 'per_owner_pricing_billing_profile',
          attributes: ['billing_profile'],
          relationships: [],
        },
      ),
    ).then((body) =>
      Utils.deserializeResponseBody<ApiTypes.PerOwnerPricingBillingProfileUpdateInfoTargetSchema>(
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
    body: RawApiTypes.PerOwnerPricingBillingProfileUpdateInfoSchema,
  ): Promise<RawApiTypes.PerOwnerPricingBillingProfileUpdateInfoTargetSchema> {
    return this.client.request<RawApiTypes.PerOwnerPricingBillingProfileUpdateInfoTargetSchema>(
      {
        method: 'PUT',
        url: '/per-owner-pricing-billing-profile/info',
        body,
      },
    );
  }
}
