import BaseResource from '../BaseResource';
import serializeRequestBody from '../../serializeRequestBody';
import deserializeResponseBody from '../../deserializeResponseBody';
import toId from '../../toId';
import * as SchemaTypes from '../SchemaTypes';
import * as SimpleSchemaTypes from '../SimpleSchemaTypes';

export default class ScheduledPublication extends BaseResource {
  static readonly TYPE: 'scheduled_publication' = 'scheduled_publication';

  /**
   * Create a new scheduled publication
   *
   * Read more: https://www.datocms.com/docs/content-management-api/resources/scheduled-publication/create
   */
  create(
    itemId: string | SimpleSchemaTypes.ScheduledPublicationData,
    body: SimpleSchemaTypes.ScheduledPublicationCreateSchema,
  ) {
    return this.rawCreate(
      toId(itemId),
      serializeRequestBody<SchemaTypes.ScheduledPublicationCreateSchema>({
        body,
        type: ScheduledPublication.TYPE,
      }),
    ).then((body) =>
      deserializeResponseBody<SimpleSchemaTypes.ScheduledPublicationCreateTargetSchema>(
        body,
      ),
    );
  }

  /**
   * Create a new scheduled publication
   *
   * Read more: https://www.datocms.com/docs/content-management-api/resources/scheduled-publication/create
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
   */
  destroy(itemId: string | SimpleSchemaTypes.ScheduledPublicationData) {
    return this.rawDestroy(toId(itemId)).then((body) =>
      deserializeResponseBody<SimpleSchemaTypes.ScheduledPublicationDestroyTargetSchema>(
        body,
      ),
    );
  }

  /**
   * Delete a scheduled publication
   *
   * Read more: https://www.datocms.com/docs/content-management-api/resources/scheduled-publication/destroy
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
