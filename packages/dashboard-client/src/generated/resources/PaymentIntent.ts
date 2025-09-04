import * as Utils from '@datocms/rest-client-utils';
import BaseResource from '../../BaseResource';
import type * as ApiTypes from '../ApiTypes';
import type * as RawApiTypes from '../RawApiTypes';

export default class PaymentIntent extends BaseResource {
  static readonly TYPE = 'payment_intent' as const;

  /**
   * Create a payment intent starting from a payment method
   *
   * @throws {ApiError}
   * @throws {TimeoutError}
   *
   * @deprecated This API call is to be considered private and might change without notice
   */
  createFromPaymentMethod(
    paymentMethodId: string | ApiTypes.PaymentMethodData,
    body: ApiTypes.PaymentIntentCreateFromPaymentMethodSchema,
  ) {
    return this.rawCreateFromPaymentMethod(
      Utils.toId(paymentMethodId),
      Utils.serializeRequestBody<RawApiTypes.PaymentIntentCreateFromPaymentMethodSchema>(
        body,
        {
          type: 'payment_intent',
          attributes: ['amount'],
          relationships: [],
        },
      ),
    ).then((body) =>
      Utils.deserializeResponseBody<ApiTypes.PaymentIntentCreateFromPaymentMethodTargetSchema>(
        body,
      ),
    );
  }

  /**
   * Create a payment intent starting from a payment method
   *
   * @throws {ApiError}
   * @throws {TimeoutError}
   *
   * @deprecated This API call is to be considered private and might change without notice
   */
  rawCreateFromPaymentMethod(
    paymentMethodId: string,
    body: RawApiTypes.PaymentIntentCreateFromPaymentMethodSchema,
  ): Promise<RawApiTypes.PaymentIntentCreateFromPaymentMethodTargetSchema> {
    return this.client.request<RawApiTypes.PaymentIntentCreateFromPaymentMethodTargetSchema>(
      {
        method: 'POST',
        url: `/payment-methods/${paymentMethodId}/payment-intents`,
        body,
      },
    );
  }

  /**
   * Create a payment intent starting from an existing per-site billing profile
   *
   * @throws {ApiError}
   * @throws {TimeoutError}
   *
   * @deprecated This API call is to be considered private and might change without notice
   */
  createForPerSitePricingBillingProfile(
    perSitePricingBillingProfileId:
      | string
      | ApiTypes.PerSitePricingBillingProfileData,
    body: ApiTypes.PaymentIntentCreateForPerSitePricingBillingProfileSchema,
  ) {
    return this.rawCreateForPerSitePricingBillingProfile(
      Utils.toId(perSitePricingBillingProfileId),
      Utils.serializeRequestBody<RawApiTypes.PaymentIntentCreateForPerSitePricingBillingProfileSchema>(
        body,
        {
          type: 'payment_intent',
          attributes: ['amount'],
          relationships: [],
        },
      ),
    ).then((body) =>
      Utils.deserializeResponseBody<ApiTypes.PaymentIntentCreateForPerSitePricingBillingProfileTargetSchema>(
        body,
      ),
    );
  }

  /**
   * Create a payment intent starting from an existing per-site billing profile
   *
   * @throws {ApiError}
   * @throws {TimeoutError}
   *
   * @deprecated This API call is to be considered private and might change without notice
   */
  rawCreateForPerSitePricingBillingProfile(
    perSitePricingBillingProfileId: string,
    body: RawApiTypes.PaymentIntentCreateForPerSitePricingBillingProfileSchema,
  ): Promise<RawApiTypes.PaymentIntentCreateForPerSitePricingBillingProfileTargetSchema> {
    return this.client.request<RawApiTypes.PaymentIntentCreateForPerSitePricingBillingProfileTargetSchema>(
      {
        method: 'POST',
        url: `/per-site-pricing-billing-profiles/${perSitePricingBillingProfileId}/payment-intents`,
        body,
      },
    );
  }

  /**
   * Create a payment intent starting from an existing per-owner billing profile
   *
   * @throws {ApiError}
   * @throws {TimeoutError}
   *
   * @deprecated This API call is to be considered private and might change without notice
   */
  createForPerOwnerPricingBillingProfile(
    body: ApiTypes.PaymentIntentCreateForPerOwnerPricingBillingProfileSchema,
  ) {
    return this.rawCreateForPerOwnerPricingBillingProfile(
      Utils.serializeRequestBody<RawApiTypes.PaymentIntentCreateForPerOwnerPricingBillingProfileSchema>(
        body,
        {
          type: 'payment_intent',
          attributes: ['amount'],
          relationships: [],
        },
      ),
    ).then((body) =>
      Utils.deserializeResponseBody<ApiTypes.PaymentIntentCreateForPerOwnerPricingBillingProfileTargetSchema>(
        body,
      ),
    );
  }

  /**
   * Create a payment intent starting from an existing per-owner billing profile
   *
   * @throws {ApiError}
   * @throws {TimeoutError}
   *
   * @deprecated This API call is to be considered private and might change without notice
   */
  rawCreateForPerOwnerPricingBillingProfile(
    body: RawApiTypes.PaymentIntentCreateForPerOwnerPricingBillingProfileSchema,
  ): Promise<RawApiTypes.PaymentIntentCreateForPerOwnerPricingBillingProfileTargetSchema> {
    return this.client.request<RawApiTypes.PaymentIntentCreateForPerOwnerPricingBillingProfileTargetSchema>(
      {
        method: 'POST',
        url: '/per-owner-pricing-billing-profile/payment-intents',
        body,
      },
    );
  }

  /**
   * Confirm a payment intent
   *
   * @throws {ApiError}
   * @throws {TimeoutError}
   *
   * @deprecated This API call is to be considered private and might change without notice
   */
  confirm(paymentIntentId: string | ApiTypes.PaymentIntentData) {
    return this.rawConfirm(Utils.toId(paymentIntentId)).then((body) =>
      Utils.deserializeResponseBody<ApiTypes.PaymentIntentConfirmTargetSchema>(
        body,
      ),
    );
  }

  /**
   * Confirm a payment intent
   *
   * @throws {ApiError}
   * @throws {TimeoutError}
   *
   * @deprecated This API call is to be considered private and might change without notice
   */
  rawConfirm(
    paymentIntentId: string,
  ): Promise<RawApiTypes.PaymentIntentConfirmTargetSchema> {
    return this.client.request<RawApiTypes.PaymentIntentConfirmTargetSchema>({
      method: 'PUT',
      url: `/payment-intents/${paymentIntentId}/confirm`,
    });
  }
}
