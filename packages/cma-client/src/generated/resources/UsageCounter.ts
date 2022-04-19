import * as Utils from '@datocms/rest-client-utils';
import * as SchemaTypes from '../SchemaTypes';
import * as SimpleSchemaTypes from '../SimpleSchemaTypes';
import BaseResource from '../../BaseResource';

export default class UsageCounter extends BaseResource {
  static readonly TYPE: 'usage_counter' = 'usage_counter';

  /**
   * Retrieve a project's usage counter
   *
   * Read more: https://www.datocms.com/docs/content-management-api/resources/usage-counter/self
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
