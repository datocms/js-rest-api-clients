import * as Utils from '@datocms/rest-client-utils';
import BaseResource from '../../BaseResource';
import type { ItemTypeDefinition } from '../../utilities/itemDefinition';
import type * as ApiTypes from '../ApiTypes';
import type * as RawApiTypes from '../RawApiTypes';

type NoInfer<T> = [T][T extends any ? 0 : never];

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
  destroy<D extends ItemTypeDefinition = ItemTypeDefinition>(
    itemId: string | ApiTypes.ItemData,
  ) {
    return this.rawDestroy<D>(Utils.toId(itemId)).then((body) =>
      Utils.deserializeResponseBody<
        ApiTypes.ScheduledUnpublishingDestroyTargetSchema<NoInfer<D>>
      >(body),
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
  rawDestroy<D extends ItemTypeDefinition = ItemTypeDefinition>(
    itemId: string,
  ): Promise<
    RawApiTypes.ScheduledUnpublishingDestroyTargetSchema<NoInfer<D>, true>
  > {
    return this.client
      .request({
        method: 'DELETE',
        url: `/items/${itemId}/scheduled-unpublishing`,
      })
      .then<
        RawApiTypes.ScheduledUnpublishingDestroyTargetSchema<NoInfer<D>, true>
      >(Utils.deserializeRawResponseBodyWithItems);
  }
}
