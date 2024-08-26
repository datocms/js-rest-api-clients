import * as Utils from '@datocms/rest-client-utils';
import BaseResource from '../../BaseResource';
import type * as SchemaTypes from '../SchemaTypes';
import type * as SimpleSchemaTypes from '../SimpleSchemaTypes';

export default class Webhook extends BaseResource {
  static readonly TYPE = 'webhook' as const;

  /**
   * Create a new webhook
   *
   * Read more: https://www.datocms.com/docs/content-management-api/resources/webhook/create
   *
   * @throws {ApiError}
   * @throws {TimeoutError}
   */
  create(body: SimpleSchemaTypes.WebhookCreateSchema) {
    return this.rawCreate(
      Utils.serializeRequestBody<SchemaTypes.WebhookCreateSchema>(body, {
        type: 'webhook',
        attributes: [
          'name',
          'url',
          'custom_payload',
          'headers',
          'events',
          'http_basic_user',
          'http_basic_password',
          'enabled',
          'payload_api_version',
          'nested_items_in_payload',
          'auto_retry',
        ],
        relationships: [],
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
   *
   * @throws {ApiError}
   * @throws {TimeoutError}
   */
  rawCreate(
    body: SchemaTypes.WebhookCreateSchema,
  ): Promise<SchemaTypes.WebhookCreateTargetSchema> {
    return this.client.request<SchemaTypes.WebhookCreateTargetSchema>({
      method: 'POST',
      url: '/webhooks',
      body,
    });
  }

  /**
   * Update a webhook
   *
   * Read more: https://www.datocms.com/docs/content-management-api/resources/webhook/update
   *
   * @throws {ApiError}
   * @throws {TimeoutError}
   */
  update(
    webhookId: string | SimpleSchemaTypes.WebhookData,
    body: SimpleSchemaTypes.WebhookUpdateSchema,
  ) {
    return this.rawUpdate(
      Utils.toId(webhookId),
      Utils.serializeRequestBody<SchemaTypes.WebhookUpdateSchema>(body, {
        id: Utils.toId(webhookId),
        type: 'webhook',
        attributes: [
          'name',
          'url',
          'custom_payload',
          'headers',
          'events',
          'http_basic_user',
          'http_basic_password',
          'enabled',
          'payload_api_version',
          'nested_items_in_payload',
          'auto_retry',
        ],
        relationships: [],
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
   *
   * @throws {ApiError}
   * @throws {TimeoutError}
   */
  rawUpdate(
    webhookId: string,
    body: SchemaTypes.WebhookUpdateSchema,
  ): Promise<SchemaTypes.WebhookUpdateTargetSchema> {
    return this.client.request<SchemaTypes.WebhookUpdateTargetSchema>({
      method: 'PUT',
      url: `/webhooks/${webhookId}`,
      body,
    });
  }

  /**
   * List all webhooks
   *
   * Read more: https://www.datocms.com/docs/content-management-api/resources/webhook/instances
   *
   * @throws {ApiError}
   * @throws {TimeoutError}
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
   *
   * @throws {ApiError}
   * @throws {TimeoutError}
   */
  rawList(): Promise<SchemaTypes.WebhookInstancesTargetSchema> {
    return this.client.request<SchemaTypes.WebhookInstancesTargetSchema>({
      method: 'GET',
      url: '/webhooks',
    });
  }

  /**
   * Retrieve a webhook
   *
   * Read more: https://www.datocms.com/docs/content-management-api/resources/webhook/self
   *
   * @throws {ApiError}
   * @throws {TimeoutError}
   */
  find(webhookId: string | SimpleSchemaTypes.WebhookData) {
    return this.rawFind(Utils.toId(webhookId)).then((body) =>
      Utils.deserializeResponseBody<SimpleSchemaTypes.WebhookSelfTargetSchema>(
        body,
      ),
    );
  }

  /**
   * Retrieve a webhook
   *
   * Read more: https://www.datocms.com/docs/content-management-api/resources/webhook/self
   *
   * @throws {ApiError}
   * @throws {TimeoutError}
   */
  rawFind(webhookId: string): Promise<SchemaTypes.WebhookSelfTargetSchema> {
    return this.client.request<SchemaTypes.WebhookSelfTargetSchema>({
      method: 'GET',
      url: `/webhooks/${webhookId}`,
    });
  }

  /**
   * Delete a webhook
   *
   * Read more: https://www.datocms.com/docs/content-management-api/resources/webhook/destroy
   *
   * @throws {ApiError}
   * @throws {TimeoutError}
   */
  destroy(webhookId: string | SimpleSchemaTypes.WebhookData) {
    return this.rawDestroy(Utils.toId(webhookId)).then((body) =>
      Utils.deserializeResponseBody<SimpleSchemaTypes.WebhookDestroyTargetSchema>(
        body,
      ),
    );
  }

  /**
   * Delete a webhook
   *
   * Read more: https://www.datocms.com/docs/content-management-api/resources/webhook/destroy
   *
   * @throws {ApiError}
   * @throws {TimeoutError}
   */
  rawDestroy(
    webhookId: string,
  ): Promise<SchemaTypes.WebhookDestroyTargetSchema> {
    return this.client.request<SchemaTypes.WebhookDestroyTargetSchema>({
      method: 'DELETE',
      url: `/webhooks/${webhookId}`,
    });
  }
}
