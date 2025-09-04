import * as Utils from '@datocms/rest-client-utils';
import BaseResource from '../../BaseResource';
import type * as ApiTypes from '../ApiTypes';
import type * as RawApiTypes from '../RawApiTypes';

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
    itemId: string | ApiTypes.ItemData,
    body: ApiTypes.ScheduledPublicationCreateSchema,
  ) {
    return this.rawCreate(
      Utils.toId(itemId),
      Utils.serializeRequestBody<RawApiTypes.ScheduledPublicationCreateSchema>(
        body,
        {
          type: 'scheduled_publication',
          attributes: ['publication_scheduled_at', 'selective_publication'],
          relationships: [],
        },
      ),
    ).then((body) =>
      Utils.deserializeResponseBody<ApiTypes.ScheduledPublicationCreateTargetSchema>(
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
    body: RawApiTypes.ScheduledPublicationCreateSchema,
  ): Promise<RawApiTypes.ScheduledPublicationCreateTargetSchema> {
    return this.client.request<RawApiTypes.ScheduledPublicationCreateTargetSchema>(
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
  destroy(itemId: string | ApiTypes.ItemData) {
    return this.rawDestroy(Utils.toId(itemId)).then((body) =>
      Utils.deserializeResponseBody<ApiTypes.ScheduledPublicationDestroyTargetSchema>(
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
  ): Promise<RawApiTypes.ScheduledPublicationDestroyTargetSchema> {
    return this.client.request<RawApiTypes.ScheduledPublicationDestroyTargetSchema>(
      {
        method: 'DELETE',
        url: `/items/${itemId}/scheduled-publication`,
      },
    );
  }
}
