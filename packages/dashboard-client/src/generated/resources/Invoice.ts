import * as Utils from '@datocms/rest-client-utils';
import * as SchemaTypes from '../SchemaTypes';
import * as SimpleSchemaTypes from '../SimpleSchemaTypes';
import BaseResource from '../../BaseResource';

export default class Invoice extends BaseResource {
  static readonly TYPE: 'invoice' = 'invoice';

  /**
   * Retrieve all invoices
   *
   * @throws {ApiError}
   * @throws {TimeoutError}
   */
  perOwnerPricingBillingProfileList() {
    return this.rawPerOwnerPricingBillingProfileList().then((body) =>
      Utils.deserializeResponseBody<SimpleSchemaTypes.InvoicePerOwnerPricingBillingProfileInstancesTargetSchema>(
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
  rawPerOwnerPricingBillingProfileList(): Promise<SchemaTypes.InvoicePerOwnerPricingBillingProfileInstancesTargetSchema> {
    return this.client.request<SchemaTypes.InvoicePerOwnerPricingBillingProfileInstancesTargetSchema>(
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
      | SimpleSchemaTypes.PerSitePricingBillingProfileData,
  ) {
    return this.rawPerSitePricingBillingProfileList(
      Utils.toId(perSitePricingBillingProfileId),
    ).then((body) =>
      Utils.deserializeResponseBody<SimpleSchemaTypes.InvoicePerSitePricingBillingProfileInstancesTargetSchema>(
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
  ): Promise<SchemaTypes.InvoicePerSitePricingBillingProfileInstancesTargetSchema> {
    return this.client.request<SchemaTypes.InvoicePerSitePricingBillingProfileInstancesTargetSchema>(
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
    body: SimpleSchemaTypes.InvoicePerOwnerPricingBillingProfileCollectUnpaidSchema,
  ) {
    return this.rawPerOwnerPricingBillingProfileCollectUnpaid(
      Utils.serializeRequestBody<SchemaTypes.InvoicePerOwnerPricingBillingProfileCollectUnpaidSchema>(
        body,
        {
          type: 'invoice_collection',
          attributes: ['payment_intent_id'],
          relationships: [],
        },
      ),
    ).then((body) =>
      Utils.deserializeResponseBody<SimpleSchemaTypes.InvoicePerOwnerPricingBillingProfileCollectUnpaidTargetSchema>(
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
    body: SchemaTypes.InvoicePerOwnerPricingBillingProfileCollectUnpaidSchema,
  ): Promise<SchemaTypes.InvoicePerOwnerPricingBillingProfileCollectUnpaidTargetSchema> {
    return this.client.request<SchemaTypes.InvoicePerOwnerPricingBillingProfileCollectUnpaidTargetSchema>(
      {
        method: 'GET',
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
      | SimpleSchemaTypes.PerSitePricingBillingProfileData,
    body: SimpleSchemaTypes.InvoicePerSitePricingBillingProfileCollectUnpaidSchema,
  ) {
    return this.rawPerSitePricingBillingProfileCollectUnpaid(
      Utils.toId(perSitePricingBillingProfileId),
      Utils.serializeRequestBody<SchemaTypes.InvoicePerSitePricingBillingProfileCollectUnpaidSchema>(
        body,
        {
          type: 'invoice_collection',
          attributes: ['payment_intent_id'],
          relationships: [],
        },
      ),
    ).then((body) =>
      Utils.deserializeResponseBody<SimpleSchemaTypes.InvoicePerSitePricingBillingProfileCollectUnpaidTargetSchema>(
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
    body: SchemaTypes.InvoicePerSitePricingBillingProfileCollectUnpaidSchema,
  ): Promise<SchemaTypes.InvoicePerSitePricingBillingProfileCollectUnpaidTargetSchema> {
    return this.client.request<SchemaTypes.InvoicePerSitePricingBillingProfileCollectUnpaidTargetSchema>(
      {
        method: 'GET',
        url: `/per-site-pricing-billing-profiles/${perSitePricingBillingProfileId}/invoices/collect-unpaid`,
        body,
      },
    );
  }
}
