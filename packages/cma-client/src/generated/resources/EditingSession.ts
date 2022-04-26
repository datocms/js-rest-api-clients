import * as Utils from '@datocms/rest-client-utils';
import * as SchemaTypes from '../SchemaTypes';
import * as SimpleSchemaTypes from '../SimpleSchemaTypes';
import BaseResource from '../../BaseResource';

export default class EditingSession extends BaseResource {
  static readonly TYPE: 'editing_session' = 'editing_session';

  /**
   * List all editing sessions
   *
   * Read more: https://www.datocms.com/docs/content-management-api/resources/editing-session/instances
   *
   * @deprecated This API call is to be considered private and might change without notice
   */
  list() {
    return this.rawList().then((body) =>
      Utils.deserializeResponseBody<SimpleSchemaTypes.EditingSessionInstancesTargetSchema>(
        body,
      ),
    );
  }

  /**
   * List all editing sessions
   *
   * Read more: https://www.datocms.com/docs/content-management-api/resources/editing-session/instances
   *
   * @deprecated This API call is to be considered private and might change without notice
   */
  rawList(): Promise<SchemaTypes.EditingSessionInstancesTargetSchema> {
    return this.client.request<SchemaTypes.EditingSessionInstancesTargetSchema>(
      {
        method: 'GET',
        url: `/editing-sessions`,
      },
    );
  }

  /**
   * Allows all actions on editing sessions
   *
   * Read more: https://www.datocms.com/docs/content-management-api/resources/editing-session/update
   *
   * @deprecated This API call is to be considered private and might change without notice
   */
  rawUpdate(
    editingSessionId: string,
    body: SchemaTypes.EditingSessionUpdateSchema,
  ): Promise<SchemaTypes.EditingSessionUpdateTargetSchema> {
    return this.client.request<SchemaTypes.EditingSessionUpdateTargetSchema>({
      method: 'PUT',
      url: `/editing-sessions/${editingSessionId}`,
      body,
    });
  }

  /**
   * Delete an editing session
   *
   * Read more: https://www.datocms.com/docs/content-management-api/resources/editing-session/destroy
   *
   * @deprecated This API call is to be considered private and might change without notice
   */
  destroy(editingSessionId: string | SimpleSchemaTypes.EditingSessionData) {
    return this.rawDestroy(Utils.toId(editingSessionId)).then((body) =>
      Utils.deserializeResponseBody<SimpleSchemaTypes.EditingSessionDestroyTargetSchema>(
        body,
      ),
    );
  }

  /**
   * Delete an editing session
   *
   * Read more: https://www.datocms.com/docs/content-management-api/resources/editing-session/destroy
   *
   * @deprecated This API call is to be considered private and might change without notice
   */
  rawDestroy(
    editingSessionId: string,
  ): Promise<SchemaTypes.EditingSessionDestroyTargetSchema> {
    return this.client.request<SchemaTypes.EditingSessionDestroyTargetSchema>({
      method: 'DELETE',
      url: `/editing-sessions/${editingSessionId}`,
    });
  }
}
