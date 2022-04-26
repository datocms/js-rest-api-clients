import * as Utils from '@datocms/rest-client-utils';
import * as SchemaTypes from '../SchemaTypes';
import * as SimpleSchemaTypes from '../SimpleSchemaTypes';
import BaseResource from '../../BaseResource';

export default class WhiteLabelSettings extends BaseResource {
  static readonly TYPE: 'white_label_settings' = 'white_label_settings';

  /**
   * Retrieve white-label settings
   *
   * Read more: https://www.datocms.com/docs/content-management-api/resources/white-label_settings/self
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
   */
  rawFind(): Promise<SchemaTypes.WhiteLabelSettingsSelfTargetSchema> {
    return this.client.request<SchemaTypes.WhiteLabelSettingsSelfTargetSchema>({
      method: 'GET',
      url: `/white-label-settings`,
    });
  }

  /**
   * Update white-label settings
   *
   * Read more: https://www.datocms.com/docs/content-management-api/resources/white-label_settings/update
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
   */
  rawUpdate(
    body: SchemaTypes.WhiteLabelSettingsUpdateSchema,
  ): Promise<SchemaTypes.WhiteLabelSettingsUpdateTargetSchema> {
    return this.client.request<SchemaTypes.WhiteLabelSettingsUpdateTargetSchema>(
      {
        method: 'PUT',
        url: `/white-label-settings`,
        body,
      },
    );
  }
}
