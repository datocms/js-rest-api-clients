import * as Utils from '@datocms/rest-client-utils';
import * as SchemaTypes from '../SchemaTypes';
import * as SimpleSchemaTypes from '../SimpleSchemaTypes';
import BaseResource from '../../BaseResource';

export default class DailyUsage extends BaseResource {
  static readonly TYPE: 'daily_usage' = 'daily_usage';

  /**
   * Retrieve project's daily usage info
   *
   * Read more: https://www.datocms.com/docs/content-management-api/resources/daily-usage/instances
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
   */
  rawList(): Promise<SchemaTypes.DailyUsageInstancesTargetSchema> {
    return this.client.request<SchemaTypes.DailyUsageInstancesTargetSchema>({
      method: 'GET',
      url: `/daily-site-usages`,
    });
  }
}
