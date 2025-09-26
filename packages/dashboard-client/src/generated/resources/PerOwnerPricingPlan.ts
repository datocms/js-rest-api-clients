import * as Utils from '@datocms/rest-client-utils';
import BaseResource from '../../BaseResource';
import type * as ApiTypes from '../ApiTypes';
import type * as RawApiTypes from '../RawApiTypes';

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
      Utils.deserializeResponseBody<ApiTypes.PerOwnerPricingPlanInstancesTargetSchema>(
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
  rawList(): Promise<RawApiTypes.PerOwnerPricingPlanInstancesTargetSchema> {
    return this.client.request<RawApiTypes.PerOwnerPricingPlanInstancesTargetSchema>(
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
      Utils.deserializeResponseBody<ApiTypes.PerOwnerPricingPlanActivableAsAppointedOrganizationInstancesTargetSchema>(
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
  rawActivableAsAppointedOrganizationList(): Promise<RawApiTypes.PerOwnerPricingPlanActivableAsAppointedOrganizationInstancesTargetSchema> {
    return this.client.request<RawApiTypes.PerOwnerPricingPlanActivableAsAppointedOrganizationInstancesTargetSchema>(
      {
        method: 'GET',
        url: '/per-owner-pricing-plans/activable-as-appointed-organization',
      },
    );
  }
}
