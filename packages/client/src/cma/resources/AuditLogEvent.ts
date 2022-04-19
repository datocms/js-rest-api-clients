import BaseResource from '../BaseResource';
import { serializeRequestBody } from '../../serialize';
import {
  deserializeResponseBody,
  deserializeJsonEntity,
} from '../../deserialize';
import toId from '../../toId';
import * as SchemaTypes from '../SchemaTypes';
import * as SimpleSchemaTypes from '../SimpleSchemaTypes';
import { IteratorOptions, rawPageIterator } from '../../rawPageIterator';

export default class AuditLogEvent extends BaseResource {
  static readonly TYPE: 'audit_log_event' = 'audit_log_event';

  /**
   * List Audit Log events
   *
   * Read more: https://www.datocms.com/docs/content-management-api/resources/audit-log_event/query
   */
  query(body: SimpleSchemaTypes.AuditLogEventQuerySchema) {
    return this.rawQuery(
      serializeRequestBody<SchemaTypes.AuditLogEventQuerySchema>({
        body,
        type: AuditLogEvent.TYPE,
      }),
    ).then((body) =>
      deserializeResponseBody<SimpleSchemaTypes.AuditLogEventQueryTargetSchema>(
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
      url: `/audit-log-events`,
      body,
    });
  }
}
