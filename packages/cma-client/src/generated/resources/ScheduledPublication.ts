import * as Utils from '@datocms/rest-client-utils';
import BaseResource from '../../BaseResource';
import type { ItemTypeDefinition } from '../../utilities/itemDefinition';
import type * as ApiTypes from '../ApiTypes';
import type * as RawApiTypes from '../RawApiTypes';

type NoInfer<T> = [T][T extends any ? 0 : never];

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
  destroy<D extends ItemTypeDefinition = ItemTypeDefinition>(
    itemId: string | ApiTypes.ItemData,
  ) {
    return this.rawDestroy<D>(Utils.toId(itemId)).then((body) =>
      Utils.deserializeResponseBody<
        ApiTypes.ScheduledPublicationDestroyTargetSchema<NoInfer<D>>
      >(body),
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
  rawDestroy<D extends ItemTypeDefinition = ItemTypeDefinition>(
    itemId: string,
  ): Promise<
    RawApiTypes.ScheduledPublicationDestroyTargetSchema<NoInfer<D>, true>
  > {
    return this.client
      .request({
        method: 'DELETE',
        url: `/items/${itemId}/scheduled-publication`,
      })
      .then<
        RawApiTypes.ScheduledPublicationDestroyTargetSchema<NoInfer<D>, true>
      >(Utils.deserializeRawResponseBodyWithItems);
  }
}
