import * as Utils from '@datocms/rest-client-utils';
import * as SchemaTypes from '../SchemaTypes';
import * as SimpleSchemaTypes from '../SimpleSchemaTypes';
import BaseResource from '../../BaseResource';

export default class AccountSubscription extends BaseResource {
  static readonly TYPE: 'account_subscription' = 'account_subscription';

  /**
   * Create a new subscription
   *
   * @throws {ApiError}
   * @throws {TimeoutError}
   */
  create(body: SimpleSchemaTypes.AccountSubscriptionCreateSchema) {
    return this.rawCreate(
      Utils.serializeRequestBody<SchemaTypes.AccountSubscriptionCreateSchema>(
        body,
        {
          type: 'account_subscription',
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
   *
   * @throws {ApiError}
   * @throws {TimeoutError}
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
   *
   * @throws {ApiError}
   * @throws {TimeoutError}
   */
  simulate(body: SimpleSchemaTypes.AccountSubscriptionSimulateSchema) {
    return this.rawSimulate(
      Utils.serializeRequestBody<SchemaTypes.AccountSubscriptionSimulateSchema>(
        body,
        {
          type: 'account_subscription',
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
   *
   * @throws {ApiError}
   * @throws {TimeoutError}
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
   *
   * @throws {ApiError}
   * @throws {TimeoutError}
   */
  validate(body: SimpleSchemaTypes.AccountSubscriptionValidateSchema) {
    return this.rawValidate(
      Utils.serializeRequestBody<SchemaTypes.AccountSubscriptionValidateSchema>(
        body,
        {
          type: 'account_subscription',
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
   *
   * @throws {ApiError}
   * @throws {TimeoutError}
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
