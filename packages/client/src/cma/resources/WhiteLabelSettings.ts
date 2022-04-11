import BaseResource from '../BaseResource';
import serializeRequestBody from '../../serializeRequestBody';
import deserializeResponseBody from '../../deserializeResponseBody';
import toId from '../../toId';
import * as SchemaTypes from '../SchemaTypes';
import * as SimpleSchemaTypes from '../SimpleSchemaTypes';

export default class WhiteLabelSettings extends BaseResource {
  static readonly TYPE: 'white_label_settings' = 'white_label_settings';

  /**
   * Retrieve white-label settings
   *
   * Read more: https://www.datocms.com/docs/content-management-api/resources/white-label_settings/self
   */
  find() {
    return this.rawFind().then((body) =>
      deserializeResponseBody<SimpleSchemaTypes.WhiteLabelSettingsSelfTargetSchema>(
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
      serializeRequestBody<SchemaTypes.WhiteLabelSettingsUpdateSchema>({
        body,
        type: WhiteLabelSettings.TYPE,
      }),
    ).then((body) =>
      deserializeResponseBody<SimpleSchemaTypes.WhiteLabelSettingsUpdateTargetSchema>(
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
