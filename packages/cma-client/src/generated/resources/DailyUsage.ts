import * as Utils from '@datocms/rest-client-utils';
import BaseResource from '../../BaseResource';
import type * as ApiTypes from '../ApiTypes';
import type * as RawApiTypes from '../RawApiTypes';

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
      Utils.deserializeResponseBody<ApiTypes.DailyUsageInstancesTargetSchema>(
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
  rawList(): Promise<RawApiTypes.DailyUsageInstancesTargetSchema> {
    return this.client.request<RawApiTypes.DailyUsageInstancesTargetSchema>({
      method: 'GET',
      url: '/daily-site-usages',
    });
  }
}
