import * as Utils from '@datocms/rest-client-utils';
import BaseResource from '../../BaseResource';
import type * as ApiTypes from '../ApiTypes';
import type * as RawApiTypes from '../RawApiTypes';

export default class ScheduledUnpublishing extends BaseResource {
  static readonly TYPE = 'scheduled_unpublishing' as const;

  /**
   * Create a new scheduled unpublishing
   *
   * Read more: https://www.datocms.com/docs/content-management-api/resources/scheduled-unpublishing/create
   *
   * @throws {ApiError}
   * @throws {TimeoutError}
   */
  create(
    itemId: string | ApiTypes.ItemData,
    body: ApiTypes.ScheduledUnpublishingCreateSchema,
  ) {
    return this.rawCreate(
      Utils.toId(itemId),
      Utils.serializeRequestBody<RawApiTypes.ScheduledUnpublishingCreateSchema>(
        body,
        {
          type: 'scheduled_unpublishing',
          attributes: ['unpublishing_scheduled_at', 'content_in_locales'],
          relationships: [],
        },
      ),
    ).then((body) =>
      Utils.deserializeResponseBody<ApiTypes.ScheduledUnpublishingCreateTargetSchema>(
        body,
      ),
    );
  }

  /**
   * Create a new scheduled unpublishing
   *
   * Read more: https://www.datocms.com/docs/content-management-api/resources/scheduled-unpublishing/create
   *
   * @throws {ApiError}
   * @throws {TimeoutError}
   */
  rawCreate(
    itemId: string,
    body: RawApiTypes.ScheduledUnpublishingCreateSchema,
  ): Promise<RawApiTypes.ScheduledUnpublishingCreateTargetSchema> {
    return this.client.request<RawApiTypes.ScheduledUnpublishingCreateTargetSchema>(
      {
        method: 'POST',
        url: `/items/${itemId}/scheduled-unpublishing`,
        body,
      },
    );
  }

  /**
   * Delete a scheduled unpublishing
   *
   * Read more: https://www.datocms.com/docs/content-management-api/resources/scheduled-unpublishing/destroy
   *
   * @throws {ApiError}
   * @throws {TimeoutError}
   */
  destroy(itemId: string | ApiTypes.ItemData) {
    return this.rawDestroy(Utils.toId(itemId)).then((body) =>
      Utils.deserializeResponseBody<ApiTypes.ScheduledUnpublishingDestroyTargetSchema>(
        body,
      ),
    );
  }

  /**
   * Delete a scheduled unpublishing
   *
   * Read more: https://www.datocms.com/docs/content-management-api/resources/scheduled-unpublishing/destroy
   *
   * @throws {ApiError}
   * @throws {TimeoutError}
   */
  rawDestroy(
    itemId: string,
  ): Promise<RawApiTypes.ScheduledUnpublishingDestroyTargetSchema> {
    return this.client.request<RawApiTypes.ScheduledUnpublishingDestroyTargetSchema>(
      {
        method: 'DELETE',
        url: `/items/${itemId}/scheduled-unpublishing`,
      },
    );
  }
}
