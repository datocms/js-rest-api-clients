import * as Utils from '@datocms/rest-client-utils';
import BaseResource from '../../BaseResource';
import type * as ApiTypes from '../ApiTypes';
import type * as RawApiTypes from '../RawApiTypes';

export default class AuditLogEvent extends BaseResource {
  static readonly TYPE = 'audit_log_event' as const;

  /**
   * List Audit Log events
   *
   * Read more: https://www.datocms.com/docs/content-management-api/resources/audit-log_event/query
   *
   * @throws {ApiError}
   * @throws {TimeoutError}
   */
  query(body: ApiTypes.AuditLogEventQuerySchema) {
    return this.rawQuery(
      Utils.serializeRequestBody<RawApiTypes.AuditLogEventQuerySchema>(body, {
        type: 'audit_log_query',
        attributes: ['filter', 'next_token', 'detailed_log'],
        relationships: [],
      }),
    ).then((body) =>
      Utils.deserializeResponseBody<ApiTypes.AuditLogEventQueryTargetSchema>(
        body,
      ),
    );
  }

  /**
   * List Audit Log events
   *
   * Read more: https://www.datocms.com/docs/content-management-api/resources/audit-log_event/query
   *
   * @throws {ApiError}
   * @throws {TimeoutError}
   */
  rawQuery(
    body: RawApiTypes.AuditLogEventQuerySchema,
  ): Promise<RawApiTypes.AuditLogEventQueryTargetSchema> {
    return this.client.request<RawApiTypes.AuditLogEventQueryTargetSchema>({
      method: 'POST',
      url: '/audit-log-events/query',
      body,
    });
  }
}
