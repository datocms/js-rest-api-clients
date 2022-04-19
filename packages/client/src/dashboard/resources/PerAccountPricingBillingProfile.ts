import BaseResource from '../BaseResource';
import { serializeRequestBody } from '../../serialize';
import {
  deserializeResponseBody,
  deserializeJsonEntity,
} from '../../deserialize';
import toId from '../../toId';
import * as SchemaTypes from '../SchemaTypes';
import * as SimpleSchemaTypes from '../SimpleSchemaTypes';
import { IteratorOptions, rawPageIterator } from '../../rawPageIterator';

export default class PerAccountPricingBillingProfile extends BaseResource {
  static readonly TYPE: 'per_account_pricing_billing_profile' =
    'per_account_pricing_billing_profile';

  /**
   * Retrieve a billing profile
   */
  find() {
    return this.rawFind().then((body) =>
      deserializeResponseBody<SimpleSchemaTypes.PerAccountPricingBillingProfileSelfTargetSchema>(
        body,
      ),
    );
  }

  /**
   * Retrieve a billing profile
   */
  rawFind(): Promise<SchemaTypes.PerAccountPricingBillingProfileSelfTargetSchema> {
    return this.client.request<SchemaTypes.PerAccountPricingBillingProfileSelfTargetSchema>(
      {
        method: 'GET',
        url: `/per-account-pricing-billing-profile`,
      },
    );
  }

  /**
   * Update a billing profile's credit card
   */
  updateCreditCard(
    body: SimpleSchemaTypes.PerAccountPricingBillingProfileUpdateCreditCardSchema,
  ) {
    return this.rawUpdateCreditCard(
      serializeRequestBody<SchemaTypes.PerAccountPricingBillingProfileUpdateCreditCardSchema>(
        {
          body,
          type: PerAccountPricingBillingProfile.TYPE,
        },
      ),
    ).then((body) =>
      deserializeResponseBody<SimpleSchemaTypes.PerAccountPricingBillingProfileUpdateCreditCardTargetSchema>(
        body,
      ),
    );
  }

  /**
   * Update a billing profile's credit card
   */
  rawUpdateCreditCard(
    body: SchemaTypes.PerAccountPricingBillingProfileUpdateCreditCardSchema,
  ): Promise<SchemaTypes.PerAccountPricingBillingProfileUpdateCreditCardTargetSchema> {
    return this.client.request<SchemaTypes.PerAccountPricingBillingProfileUpdateCreditCardTargetSchema>(
      {
        method: 'PUT',
        url: `/per-account-pricing-billing-profile/credit-card`,
        body,
      },
    );
  }

  /**
   * Update a billing profile's billing information
   */
  updateInfo(
    body: SimpleSchemaTypes.PerAccountPricingBillingProfileUpdateInfoSchema,
  ) {
    return this.rawUpdateInfo(
      serializeRequestBody<SchemaTypes.PerAccountPricingBillingProfileUpdateInfoSchema>(
        {
          body,
          type: PerAccountPricingBillingProfile.TYPE,
        },
      ),
    ).then((body) =>
      deserializeResponseBody<SimpleSchemaTypes.PerAccountPricingBillingProfileUpdateInfoTargetSchema>(
        body,
      ),
    );
  }

  /**
   * Update a billing profile's billing information
   */
  rawUpdateInfo(
    body: SchemaTypes.PerAccountPricingBillingProfileUpdateInfoSchema,
  ): Promise<SchemaTypes.PerAccountPricingBillingProfileUpdateInfoTargetSchema> {
    return this.client.request<SchemaTypes.PerAccountPricingBillingProfileUpdateInfoTargetSchema>(
      {
        method: 'PUT',
        url: `/per-account-pricing-billing-profile/info`,
        body,
      },
    );
  }
}
