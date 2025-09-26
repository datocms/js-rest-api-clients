import * as Utils from '@datocms/rest-client-utils';
import BaseResource from '../../BaseResource';
import type * as ApiTypes from '../ApiTypes';
import type * as RawApiTypes from '../RawApiTypes';

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
  create(body: ApiTypes.WebhookCreateSchema) {
    return this.rawCreate(
      Utils.serializeRequestBody<RawApiTypes.WebhookCreateSchema>(body, {
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
      Utils.deserializeResponseBody<ApiTypes.WebhookCreateTargetSchema>(body),
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
    body: RawApiTypes.WebhookCreateSchema,
  ): Promise<RawApiTypes.WebhookCreateTargetSchema> {
    return this.client.request<RawApiTypes.WebhookCreateTargetSchema>({
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
    webhookId: string | ApiTypes.WebhookData,
    body: ApiTypes.WebhookUpdateSchema,
  ) {
    return this.rawUpdate(
      Utils.toId(webhookId),
      Utils.serializeRequestBody<RawApiTypes.WebhookUpdateSchema>(body, {
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
      Utils.deserializeResponseBody<ApiTypes.WebhookUpdateTargetSchema>(body),
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
    body: RawApiTypes.WebhookUpdateSchema,
  ): Promise<RawApiTypes.WebhookUpdateTargetSchema> {
    return this.client.request<RawApiTypes.WebhookUpdateTargetSchema>({
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
      Utils.deserializeResponseBody<ApiTypes.WebhookInstancesTargetSchema>(
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
  rawList(): Promise<RawApiTypes.WebhookInstancesTargetSchema> {
    return this.client.request<RawApiTypes.WebhookInstancesTargetSchema>({
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
  find(webhookId: string | ApiTypes.WebhookData) {
    return this.rawFind(Utils.toId(webhookId)).then((body) =>
      Utils.deserializeResponseBody<ApiTypes.WebhookSelfTargetSchema>(body),
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
  rawFind(webhookId: string): Promise<RawApiTypes.WebhookSelfTargetSchema> {
    return this.client.request<RawApiTypes.WebhookSelfTargetSchema>({
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
  destroy(webhookId: string | ApiTypes.WebhookData) {
    return this.rawDestroy(Utils.toId(webhookId)).then((body) =>
      Utils.deserializeResponseBody<ApiTypes.WebhookDestroyTargetSchema>(body),
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
  ): Promise<RawApiTypes.WebhookDestroyTargetSchema> {
    return this.client.request<RawApiTypes.WebhookDestroyTargetSchema>({
      method: 'DELETE',
      url: `/webhooks/${webhookId}`,
    });
  }
}
