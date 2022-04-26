import * as Utils from '@datocms/rest-client-utils';
import * as SchemaTypes from '../SchemaTypes';
import * as SimpleSchemaTypes from '../SimpleSchemaTypes';
import BaseResource from '../../BaseResource';

export default class ScheduledUnpublishing extends BaseResource {
  static readonly TYPE: 'scheduled_unpublishing' = 'scheduled_unpublishing';

  /**
   * Create a new scheduled unpublishing
   *
   * Read more: https://www.datocms.com/docs/content-management-api/resources/scheduled-unpublishing/create
   */
  create(
    itemId: string | SimpleSchemaTypes.ItemData,
    body: SimpleSchemaTypes.ScheduledUnpublishingCreateSchema,
  ) {
    return this.rawCreate(
      Utils.toId(itemId),
      Utils.serializeRequestBody<SchemaTypes.ScheduledUnpublishingCreateSchema>(
        body,
        {
          type: 'scheduled_unpublishing',
          attributes: ['unpublishing_scheduled_at'],
          relationships: [],
        },
      ),
    ).then((body) =>
      Utils.deserializeResponseBody<SimpleSchemaTypes.ScheduledUnpublishingCreateTargetSchema>(
        body,
      ),
    );
  }

  /**
   * Create a new scheduled unpublishing
   *
   * Read more: https://www.datocms.com/docs/content-management-api/resources/scheduled-unpublishing/create
   */
  rawCreate(
    itemId: string,
    body: SchemaTypes.ScheduledUnpublishingCreateSchema,
  ): Promise<SchemaTypes.ScheduledUnpublishingCreateTargetSchema> {
    return this.client.request<SchemaTypes.ScheduledUnpublishingCreateTargetSchema>(
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
   */
  destroy(itemId: string | SimpleSchemaTypes.ItemData) {
    return this.rawDestroy(Utils.toId(itemId)).then((body) =>
      Utils.deserializeResponseBody<SimpleSchemaTypes.ScheduledUnpublishingDestroyTargetSchema>(
        body,
      ),
    );
  }

  /**
   * Delete a scheduled unpublishing
   *
   * Read more: https://www.datocms.com/docs/content-management-api/resources/scheduled-unpublishing/destroy
   */
  rawDestroy(
    itemId: string,
  ): Promise<SchemaTypes.ScheduledUnpublishingDestroyTargetSchema> {
    return this.client.request<SchemaTypes.ScheduledUnpublishingDestroyTargetSchema>(
      {
        method: 'DELETE',
        url: `/items/${itemId}/scheduled-unpublishing`,
      },
    );
  }
}
