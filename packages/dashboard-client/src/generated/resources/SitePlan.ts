import * as Utils from '@datocms/rest-client-utils';
import BaseResource from '../../BaseResource';
import type * as ApiTypes from '../ApiTypes';
import type * as RawApiTypes from '../RawApiTypes';

export default class SitePlan extends BaseResource {
  static readonly TYPE = 'site_plan' as const;

  /**
   * Retrieve enabled plans for account
   *
   * @throws {ApiError}
   * @throws {TimeoutError}
   */
  list() {
    return this.rawList().then((body) =>
      Utils.deserializeResponseBody<ApiTypes.SitePlanInstancesTargetSchema>(
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
  rawList(): Promise<RawApiTypes.SitePlanInstancesTargetSchema> {
    return this.client.request<RawApiTypes.SitePlanInstancesTargetSchema>({
      method: 'GET',
      url: '/site-plans',
    });
  }
}
