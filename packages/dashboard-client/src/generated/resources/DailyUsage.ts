import * as Utils from '@datocms/rest-client-utils';
import * as SchemaTypes from '../SchemaTypes';
import * as SimpleSchemaTypes from '../SimpleSchemaTypes';
import BaseResource from '../../BaseResource';

export default class DailyUsage extends BaseResource {
  static readonly TYPE = 'daily_usage' as const;

  /**
   * Retrieve daily usage info for either an account or an organization
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
   * Retrieve daily usage info for either an account or an organization
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
