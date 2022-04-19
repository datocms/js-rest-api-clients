import * as Utils from '@datocms/rest-client-utils';
import * as SchemaTypes from '../SchemaTypes';
import * as SimpleSchemaTypes from '../SimpleSchemaTypes';
import BaseResource from '../../BaseResource';

export default class MaintenanceMode extends BaseResource {
  static readonly TYPE: 'maintenance_mode' = 'maintenance_mode';

  /**
   * Retrieve maintenence mode
   *
   * Read more: https://www.datocms.com/docs/content-management-api/resources/maintenance-mode/self
   */
  find() {
    return this.rawFind().then((body) =>
      Utils.deserializeResponseBody<SimpleSchemaTypes.MaintenanceModeSelfTargetSchema>(
        body,
      ),
    );
  }

  /**
   * Retrieve maintenence mode
   *
   * Read more: https://www.datocms.com/docs/content-management-api/resources/maintenance-mode/self
   */
  rawFind(): Promise<SchemaTypes.MaintenanceModeSelfTargetSchema> {
    return this.client.request<SchemaTypes.MaintenanceModeSelfTargetSchema>({
      method: 'GET',
      url: `/maintenance-mode`,
    });
  }

  /**
   * Activate maintenance mode: this means that the primary environment will be read-only
   *
   * Read more: https://www.datocms.com/docs/content-management-api/resources/maintenance-mode/activate
   */
  activate(queryParams?: SimpleSchemaTypes.MaintenanceModeActivateHrefSchema) {
    return this.rawActivate(queryParams).then((body) =>
      Utils.deserializeResponseBody<SimpleSchemaTypes.MaintenanceModeActivateTargetSchema>(
        body,
      ),
    );
  }

  /**
   * Activate maintenance mode: this means that the primary environment will be read-only
   *
   * Read more: https://www.datocms.com/docs/content-management-api/resources/maintenance-mode/activate
   */
  rawActivate(
    queryParams?: SchemaTypes.MaintenanceModeActivateHrefSchema,
  ): Promise<SchemaTypes.MaintenanceModeActivateTargetSchema> {
    return this.client.request<SchemaTypes.MaintenanceModeActivateTargetSchema>(
      {
        method: 'PUT',
        url: `/maintenance-mode/activate`,
        queryParams,
      },
    );
  }

  /**
   * De-activate maintenance mode
   *
   * Read more: https://www.datocms.com/docs/content-management-api/resources/maintenance-mode/deactivate
   */
  deactivate() {
    return this.rawDeactivate().then((body) =>
      Utils.deserializeResponseBody<SimpleSchemaTypes.MaintenanceModeDeactivateTargetSchema>(
        body,
      ),
    );
  }

  /**
   * De-activate maintenance mode
   *
   * Read more: https://www.datocms.com/docs/content-management-api/resources/maintenance-mode/deactivate
   */
  rawDeactivate(): Promise<SchemaTypes.MaintenanceModeDeactivateTargetSchema> {
    return this.client.request<SchemaTypes.MaintenanceModeDeactivateTargetSchema>(
      {
        method: 'PUT',
        url: `/maintenance-mode/deactivate`,
      },
    );
  }
}
