import BaseResource from '../BaseResource';
import serializeRequestBody from '../../serializeRequestBody';
import deserializeResponseBody from '../../deserializeResponseBody';
import toId from '../../toId';
import * as SchemaTypes from '../SchemaTypes';
import * as SimpleSchemaTypes from '../SimpleSchemaTypes';

export default class BuildEvent extends BaseResource {
  static readonly TYPE: 'build_event' = 'build_event';

  /**
   * List all deploy events
   *
   * Read more: https://www.datocms.com/docs/content-management-api/resources/build-event/instances
   */
  list() {
    return this.rawList().then((body) =>
      deserializeResponseBody<SimpleSchemaTypes.BuildEventInstancesTargetSchema>(
        body,
      ),
    );
  }

  /**
   * List all deploy events
   *
   * Read more: https://www.datocms.com/docs/content-management-api/resources/build-event/instances
   */
  rawList(): Promise<SchemaTypes.BuildEventInstancesTargetSchema> {
    return this.client.request<SchemaTypes.BuildEventInstancesTargetSchema>({
      method: 'GET',
      url: `/build-events`,
    });
  }

  /**
   * Retrieve a deploy event
   *
   * Read more: https://www.datocms.com/docs/content-management-api/resources/build-event/self
   */
  find(buildEventId: string | SimpleSchemaTypes.BuildEventData) {
    return this.rawFind(toId(buildEventId)).then((body) =>
      deserializeResponseBody<SimpleSchemaTypes.BuildEventSelfTargetSchema>(
        body,
      ),
    );
  }

  /**
   * Retrieve a deploy event
   *
   * Read more: https://www.datocms.com/docs/content-management-api/resources/build-event/self
   */
  rawFind(
    buildEventId: string,
  ): Promise<SchemaTypes.BuildEventSelfTargetSchema> {
    return this.client.request<SchemaTypes.BuildEventSelfTargetSchema>({
      method: 'GET',
      url: `/build-events/${buildEventId}`,
    });
  }
}
