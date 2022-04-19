import * as Utils from '@datocms/rest-client-utils';
import * as SchemaTypes from '../SchemaTypes';
import * as SimpleSchemaTypes from '../SimpleSchemaTypes';
import BaseResource from '../../BaseResource';

export default class ResourceUsage extends BaseResource {
  static readonly TYPE: 'resource_usage' = 'resource_usage';

  /**
   * Retrieve all resource usages
   */
  list() {
    return this.rawList().then((body) =>
      Utils.deserializeResponseBody<SimpleSchemaTypes.ResourceUsageInstancesTargetSchema>(
        body,
      ),
    );
  }

  /**
   * Retrieve all resource usages
   */
  rawList(): Promise<SchemaTypes.ResourceUsageInstancesTargetSchema> {
    return this.client.request<SchemaTypes.ResourceUsageInstancesTargetSchema>({
      method: 'GET',
      url: `/resource-usages`,
    });
  }
}
