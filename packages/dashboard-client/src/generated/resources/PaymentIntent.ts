import * as Utils from '@datocms/rest-client-utils';
import * as SchemaTypes from '../SchemaTypes';
import * as SimpleSchemaTypes from '../SimpleSchemaTypes';
import BaseResource from '../../BaseResource';

export default class PaymentIntent extends BaseResource {
  static readonly TYPE: 'payment_intent' = 'payment_intent';

  /**
   * Create a payment intent starting from a payment method
   *
   * @throws {ApiError}
   * @throws {TimeoutError}
   *
   * @deprecated This API call is to be considered private and might change without notice
   */
  createFromPaymentMethod(
    paymentMethodId: string | SimpleSchemaTypes.PaymentMethodData,
    body: SimpleSchemaTypes.PaymentIntentCreateFromPaymentMethodSchema,
  ) {
    return this.rawCreateFromPaymentMethod(
      Utils.toId(paymentMethodId),
      Utils.serializeRequestBody<SchemaTypes.PaymentIntentCreateFromPaymentMethodSchema>(
        body,
        {
          type: 'payment_intent',
          attributes: ['amount'],
          relationships: [],
        },
      ),
    ).then((body) =>
      Utils.deserializeResponseBody<SimpleSchemaTypes.PaymentIntentCreateFromPaymentMethodTargetSchema>(
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
    body: SchemaTypes.PaymentIntentCreateFromPaymentMethodSchema,
  ): Promise<SchemaTypes.PaymentIntentCreateFromPaymentMethodTargetSchema> {
    return this.client.request<SchemaTypes.PaymentIntentCreateFromPaymentMethodTargetSchema>(
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
      | SimpleSchemaTypes.PerSitePricingBillingProfileData,
    body: SimpleSchemaTypes.PaymentIntentCreateForPerSitePricingBillingProfileSchema,
  ) {
    return this.rawCreateForPerSitePricingBillingProfile(
      Utils.toId(perSitePricingBillingProfileId),
      Utils.serializeRequestBody<SchemaTypes.PaymentIntentCreateForPerSitePricingBillingProfileSchema>(
        body,
        {
          type: 'payment_intent',
          attributes: ['amount'],
          relationships: [],
        },
      ),
    ).then((body) =>
      Utils.deserializeResponseBody<SimpleSchemaTypes.PaymentIntentCreateForPerSitePricingBillingProfileTargetSchema>(
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
    body: SchemaTypes.PaymentIntentCreateForPerSitePricingBillingProfileSchema,
  ): Promise<SchemaTypes.PaymentIntentCreateForPerSitePricingBillingProfileTargetSchema> {
    return this.client.request<SchemaTypes.PaymentIntentCreateForPerSitePricingBillingProfileTargetSchema>(
      {
        method: 'POST',
        url: `/per-site-pricing-billing-profiles/${perSitePricingBillingProfileId}/payment-intents`,
        body,
      },
    );
  }

  /**
   * Create a payment intent starting from an existing per-account billing profile
   *
   * @throws {ApiError}
   * @throws {TimeoutError}
   *
   * @deprecated This API call is to be considered private and might change without notice
   */
  createForPerAccountPricingBillingProfile(
    body: SimpleSchemaTypes.PaymentIntentCreateForPerAccountPricingBillingProfileSchema,
  ) {
    return this.rawCreateForPerAccountPricingBillingProfile(
      Utils.serializeRequestBody<SchemaTypes.PaymentIntentCreateForPerAccountPricingBillingProfileSchema>(
        body,
        {
          type: 'payment_intent',
          attributes: ['amount'],
          relationships: [],
        },
      ),
    ).then((body) =>
      Utils.deserializeResponseBody<SimpleSchemaTypes.PaymentIntentCreateForPerAccountPricingBillingProfileTargetSchema>(
        body,
      ),
    );
  }

  /**
   * Create a payment intent starting from an existing per-account billing profile
   *
   * @throws {ApiError}
   * @throws {TimeoutError}
   *
   * @deprecated This API call is to be considered private and might change without notice
   */
  rawCreateForPerAccountPricingBillingProfile(
    body: SchemaTypes.PaymentIntentCreateForPerAccountPricingBillingProfileSchema,
  ): Promise<SchemaTypes.PaymentIntentCreateForPerAccountPricingBillingProfileTargetSchema> {
    return this.client.request<SchemaTypes.PaymentIntentCreateForPerAccountPricingBillingProfileTargetSchema>(
      {
        method: 'POST',
        url: '/per-account-pricing-billing-profile/payment-intents',
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
  confirm(paymentIntentId: string | SimpleSchemaTypes.PaymentIntentData) {
    return this.rawConfirm(Utils.toId(paymentIntentId)).then((body) =>
      Utils.deserializeResponseBody<SimpleSchemaTypes.PaymentIntentConfirmTargetSchema>(
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
  ): Promise<SchemaTypes.PaymentIntentConfirmTargetSchema> {
    return this.client.request<SchemaTypes.PaymentIntentConfirmTargetSchema>({
      method: 'POST',
      url: `/payment-intents/${paymentIntentId}/confirm`,
    });
  }
}
