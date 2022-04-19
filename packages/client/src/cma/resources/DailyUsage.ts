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

export default class DailyUsage extends BaseResource {
  static readonly TYPE: 'daily_usage' = 'daily_usage';

  /**
   * Retrieve project's daily usage info
   *
   * Read more: https://www.datocms.com/docs/content-management-api/resources/daily-usage/instances
   */
  list() {
    return this.rawList().then((body) =>
      deserializeResponseBody<SimpleSchemaTypes.DailyUsageInstancesTargetSchema>(
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
