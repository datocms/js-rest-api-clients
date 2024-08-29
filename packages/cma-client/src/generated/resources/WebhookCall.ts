import * as Utils from '@datocms/rest-client-utils';
import BaseResource from '../../BaseResource';
import type * as SchemaTypes from '../SchemaTypes';
import type * as SimpleSchemaTypes from '../SimpleSchemaTypes';

export default class WebhookCall extends BaseResource {
  static readonly TYPE = 'webhook_call' as const;

  /**
   * List all webhooks calls
   *
   * Read more: https://www.datocms.com/docs/content-management-api/resources/webhook-call/instances
   *
   * @throws {ApiError}
   * @throws {TimeoutError}
   */
  list(queryParams?: SimpleSchemaTypes.WebhookCallInstancesHrefSchema) {
    return this.rawList(queryParams).then((body) =>
      Utils.deserializeResponseBody<SimpleSchemaTypes.WebhookCallInstancesTargetSchema>(
        body,
      ),
    );
  }

  /**
   * List all webhooks calls
   *
   * Read more: https://www.datocms.com/docs/content-management-api/resources/webhook-call/instances
   *
   * @throws {ApiError}
   * @throws {TimeoutError}
   */
  rawList(
    queryParams?: SchemaTypes.WebhookCallInstancesHrefSchema,
  ): Promise<SchemaTypes.WebhookCallInstancesTargetSchema> {
    return this.client.request<SchemaTypes.WebhookCallInstancesTargetSchema>({
      method: 'GET',
      url: '/webhook_calls',
      queryParams,
    });
  }

  /**
   * Async iterator to auto-paginate over elements returned by list()
   *
   * Read more: https://www.datocms.com/docs/content-management-api/resources/webhook-call/instances
   *
   * @throws {ApiError}
   * @throws {TimeoutError}
   */
  async *listPagedIterator(
    queryParams?: Utils.OmitFromKnownKeys<
      SimpleSchemaTypes.WebhookCallInstancesHrefSchema,
      'page'
    >,
    iteratorOptions?: Utils.IteratorOptions,
  ) {
    for await (const element of this.rawListPagedIterator(
      queryParams,
      iteratorOptions,
    )) {
      yield Utils.deserializeJsonEntity<
        SimpleSchemaTypes.WebhookCallInstancesTargetSchema[0]
      >(element);
    }
  }

  /**
   * Async iterator to auto-paginate over elements returned by rawList()
   *
   * Read more: https://www.datocms.com/docs/content-management-api/resources/webhook-call/instances
   *
   * @throws {ApiError}
   * @throws {TimeoutError}
   */
  rawListPagedIterator(
    queryParams?: Utils.OmitFromKnownKeys<
      SchemaTypes.WebhookCallInstancesHrefSchema,
      'page'
    >,
    iteratorOptions?: Utils.IteratorOptions,
  ) {
    Utils.warnOnPageQueryParam(queryParams);

    return Utils.rawPageIterator<
      SchemaTypes.WebhookCallInstancesTargetSchema['data'][0]
    >(
      {
        defaultLimit: 30,
        maxLimit: 500,
      },
      (page: SchemaTypes.WebhookCallInstancesHrefSchema['page']) =>
        this.rawList({ ...queryParams, page }),
      iteratorOptions,
    );
  }

  /**
   * Retrieve a webhook call
   *
   * Read more: https://www.datocms.com/docs/content-management-api/resources/webhook-call/self
   *
   * @throws {ApiError}
   * @throws {TimeoutError}
   */
  find(webhookCallId: string | SimpleSchemaTypes.WebhookCallData) {
    return this.rawFind(Utils.toId(webhookCallId)).then((body) =>
      Utils.deserializeResponseBody<SimpleSchemaTypes.WebhookCallSelfTargetSchema>(
        body,
      ),
    );
  }

  /**
   * Retrieve a webhook call
   *
   * Read more: https://www.datocms.com/docs/content-management-api/resources/webhook-call/self
   *
   * @throws {ApiError}
   * @throws {TimeoutError}
   */
  rawFind(
    webhookCallId: string,
  ): Promise<SchemaTypes.WebhookCallSelfTargetSchema> {
    return this.client.request<SchemaTypes.WebhookCallSelfTargetSchema>({
      method: 'GET',
      url: `/webhook_calls/${webhookCallId}`,
    });
  }

  /**
   * Re-send the webhook call
   *
   * Read more: https://www.datocms.com/docs/content-management-api/resources/webhook-call/resend_webhook
   *
   * @throws {ApiError}
   * @throws {TimeoutError}
   */
  resendWebhook(webhookCallId: string | SimpleSchemaTypes.WebhookCallData) {
    return this.rawResendWebhook(Utils.toId(webhookCallId));
  }

  /**
   * Re-send the webhook call
   *
   * Read more: https://www.datocms.com/docs/content-management-api/resources/webhook-call/resend_webhook
   *
   * @throws {ApiError}
   * @throws {TimeoutError}
   */
  rawResendWebhook(webhookCallId: string): Promise<void> {
    return this.client.request<void>({
      method: 'POST',
      url: `/webhook_calls/${webhookCallId}/resend_webhook`,
    });
  }
}
