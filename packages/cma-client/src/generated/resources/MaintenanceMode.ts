import * as Utils from '@datocms/rest-client-utils';
import BaseResource from '../../BaseResource';
import type * as ApiTypes from '../ApiTypes';
import type * as RawApiTypes from '../RawApiTypes';

export default class MaintenanceMode extends BaseResource {
  static readonly TYPE = 'maintenance_mode' as const;

  /**
   * Retrieve maintenence mode
   *
   * Read more: https://www.datocms.com/docs/content-management-api/resources/maintenance-mode/self
   *
   * @throws {ApiError}
   * @throws {TimeoutError}
   */
  find() {
    return this.rawFind().then((body) =>
      Utils.deserializeResponseBody<ApiTypes.MaintenanceModeSelfTargetSchema>(
        body,
      ),
    );
  }

  /**
   * Retrieve maintenence mode
   *
   * Read more: https://www.datocms.com/docs/content-management-api/resources/maintenance-mode/self
   *
   * @throws {ApiError}
   * @throws {TimeoutError}
   */
  rawFind(): Promise<RawApiTypes.MaintenanceModeSelfTargetSchema> {
    return this.client.request<RawApiTypes.MaintenanceModeSelfTargetSchema>({
      method: 'GET',
      url: '/maintenance-mode',
    });
  }

  /**
   * Activate maintenance mode: this means that the primary environment will be read-only
   *
   * Read more: https://www.datocms.com/docs/content-management-api/resources/maintenance-mode/activate
   *
   * @throws {ApiError}
   * @throws {TimeoutError}
   */
  activate(queryParams?: ApiTypes.MaintenanceModeActivateHrefSchema) {
    return this.rawActivate(queryParams).then((body) =>
      Utils.deserializeResponseBody<ApiTypes.MaintenanceModeActivateTargetSchema>(
        body,
      ),
    );
  }

  /**
   * Activate maintenance mode: this means that the primary environment will be read-only
   *
   * Read more: https://www.datocms.com/docs/content-management-api/resources/maintenance-mode/activate
   *
   * @throws {ApiError}
   * @throws {TimeoutError}
   */
  rawActivate(
    queryParams?: RawApiTypes.MaintenanceModeActivateHrefSchema,
  ): Promise<RawApiTypes.MaintenanceModeActivateTargetSchema> {
    return this.client.request<RawApiTypes.MaintenanceModeActivateTargetSchema>(
      {
        method: 'PUT',
        url: '/maintenance-mode/activate',
        queryParams,
      },
    );
  }

  /**
   * De-activate maintenance mode
   *
   * Read more: https://www.datocms.com/docs/content-management-api/resources/maintenance-mode/deactivate
   *
   * @throws {ApiError}
   * @throws {TimeoutError}
   */
  deactivate() {
    return this.rawDeactivate().then((body) =>
      Utils.deserializeResponseBody<ApiTypes.MaintenanceModeDeactivateTargetSchema>(
        body,
      ),
    );
  }

  /**
   * De-activate maintenance mode
   *
   * Read more: https://www.datocms.com/docs/content-management-api/resources/maintenance-mode/deactivate
   *
   * @throws {ApiError}
   * @throws {TimeoutError}
   */
  rawDeactivate(): Promise<RawApiTypes.MaintenanceModeDeactivateTargetSchema> {
    return this.client.request<RawApiTypes.MaintenanceModeDeactivateTargetSchema>(
      {
        method: 'PUT',
        url: '/maintenance-mode/deactivate',
      },
    );
  }
}
