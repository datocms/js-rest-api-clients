import * as Utils from '@datocms/rest-client-utils';
import BaseResource from '../../BaseResource';
import type * as SchemaTypes from '../SchemaTypes';
import type * as SimpleSchemaTypes from '../SimpleSchemaTypes';

export default class WhiteLabelSettings extends BaseResource {
  static readonly TYPE = 'white_label_settings' as const;

  /**
   * Retrieve white-label settings
   *
   * Read more: https://www.datocms.com/docs/content-management-api/resources/white-label_settings/self
   *
   * @throws {ApiError}
   * @throws {TimeoutError}
   */
  find() {
    return this.rawFind().then((body) =>
      Utils.deserializeResponseBody<SimpleSchemaTypes.WhiteLabelSettingsSelfTargetSchema>(
        body,
      ),
    );
  }

  /**
   * Retrieve white-label settings
   *
   * Read more: https://www.datocms.com/docs/content-management-api/resources/white-label_settings/self
   *
   * @throws {ApiError}
   * @throws {TimeoutError}
   */
  rawFind(): Promise<SchemaTypes.WhiteLabelSettingsSelfTargetSchema> {
    return this.client.request<SchemaTypes.WhiteLabelSettingsSelfTargetSchema>({
      method: 'GET',
      url: '/white-label-settings',
    });
  }

  /**
   * Update white-label settings
   *
   * Read more: https://www.datocms.com/docs/content-management-api/resources/white-label_settings/update
   *
   * @throws {ApiError}
   * @throws {TimeoutError}
   */
  update(body: SimpleSchemaTypes.WhiteLabelSettingsUpdateSchema) {
    return this.rawUpdate(
      Utils.serializeRequestBody<SchemaTypes.WhiteLabelSettingsUpdateSchema>(
        body,
        {
          type: 'white_label_settings',
          attributes: ['custom_i18n_messages_template_url'],
          relationships: [],
        },
      ),
    ).then((body) =>
      Utils.deserializeResponseBody<SimpleSchemaTypes.WhiteLabelSettingsUpdateTargetSchema>(
        body,
      ),
    );
  }

  /**
   * Update white-label settings
   *
   * Read more: https://www.datocms.com/docs/content-management-api/resources/white-label_settings/update
   *
   * @throws {ApiError}
   * @throws {TimeoutError}
   */
  rawUpdate(
    body: SchemaTypes.WhiteLabelSettingsUpdateSchema,
  ): Promise<SchemaTypes.WhiteLabelSettingsUpdateTargetSchema> {
    return this.client.request<SchemaTypes.WhiteLabelSettingsUpdateTargetSchema>(
      {
        method: 'PUT',
        url: '/white-label-settings',
        body,
      },
    );
  }
}
