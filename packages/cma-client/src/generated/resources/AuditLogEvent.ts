import * as Utils from '@datocms/rest-client-utils';
import * as SchemaTypes from '../SchemaTypes';
import * as SimpleSchemaTypes from '../SimpleSchemaTypes';
import BaseResource from '../../BaseResource';

export default class AuditLogEvent extends BaseResource {
  static readonly TYPE: 'audit_log_event' = 'audit_log_event';

  /**
   * List Audit Log events
   *
   * Read more: https://www.datocms.com/docs/content-management-api/resources/audit-log_event/query
   */
  query(body: SimpleSchemaTypes.AuditLogEventQuerySchema) {
    return this.rawQuery(
      Utils.serializeRequestBody<SchemaTypes.AuditLogEventQuerySchema>(body, {
        type: 'audit_log_query',
        attributes: ['filter', 'next_token', 'detailed_log'],
        relationships: [],
      }),
    ).then((body) =>
      Utils.deserializeResponseBody<SimpleSchemaTypes.AuditLogEventQueryTargetSchema>(
        body,
      ),
    );
  }

  /**
   * List Audit Log events
   *
   * Read more: https://www.datocms.com/docs/content-management-api/resources/audit-log_event/query
   */
  rawQuery(
    body: SchemaTypes.AuditLogEventQuerySchema,
  ): Promise<SchemaTypes.AuditLogEventQueryTargetSchema> {
    return this.client.request<SchemaTypes.AuditLogEventQueryTargetSchema>({
      method: 'POST',
      url: `/audit-log-events/query`,
      body,
    });
  }
}
