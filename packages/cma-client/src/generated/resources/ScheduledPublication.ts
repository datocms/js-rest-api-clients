import * as Utils from '@datocms/rest-client-utils';
import BaseResource from '../../BaseResource';
import type * as SchemaTypes from '../SchemaTypes';
import type * as SimpleSchemaTypes from '../SimpleSchemaTypes';

export default class ScheduledPublication extends BaseResource {
  static readonly TYPE = 'scheduled_publication' as const;

  /**
   * Create a new scheduled publication
   *
   * Read more: https://www.datocms.com/docs/content-management-api/resources/scheduled-publication/create
   *
   * @throws {ApiError}
   * @throws {TimeoutError}
   */
  create(
    itemId: string | SimpleSchemaTypes.ItemData,
    body: SimpleSchemaTypes.ScheduledPublicationCreateSchema,
  ) {
    return this.rawCreate(
      Utils.toId(itemId),
      Utils.serializeRequestBody<SchemaTypes.ScheduledPublicationCreateSchema>(
        body,
        {
          type: 'scheduled_publication',
          attributes: ['publication_scheduled_at', 'selective_publication'],
          relationships: [],
        },
      ),
    ).then((body) =>
      Utils.deserializeResponseBody<SimpleSchemaTypes.ScheduledPublicationCreateTargetSchema>(
        body,
      ),
    );
  }

  /**
   * Create a new scheduled publication
   *
   * Read more: https://www.datocms.com/docs/content-management-api/resources/scheduled-publication/create
   *
   * @throws {ApiError}
   * @throws {TimeoutError}
   */
  rawCreate(
    itemId: string,
    body: SchemaTypes.ScheduledPublicationCreateSchema,
  ): Promise<SchemaTypes.ScheduledPublicationCreateTargetSchema> {
    return this.client.request<SchemaTypes.ScheduledPublicationCreateTargetSchema>(
      {
        method: 'POST',
        url: `/items/${itemId}/scheduled-publication`,
        body,
      },
    );
  }

  /**
   * Delete a scheduled publication
   *
   * Read more: https://www.datocms.com/docs/content-management-api/resources/scheduled-publication/destroy
   *
   * @throws {ApiError}
   * @throws {TimeoutError}
   */
  destroy(itemId: string | SimpleSchemaTypes.ItemData) {
    return this.rawDestroy(Utils.toId(itemId)).then((body) =>
      Utils.deserializeResponseBody<SimpleSchemaTypes.ScheduledPublicationDestroyTargetSchema>(
        body,
      ),
    );
  }

  /**
   * Delete a scheduled publication
   *
   * Read more: https://www.datocms.com/docs/content-management-api/resources/scheduled-publication/destroy
   *
   * @throws {ApiError}
   * @throws {TimeoutError}
   */
  rawDestroy(
    itemId: string,
  ): Promise<SchemaTypes.ScheduledPublicationDestroyTargetSchema> {
    return this.client.request<SchemaTypes.ScheduledPublicationDestroyTargetSchema>(
      {
        method: 'DELETE',
        url: `/items/${itemId}/scheduled-publication`,
      },
    );
  }
}
