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

export default class AccountPlan extends BaseResource {
  static readonly TYPE: 'account_plan' = 'account_plan';

  /**
   * Retrieve enabled plans for account
   */
  list() {
    return this.rawList().then((body) =>
      deserializeResponseBody<SimpleSchemaTypes.AccountPlanInstancesTargetSchema>(
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
