import * as Utils from '@datocms/rest-client-utils';
import * as SchemaTypes from '../SchemaTypes';
import * as SimpleSchemaTypes from '../SimpleSchemaTypes';
import BaseResource from '../../BaseResource';

export default class PerOwnerPricingPlan extends BaseResource {
  static readonly TYPE = 'per_owner_pricing_plan' as const;

  /**
   * Retrieve enabled plans for account
   *
   * @throws {ApiError}
   * @throws {TimeoutError}
   */
  list() {
    return this.rawList().then((body) =>
      Utils.deserializeResponseBody<SimpleSchemaTypes.PerOwnerPricingPlanInstancesTargetSchema>(
        body,
      ),
    );
  }

  /**
   * Retrieve enabled plans for account
   *
   * @throws {ApiError}
   * @throws {TimeoutError}
   */
  rawList(): Promise<SchemaTypes.PerOwnerPricingPlanInstancesTargetSchema> {
    return this.client.request<SchemaTypes.PerOwnerPricingPlanInstancesTargetSchema>(
      {
        method: 'GET',
        url: '/per-owner-pricing-plans',
      },
    );
  }

  /**
   * Retrieve plans that the organization can enable on other organizations given a mandate
   *
   * @throws {ApiError}
   * @throws {TimeoutError}
   */
  activableAsAppointedOrganizationList() {
    return this.rawActivableAsAppointedOrganizationList().then((body) =>
      Utils.deserializeResponseBody<SimpleSchemaTypes.PerOwnerPricingPlanActivableAsAppointedOrganizationInstancesTargetSchema>(
        body,
      ),
    );
  }

  /**
   * Retrieve plans that the organization can enable on other organizations given a mandate
   *
   * @throws {ApiError}
   * @throws {TimeoutError}
   */
  rawActivableAsAppointedOrganizationList(): Promise<SchemaTypes.PerOwnerPricingPlanActivableAsAppointedOrganizationInstancesTargetSchema> {
    return this.client.request<SchemaTypes.PerOwnerPricingPlanActivableAsAppointedOrganizationInstancesTargetSchema>(
      {
        method: 'GET',
        url: '/per-owner-pricing-plans/activable-as-appointed-organization',
      },
    );
  }
}
