import * as Utils from '@datocms/rest-client-utils';
import BaseResource from '../../BaseResource';
import type * as ApiTypes from '../ApiTypes';
import type * as RawApiTypes from '../RawApiTypes';

export default class ResourceUsage extends BaseResource {
  static readonly TYPE = 'resource_usage' as const;

  /**
   * Retrieve all resource usages
   *
   * @throws {ApiError}
   * @throws {TimeoutError}
   */
  list() {
    return this.rawList().then((body) =>
      Utils.deserializeResponseBody<ApiTypes.ResourceUsageInstancesTargetSchema>(
        body,
      ),
    );
  }

  /**
   * Retrieve all resource usages
   *
   * @throws {ApiError}
   * @throws {TimeoutError}
   */
  rawList(): Promise<RawApiTypes.ResourceUsageInstancesTargetSchema> {
    return this.client.request<RawApiTypes.ResourceUsageInstancesTargetSchema>({
      method: 'GET',
      url: '/resource-usages',
    });
  }
}
