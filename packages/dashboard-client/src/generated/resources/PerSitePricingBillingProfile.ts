import * as Utils from '@datocms/rest-client-utils';
import BaseResource from '../../BaseResource';
import type * as ApiTypes from '../ApiTypes';
import type * as RawApiTypes from '../RawApiTypes';

export default class PerSitePricingBillingProfile extends BaseResource {
  static readonly TYPE = 'per_site_pricing_billing_profile' as const;

  /**
   * Retrieve all account's billing profiles
   *
   * @throws {ApiError}
   * @throws {TimeoutError}
   */
  list() {
    return this.rawList().then((body) =>
      Utils.deserializeResponseBody<ApiTypes.PerSitePricingBillingProfileInstancesTargetSchema>(
        body,
      ),
    );
  }

  /**
   * Retrieve all account's billing profiles
   *
   * @throws {ApiError}
   * @throws {TimeoutError}
   */
  rawList(): Promise<RawApiTypes.PerSitePricingBillingProfileInstancesTargetSchema> {
    return this.client.request<RawApiTypes.PerSitePricingBillingProfileInstancesTargetSchema>(
      {
        method: 'GET',
        url: '/per-site-pricing-billing-profiles',
      },
    );
  }

  /**
   * Retrieve a billing profile
   *
   * @throws {ApiError}
   * @throws {TimeoutError}
   */
  find(
    perSitePricingBillingProfileId:
      | string
      | ApiTypes.PerSitePricingBillingProfileData,
    queryParams?: ApiTypes.PerSitePricingBillingProfileSelfHrefSchema,
  ) {
    return this.rawFind(
      Utils.toId(perSitePricingBillingProfileId),
      queryParams,
    ).then((body) =>
      Utils.deserializeResponseBody<ApiTypes.PerSitePricingBillingProfileSelfTargetSchema>(
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
  rawFind(
    perSitePricingBillingProfileId: string,
    queryParams?: RawApiTypes.PerSitePricingBillingProfileSelfHrefSchema,
  ): Promise<RawApiTypes.PerSitePricingBillingProfileSelfTargetSchema> {
    return this.client.request<RawApiTypes.PerSitePricingBillingProfileSelfTargetSchema>(
      {
        method: 'GET',
        url: `/per-site-pricing-billing-profiles/${perSitePricingBillingProfileId}`,
        queryParams,
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
    perSitePricingBillingProfileId:
      | string
      | ApiTypes.PerSitePricingBillingProfileData,
    body: ApiTypes.PerSitePricingBillingProfileUpdateCreditCardSchema,
  ) {
    return this.rawUpdateCreditCard(
      Utils.toId(perSitePricingBillingProfileId),
      Utils.serializeRequestBody<RawApiTypes.PerSitePricingBillingProfileUpdateCreditCardSchema>(
        body,
        {
          type: 'card',
          attributes: ['payment_intent_id'],
          relationships: [],
        },
      ),
    ).then((body) =>
      Utils.deserializeResponseBody<ApiTypes.PerSitePricingBillingProfileUpdateCreditCardTargetSchema>(
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
    perSitePricingBillingProfileId: string,
    body: RawApiTypes.PerSitePricingBillingProfileUpdateCreditCardSchema,
  ): Promise<RawApiTypes.PerSitePricingBillingProfileUpdateCreditCardTargetSchema> {
    return this.client.request<RawApiTypes.PerSitePricingBillingProfileUpdateCreditCardTargetSchema>(
      {
        method: 'PUT',
        url: `/per-site-pricing-billing-profiles/${perSitePricingBillingProfileId}/credit-card`,
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
    perSitePricingBillingProfileId:
      | string
      | ApiTypes.PerSitePricingBillingProfileData,
    body: ApiTypes.PerSitePricingBillingProfileUpdateInfoSchema,
  ) {
    return this.rawUpdateInfo(
      Utils.toId(perSitePricingBillingProfileId),
      Utils.serializeRequestBody<RawApiTypes.PerSitePricingBillingProfileUpdateInfoSchema>(
        body,
        {
          type: 'per_site_pricing_billing_profile',
          attributes: ['billing_profile'],
          relationships: [],
        },
      ),
    ).then((body) =>
      Utils.deserializeResponseBody<ApiTypes.PerSitePricingBillingProfileUpdateInfoTargetSchema>(
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
    perSitePricingBillingProfileId: string,
    body: RawApiTypes.PerSitePricingBillingProfileUpdateInfoSchema,
  ): Promise<RawApiTypes.PerSitePricingBillingProfileUpdateInfoTargetSchema> {
    return this.client.request<RawApiTypes.PerSitePricingBillingProfileUpdateInfoTargetSchema>(
      {
        method: 'PUT',
        url: `/per-site-pricing-billing-profiles/${perSitePricingBillingProfileId}/info`,
        body,
      },
    );
  }

  /**
   * Delete a billing profile
   *
   * @throws {ApiError}
   * @throws {TimeoutError}
   */
  destroy(
    perSitePricingBillingProfileId:
      | string
      | ApiTypes.PerSitePricingBillingProfileData,
  ) {
    return this.rawDestroy(Utils.toId(perSitePricingBillingProfileId)).then(
      (body) =>
        Utils.deserializeResponseBody<ApiTypes.PerSitePricingBillingProfileDestroyTargetSchema>(
          body,
        ),
    );
  }

  /**
   * Delete a billing profile
   *
   * @throws {ApiError}
   * @throws {TimeoutError}
   */
  rawDestroy(
    perSitePricingBillingProfileId: string,
  ): Promise<RawApiTypes.PerSitePricingBillingProfileDestroyTargetSchema> {
    return this.client.request<RawApiTypes.PerSitePricingBillingProfileDestroyTargetSchema>(
      {
        method: 'DELETE',
        url: `/per-site-pricing-billing-profiles/${perSitePricingBillingProfileId}`,
      },
    );
  }
}
