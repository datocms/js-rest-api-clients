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

export default class WebhookCall extends BaseResource {
  static readonly TYPE: 'webhook_call' = 'webhook_call';

  /**
   * List all webhooks calls
   *
   * Read more: https://www.datocms.com/docs/content-management-api/resources/webhook-call/instances
   */
  list(queryParams?: SimpleSchemaTypes.WebhookCallInstancesHrefSchema) {
    return this.rawList(queryParams).then((body) =>
      deserializeResponseBody<SimpleSchemaTypes.WebhookCallInstancesTargetSchema>(
        body,
      ),
    );
  }

  /**
   * List all webhooks calls
   *
   * Read more: https://www.datocms.com/docs/content-management-api/resources/webhook-call/instances
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
   */
  async *listPagedIterator(
    queryParams?: SimpleSchemaTypes.WebhookCallInstancesHrefSchema,
    iteratorOptions?: IteratorOptions,
  ) {
    for await (const element of this.rawListPagedIterator(
      queryParams,
      iteratorOptions,
    )) {
      yield deserializeJsonEntity<
        SimpleSchemaTypes.WebhookCallInstancesTargetSchema[0]
      >(element);
    }
  }

  /**
   * Async iterator to auto-paginate over elements returned by rawList()
   *
   * Read more: https://www.datocms.com/docs/content-management-api/resources/webhook-call/instances
   */
  rawListPagedIterator(
    queryParams?: SchemaTypes.WebhookCallInstancesHrefSchema,
    iteratorOptions?: IteratorOptions,
  ) {
    return rawPageIterator<
      SchemaTypes.WebhookCallInstancesTargetSchema['data'][0]
    >(
      {
        defaultLimit: 30,
        maxLimit: 500,
      },
      (page) => this.rawList({ ...queryParams, page }),
      iteratorOptions,
    );
  }

  /**
   * Re-send the webhook call
   *
   * Read more: https://www.datocms.com/docs/content-management-api/resources/webhook-call/resend_webhook
   */
  resendWebhook(userId: string | SimpleSchemaTypes.WebhookCallData) {
    return this.rawResendWebhook(toId(userId));
  }

  /**
   * Re-send the webhook call
   *
   * Read more: https://www.datocms.com/docs/content-management-api/resources/webhook-call/resend_webhook
   */
  rawResendWebhook(userId: string): Promise<void> {
    return this.client.request<void>({
      method: 'POST',
      url: `/webhook_calls/${userId}/resend_webhook`,
    });
  }
}
