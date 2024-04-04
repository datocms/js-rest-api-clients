import * as Utils from '@datocms/rest-client-utils';
import BaseResource from '../../BaseResource';
import type * as SchemaTypes from '../SchemaTypes';
import type * as SimpleSchemaTypes from '../SimpleSchemaTypes';

export default class DailyUsage extends BaseResource {
  static readonly TYPE = 'daily_usage' as const;

  /**
   * Retrieve project's daily usage info
   *
   * Read more: https://www.datocms.com/docs/content-management-api/resources/daily-usage/instances
   *
   * @throws {ApiError}
   * @throws {TimeoutError}
   */
  list() {
    return this.rawList().then((body) =>
      Utils.deserializeResponseBody<SimpleSchemaTypes.DailyUsageInstancesTargetSchema>(
        body,
      ),
    );
  }

  /**
   * Retrieve project's daily usage info
   *
   * Read more: https://www.datocms.com/docs/content-management-api/resources/daily-usage/instances
   *
   * @throws {ApiError}
   * @throws {TimeoutError}
   */
  rawList(): Promise<SchemaTypes.DailyUsageInstancesTargetSchema> {
    return this.client.request<SchemaTypes.DailyUsageInstancesTargetSchema>({
      method: 'GET',
      url: '/daily-site-usages',
    });
  }
}
