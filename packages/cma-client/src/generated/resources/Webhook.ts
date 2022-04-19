import * as Utils from '@datocms/rest-client-utils';
import * as SchemaTypes from '../SchemaTypes';
import * as SimpleSchemaTypes from '../SimpleSchemaTypes';
import BaseResource from '../../BaseResource';

export default class Webhook extends BaseResource {
  static readonly TYPE: 'webhook' = 'webhook';

  /**
   * Create a new webhook
   *
   * Read more: https://www.datocms.com/docs/content-management-api/resources/webhook/create
   */
  create(body: SimpleSchemaTypes.WebhookCreateSchema) {
    return this.rawCreate(
      Utils.serializeRequestBody<SchemaTypes.WebhookCreateSchema>({
        body,
        type: Webhook.TYPE,
      }),
    ).then((body) =>
      Utils.deserializeResponseBody<SimpleSchemaTypes.WebhookCreateTargetSchema>(
        body,
      ),
    );
  }

  /**
   * Create a new webhook
   *
   * Read more: https://www.datocms.com/docs/content-management-api/resources/webhook/create
   */
  rawCreate(
    body: SchemaTypes.WebhookCreateSchema,
  ): Promise<SchemaTypes.WebhookCreateTargetSchema> {
    return this.client.request<SchemaTypes.WebhookCreateTargetSchema>({
      method: 'POST',
      url: `/webhooks`,
      body,
    });
  }

  /**
   * Update a webhook
   *
   * Read more: https://www.datocms.com/docs/content-management-api/resources/webhook/update
   */
  update(
    userId: string | SimpleSchemaTypes.WebhookData,
    body: SimpleSchemaTypes.WebhookUpdateSchema,
  ) {
    return this.rawUpdate(
      Utils.toId(userId),
      Utils.serializeRequestBody<SchemaTypes.WebhookUpdateSchema>({
        body,
        type: Webhook.TYPE,
      }),
    ).then((body) =>
      Utils.deserializeResponseBody<SimpleSchemaTypes.WebhookUpdateTargetSchema>(
        body,
      ),
    );
  }

  /**
   * Update a webhook
   *
   * Read more: https://www.datocms.com/docs/content-management-api/resources/webhook/update
   */
  rawUpdate(
    userId: string,
    body: SchemaTypes.WebhookUpdateSchema,
  ): Promise<SchemaTypes.WebhookUpdateTargetSchema> {
    return this.client.request<SchemaTypes.WebhookUpdateTargetSchema>({
      method: 'PUT',
      url: `/webhooks/${userId}`,
      body,
    });
  }

  /**
   * List all webhooks
   *
   * Read more: https://www.datocms.com/docs/content-management-api/resources/webhook/instances
   */
  list() {
    return this.rawList().then((body) =>
      Utils.deserializeResponseBody<SimpleSchemaTypes.WebhookInstancesTargetSchema>(
        body,
      ),
    );
  }

  /**
   * List all webhooks
   *
   * Read more: https://www.datocms.com/docs/content-management-api/resources/webhook/instances
   */
  rawList(): Promise<SchemaTypes.WebhookInstancesTargetSchema> {
    return this.client.request<SchemaTypes.WebhookInstancesTargetSchema>({
      method: 'GET',
      url: `/webhooks`,
    });
  }

  /**
   * Retrieve a webhook
   *
   * Read more: https://www.datocms.com/docs/content-management-api/resources/webhook/self
   */
  find(userId: string | SimpleSchemaTypes.WebhookData) {
    return this.rawFind(Utils.toId(userId)).then((body) =>
      Utils.deserializeResponseBody<SimpleSchemaTypes.WebhookSelfTargetSchema>(
        body,
      ),
    );
  }

  /**
   * Retrieve a webhook
   *
   * Read more: https://www.datocms.com/docs/content-management-api/resources/webhook/self
   */
  rawFind(userId: string): Promise<SchemaTypes.WebhookSelfTargetSchema> {
    return this.client.request<SchemaTypes.WebhookSelfTargetSchema>({
      method: 'GET',
      url: `/webhooks/${userId}`,
    });
  }

  /**
   * Delete a webhook
   *
   * Read more: https://www.datocms.com/docs/content-management-api/resources/webhook/destroy
   */
  destroy(userId: string | SimpleSchemaTypes.WebhookData) {
    return this.rawDestroy(Utils.toId(userId)).then((body) =>
      Utils.deserializeResponseBody<SimpleSchemaTypes.WebhookDestroyTargetSchema>(
        body,
      ),
    );
  }

  /**
   * Delete a webhook
   *
   * Read more: https://www.datocms.com/docs/content-management-api/resources/webhook/destroy
   */
  rawDestroy(userId: string): Promise<SchemaTypes.WebhookDestroyTargetSchema> {
    return this.client.request<SchemaTypes.WebhookDestroyTargetSchema>({
      method: 'DELETE',
      url: `/webhooks/${userId}`,
    });
  }
}
