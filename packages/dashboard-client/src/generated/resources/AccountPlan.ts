import * as Utils from '@datocms/rest-client-utils';
import * as SchemaTypes from '../SchemaTypes';
import * as SimpleSchemaTypes from '../SimpleSchemaTypes';
import BaseResource from '../../BaseResource';

export default class AccountPlan extends BaseResource {
  static readonly TYPE: 'account_plan' = 'account_plan';

  /**
   * Retrieve enabled plans for account
   */
  list() {
    return this.rawList().then((body) =>
      Utils.deserializeResponseBody<SimpleSchemaTypes.AccountPlanInstancesTargetSchema>(
        body,
      ),
    );
  }

  /**
   * Retrieve enabled plans for account
   */
  rawList(): Promise<SchemaTypes.AccountPlanInstancesTargetSchema> {
    return this.client.request<SchemaTypes.AccountPlanInstancesTargetSchema>({
      method: 'GET',
      url: `/account-plans`,
    });
  }
}
