import * as Utils from '@datocms/rest-client-utils';
import BaseResource from '../../BaseResource';
import type * as ApiTypes from '../ApiTypes';
import type * as RawApiTypes from '../RawApiTypes';

export default class DailyUsage extends BaseResource {
  static readonly TYPE = 'daily_usage' as const;

  /**
   * Retrieve daily usage info for either an account or an organization
   *
   * @throws {ApiError}
   * @throws {TimeoutError}
   */
  list(queryParams?: ApiTypes.DailyUsageInstancesHrefSchema) {
    return this.rawList(queryParams).then((body) =>
      Utils.deserializeResponseBody<ApiTypes.DailyUsageInstancesTargetSchema>(
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
  rawList(
    queryParams?: RawApiTypes.DailyUsageInstancesHrefSchema,
  ): Promise<RawApiTypes.DailyUsageInstancesTargetSchema> {
    return this.client.request<RawApiTypes.DailyUsageInstancesTargetSchema>({
      method: 'GET',
      url: '/daily-site-usages',
      queryParams,
    });
  }
}
