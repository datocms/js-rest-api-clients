import * as Utils from '@datocms/rest-client-utils';
import BaseResource from '../../BaseResource';
import type * as ApiTypes from '../ApiTypes';
import type * as RawApiTypes from '../RawApiTypes';

export default class Invoice extends BaseResource {
  static readonly TYPE = 'invoice' as const;

  /**
   * Retrieve all invoices
   *
   * @throws {ApiError}
   * @throws {TimeoutError}
   */
  perOwnerPricingBillingProfileList() {
    return this.rawPerOwnerPricingBillingProfileList().then((body) =>
      Utils.deserializeResponseBody<ApiTypes.InvoicePerOwnerPricingBillingProfileInstancesTargetSchema>(
        body,
      ),
    );
  }

  /**
   * Retrieve all invoices
   *
   * @throws {ApiError}
   * @throws {TimeoutError}
   */
  rawPerOwnerPricingBillingProfileList(): Promise<RawApiTypes.InvoicePerOwnerPricingBillingProfileInstancesTargetSchema> {
    return this.client.request<RawApiTypes.InvoicePerOwnerPricingBillingProfileInstancesTargetSchema>(
      {
        method: 'GET',
        url: '/per-owner-pricing-billing-profile/invoices',
      },
    );
  }

  /**
   * Retrieve all invoices
   *
   * @throws {ApiError}
   * @throws {TimeoutError}
   */
  perSitePricingBillingProfileList(
    perSitePricingBillingProfileId:
      | string
      | ApiTypes.PerSitePricingBillingProfileData,
  ) {
    return this.rawPerSitePricingBillingProfileList(
      Utils.toId(perSitePricingBillingProfileId),
    ).then((body) =>
      Utils.deserializeResponseBody<ApiTypes.InvoicePerSitePricingBillingProfileInstancesTargetSchema>(
        body,
      ),
    );
  }

  /**
   * Retrieve all invoices
   *
   * @throws {ApiError}
   * @throws {TimeoutError}
   */
  rawPerSitePricingBillingProfileList(
    perSitePricingBillingProfileId: string,
  ): Promise<RawApiTypes.InvoicePerSitePricingBillingProfileInstancesTargetSchema> {
    return this.client.request<RawApiTypes.InvoicePerSitePricingBillingProfileInstancesTargetSchema>(
      {
        method: 'GET',
        url: `/per-site-pricing-billing-profiles/${perSitePricingBillingProfileId}/invoices`,
      },
    );
  }

  /**
   * Collect all unpaid invoices
   *
   * @throws {ApiError}
   * @throws {TimeoutError}
   */
  perOwnerPricingBillingProfileCollectUnpaid(
    body: ApiTypes.InvoicePerOwnerPricingBillingProfileCollectUnpaidSchema,
  ) {
    return this.rawPerOwnerPricingBillingProfileCollectUnpaid(
      Utils.serializeRequestBody<RawApiTypes.InvoicePerOwnerPricingBillingProfileCollectUnpaidSchema>(
        body,
        {
          type: 'invoice_collection',
          attributes: ['payment_intent_id'],
          relationships: [],
        },
      ),
    ).then((body) =>
      Utils.deserializeResponseBody<ApiTypes.InvoicePerOwnerPricingBillingProfileCollectUnpaidTargetSchema>(
        body,
      ),
    );
  }

  /**
   * Collect all unpaid invoices
   *
   * @throws {ApiError}
   * @throws {TimeoutError}
   */
  rawPerOwnerPricingBillingProfileCollectUnpaid(
    body: RawApiTypes.InvoicePerOwnerPricingBillingProfileCollectUnpaidSchema,
  ): Promise<RawApiTypes.InvoicePerOwnerPricingBillingProfileCollectUnpaidTargetSchema> {
    return this.client.request<RawApiTypes.InvoicePerOwnerPricingBillingProfileCollectUnpaidTargetSchema>(
      {
        method: 'POST',
        url: '/per-owner-pricing-billing-profile/invoices/collect-unpaid',
        body,
      },
    );
  }

  /**
   * Collect all unpaid invoices
   *
   * @throws {ApiError}
   * @throws {TimeoutError}
   */
  perSitePricingBillingProfileCollectUnpaid(
    perSitePricingBillingProfileId:
      | string
      | ApiTypes.PerSitePricingBillingProfileData,
    body: ApiTypes.InvoicePerSitePricingBillingProfileCollectUnpaidSchema,
  ) {
    return this.rawPerSitePricingBillingProfileCollectUnpaid(
      Utils.toId(perSitePricingBillingProfileId),
      Utils.serializeRequestBody<RawApiTypes.InvoicePerSitePricingBillingProfileCollectUnpaidSchema>(
        body,
        {
          type: 'invoice_collection',
          attributes: ['payment_intent_id'],
          relationships: [],
        },
      ),
    ).then((body) =>
      Utils.deserializeResponseBody<ApiTypes.InvoicePerSitePricingBillingProfileCollectUnpaidTargetSchema>(
        body,
      ),
    );
  }

  /**
   * Collect all unpaid invoices
   *
   * @throws {ApiError}
   * @throws {TimeoutError}
   */
  rawPerSitePricingBillingProfileCollectUnpaid(
    perSitePricingBillingProfileId: string,
    body: RawApiTypes.InvoicePerSitePricingBillingProfileCollectUnpaidSchema,
  ): Promise<RawApiTypes.InvoicePerSitePricingBillingProfileCollectUnpaidTargetSchema> {
    return this.client.request<RawApiTypes.InvoicePerSitePricingBillingProfileCollectUnpaidTargetSchema>(
      {
        method: 'POST',
        url: `/per-site-pricing-billing-profiles/${perSitePricingBillingProfileId}/invoices/collect-unpaid`,
        body,
      },
    );
  }
}
