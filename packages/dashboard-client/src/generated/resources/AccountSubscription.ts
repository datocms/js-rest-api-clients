import * as Utils from '@datocms/rest-client-utils';
import * as SchemaTypes from '../SchemaTypes';
import * as SimpleSchemaTypes from '../SimpleSchemaTypes';
import BaseResource from '../../BaseResource';

export default class AccountSubscription extends BaseResource {
  static readonly TYPE: 'account_subscription' = 'account_subscription';

  /**
   * Create a new subscription
   */
  create(body: SimpleSchemaTypes.AccountSubscriptionCreateSchema) {
    return this.rawCreate(
      Utils.serializeRequestBody<SchemaTypes.AccountSubscriptionCreateSchema>(
        body,
        {
          type: AccountSubscription.TYPE,
          attributes: ['payment_intent_id', 'recurrence', 'billing_profile'],
          relationships: ['plan'],
        },
      ),
    ).then((body) =>
      Utils.deserializeResponseBody<SimpleSchemaTypes.AccountSubscriptionCreateTargetSchema>(
        body,
      ),
    );
  }

  /**
   * Create a new subscription
   */
  rawCreate(
    body: SchemaTypes.AccountSubscriptionCreateSchema,
  ): Promise<SchemaTypes.AccountSubscriptionCreateTargetSchema> {
    return this.client.request<SchemaTypes.AccountSubscriptionCreateTargetSchema>(
      {
        method: 'POST',
        url: `/account-subscriptions`,
        body,
      },
    );
  }

  /**
   * Simulate
   */
  simulate(body: SimpleSchemaTypes.AccountSubscriptionSimulateSchema) {
    return this.rawSimulate(
      Utils.serializeRequestBody<SchemaTypes.AccountSubscriptionSimulateSchema>(
        body,
        {
          type: AccountSubscription.TYPE,
          attributes: ['recurrence', 'billing_profile'],
          relationships: ['plan'],
        },
      ),
    ).then((body) =>
      Utils.deserializeResponseBody<SimpleSchemaTypes.AccountSubscriptionSimulateTargetSchema>(
        body,
      ),
    );
  }

  /**
   * Simulate
   */
  rawSimulate(
    body: SchemaTypes.AccountSubscriptionSimulateSchema,
  ): Promise<SchemaTypes.AccountSubscriptionSimulateTargetSchema> {
    return this.client.request<SchemaTypes.AccountSubscriptionSimulateTargetSchema>(
      {
        method: 'POST',
        url: `/account-subscriptions/simulate`,
        body,
      },
    );
  }

  /**
   * Validate a new subscription
   */
  validate(body: SimpleSchemaTypes.AccountSubscriptionValidateSchema) {
    return this.rawValidate(
      Utils.serializeRequestBody<SchemaTypes.AccountSubscriptionValidateSchema>(
        body,
        {
          type: AccountSubscription.TYPE,
          attributes: [],
          relationships: ['plan'],
        },
      ),
    ).then((body) =>
      Utils.deserializeResponseBody<SimpleSchemaTypes.AccountSubscriptionValidateTargetSchema>(
        body,
      ),
    );
  }

  /**
   * Validate a new subscription
   */
  rawValidate(
    body: SchemaTypes.AccountSubscriptionValidateSchema,
  ): Promise<SchemaTypes.AccountSubscriptionValidateTargetSchema> {
    return this.client.request<SchemaTypes.AccountSubscriptionValidateTargetSchema>(
      {
        method: 'POST',
        url: `/account-subscriptions/validate`,
        body,
      },
    );
  }
}
