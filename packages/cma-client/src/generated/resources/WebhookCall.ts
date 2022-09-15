import * as Utils from '@datocms/rest-client-utils';
import * as SchemaTypes from '../SchemaTypes';
import * as SimpleSchemaTypes from '../SimpleSchemaTypes';
import BaseResource from '../../BaseResource';

export default class WebhookCall extends BaseResource {
  static readonly TYPE: 'webhook_call' = 'webhook_call';

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
      url: `/webhook_calls`,
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
    queryParams?: SimpleSchemaTypes.WebhookCallInstancesHrefSchema,
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
    queryParams?: SchemaTypes.WebhookCallInstancesHrefSchema,
    iteratorOptions?: Utils.IteratorOptions,
  ) {
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
   * Re-send the webhook call
   *
   * Read more: https://www.datocms.com/docs/content-management-api/resources/webhook-call/resend_webhook
   *
   * @throws {ApiError}
   * @throws {TimeoutError}
   */
  resendWebhook(userId: string | SimpleSchemaTypes.UserData) {
    return this.rawResendWebhook(Utils.toId(userId));
  }

  /**
   * Re-send the webhook call
   *
   * Read more: https://www.datocms.com/docs/content-management-api/resources/webhook-call/resend_webhook
   *
   * @throws {ApiError}
   * @throws {TimeoutError}
   */
  rawResendWebhook(userId: string): Promise<void> {
    return this.client.request<void>({
      method: 'POST',
      url: `/webhook_calls/${userId}/resend_webhook`,
    });
  }
}
