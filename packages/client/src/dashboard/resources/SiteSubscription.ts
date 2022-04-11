import BaseResource from '../BaseResource';
import serializeRequestBody from '../../serializeRequestBody';
import deserializeResponseBody from '../../deserializeResponseBody';
import toId from '../../toId';
import * as SchemaTypes from '../SchemaTypes';
import * as SimpleSchemaTypes from '../SimpleSchemaTypes';

export default class SiteSubscription extends BaseResource {
  static readonly TYPE: 'site_subscription' = 'site_subscription';

  /**
   * Create a new subscription
   */
  create(
    siteId: string | SimpleSchemaTypes.SiteSubscriptionData,
    body: SimpleSchemaTypes.SiteSubscriptionCreateSchema,
  ) {
    return this.rawCreate(
      toId(siteId),
      serializeRequestBody<SchemaTypes.SiteSubscriptionCreateSchema>({
        body,
        type: SiteSubscription.TYPE,
      }),
    ).then((body) =>
      deserializeResponseBody<SimpleSchemaTypes.SiteSubscriptionCreateTargetSchema>(
        body,
      ),
    );
  }

  /**
   * Create a new subscription
   */
  rawCreate(
    siteId: string,
    body: SchemaTypes.SiteSubscriptionCreateSchema,
  ): Promise<SchemaTypes.SiteSubscriptionCreateTargetSchema> {
    return this.client.request<SchemaTypes.SiteSubscriptionCreateTargetSchema>({
      method: 'POST',
      url: `/sites/${siteId}/subscriptions`,
      body,
    });
  }

  /**
   * Simulate
   */
  simulate(
    siteId: string | SimpleSchemaTypes.SiteSubscriptionData,
    body: SimpleSchemaTypes.SiteSubscriptionSimulateSchema,
  ) {
    return this.rawSimulate(
      toId(siteId),
      serializeRequestBody<SchemaTypes.SiteSubscriptionSimulateSchema>({
        body,
        type: SiteSubscription.TYPE,
      }),
    ).then((body) =>
      deserializeResponseBody<SimpleSchemaTypes.SiteSubscriptionSimulateTargetSchema>(
        body,
      ),
    );
  }

  /**
   * Simulate
   */
  rawSimulate(
    siteId: string,
    body: SchemaTypes.SiteSubscriptionSimulateSchema,
  ): Promise<SchemaTypes.SiteSubscriptionSimulateTargetSchema> {
    return this.client.request<SchemaTypes.SiteSubscriptionSimulateTargetSchema>(
      {
        method: 'POST',
        url: `/sites/${siteId}/subscriptions/simulate`,
        body,
      },
    );
  }

  /**
   * Validate a new subscription
   */
  validate(
    siteId: string | SimpleSchemaTypes.SiteSubscriptionData,
    body: SimpleSchemaTypes.SiteSubscriptionValidateSchema,
  ) {
    return this.rawValidate(
      toId(siteId),
      serializeRequestBody<SchemaTypes.SiteSubscriptionValidateSchema>({
        body,
        type: SiteSubscription.TYPE,
      }),
    ).then((body) =>
      deserializeResponseBody<SimpleSchemaTypes.SiteSubscriptionValidateTargetSchema>(
        body,
      ),
    );
  }

  /**
   * Validate a new subscription
   */
  rawValidate(
    siteId: string,
    body: SchemaTypes.SiteSubscriptionValidateSchema,
  ): Promise<SchemaTypes.SiteSubscriptionValidateTargetSchema> {
    return this.client.request<SchemaTypes.SiteSubscriptionValidateTargetSchema>(
      {
        method: 'POST',
        url: `/sites/${siteId}/subscriptions/validate`,
        body,
      },
    );
  }
}
