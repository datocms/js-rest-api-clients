import * as Utils from '@datocms/rest-client-utils';
import BaseResource from '../../BaseResource';
import type * as SchemaTypes from '../SchemaTypes';
import type * as SimpleSchemaTypes from '../SimpleSchemaTypes';

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
    usageCounterId: string | SimpleSchemaTypes.UsageCounterData,
    queryParams?: SimpleSchemaTypes.UsageCounterSelfHrefSchema,
  ) {
    return this.rawFind(Utils.toId(usageCounterId), queryParams).then((body) =>
      Utils.deserializeResponseBody<SimpleSchemaTypes.UsageCounterSelfTargetSchema>(
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
    queryParams?: SchemaTypes.UsageCounterSelfHrefSchema,
  ): Promise<SchemaTypes.UsageCounterSelfTargetSchema> {
    return this.client.request<SchemaTypes.UsageCounterSelfTargetSchema>({
      method: 'GET',
      url: `/usage-log-counters/${usageCounterId}`,
      queryParams,
    });
  }
}
