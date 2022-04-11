import BaseResource from '../BaseResource';
import serializeRequestBody from '../../serializeRequestBody';
import deserializeResponseBody from '../../deserializeResponseBody';
import toId from '../../toId';
import * as SchemaTypes from '../SchemaTypes';
import * as SimpleSchemaTypes from '../SimpleSchemaTypes';

export default class WebhookCall extends BaseResource {
  static readonly TYPE: 'webhook_call' = 'webhook_call';

  /**
   * List all webhooks calls
   *
   * Read more: https://www.datocms.com/docs/content-management-api/resources/webhook-call/instances
   */
  list() {
    return this.rawList().then((body) =>
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
  rawList(): Promise<SchemaTypes.WebhookCallInstancesTargetSchema> {
    return this.client.request<SchemaTypes.WebhookCallInstancesTargetSchema>({
      method: 'GET',
      url: `/webhook_calls`,
    });
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
