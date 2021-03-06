import * as Utils from '@datocms/rest-client-utils';
import * as SchemaTypes from '../SchemaTypes';
import * as SimpleSchemaTypes from '../SimpleSchemaTypes';
import BaseResource from '../../BaseResource';

export default class SitePlan extends BaseResource {
  static readonly TYPE: 'site_plan' = 'site_plan';

  /**
   * Retrieve enabled plans for account
   */
  list() {
    return this.rawList().then((body) =>
      Utils.deserializeResponseBody<SimpleSchemaTypes.SitePlanInstancesTargetSchema>(
        body,
      ),
    );
  }

  /**
   * Retrieve enabled plans for account
   */
  rawList(): Promise<SchemaTypes.SitePlanInstancesTargetSchema> {
    return this.client.request<SchemaTypes.SitePlanInstancesTargetSchema>({
      method: 'GET',
      url: `/site-plans`,
    });
  }
}
