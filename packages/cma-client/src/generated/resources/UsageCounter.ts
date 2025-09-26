import * as Utils from '@datocms/rest-client-utils';
import BaseResource from '../../BaseResource';
import type * as ApiTypes from '../ApiTypes';
import type * as RawApiTypes from '../RawApiTypes';

export default class UsageCounter extends BaseResource {
  static readonly TYPE = 'usage_counter' as const;

  /**
   * Retrieve a project's usage counter
   *
   * Read more: https://www.datocms.com/docs/content-management-api/resources/usage-counter/self
   *
   * @throws {ApiError}
   * @throws {TimeoutError}
   */
  find(
    usageCounterId: string | ApiTypes.UsageCounterData,
    queryParams?: ApiTypes.UsageCounterSelfHrefSchema,
  ) {
    return this.rawFind(Utils.toId(usageCounterId), queryParams).then((body) =>
      Utils.deserializeResponseBody<ApiTypes.UsageCounterSelfTargetSchema>(
        body,
      ),
    );
  }

  /**
   * Retrieve a project's usage counter
   *
   * Read more: https://www.datocms.com/docs/content-management-api/resources/usage-counter/self
   *
   * @throws {ApiError}
   * @throws {TimeoutError}
   */
  rawFind(
    usageCounterId: string,
    queryParams?: RawApiTypes.UsageCounterSelfHrefSchema,
  ): Promise<RawApiTypes.UsageCounterSelfTargetSchema> {
    return this.client.request<RawApiTypes.UsageCounterSelfTargetSchema>({
      method: 'GET',
      url: `/usage-log-counters/${usageCounterId}`,
      queryParams,
    });
  }
}
