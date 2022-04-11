import BaseResource from '../BaseResource';
import serializeRequestBody from '../../serializeRequestBody';
import deserializeResponseBody from '../../deserializeResponseBody';
import toId from '../../toId';
import * as SchemaTypes from '../SchemaTypes';
import * as SimpleSchemaTypes from '../SimpleSchemaTypes';

export default class ScheduledUnpublishing extends BaseResource {
  static readonly TYPE: 'scheduled_unpublishing' = 'scheduled_unpublishing';

  /**
   * Create a new scheduled unpublishing
   *
   * Read more: https://www.datocms.com/docs/content-management-api/resources/scheduled-unpublishing/create
   */
  create(
    itemId: string | SimpleSchemaTypes.ScheduledUnpublishingData,
    body: SimpleSchemaTypes.ScheduledUnpublishingCreateSchema,
  ) {
    return this.rawCreate(
      toId(itemId),
      serializeRequestBody<SchemaTypes.ScheduledUnpublishingCreateSchema>({
        body,
        type: ScheduledUnpublishing.TYPE,
      }),
    ).then((body) =>
      deserializeResponseBody<SimpleSchemaTypes.ScheduledUnpublishingCreateTargetSchema>(
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
  destroy(itemId: string | SimpleSchemaTypes.ScheduledUnpublishingData) {
    return this.rawDestroy(toId(itemId)).then((body) =>
      deserializeResponseBody<SimpleSchemaTypes.ScheduledUnpublishingDestroyTargetSchema>(
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
