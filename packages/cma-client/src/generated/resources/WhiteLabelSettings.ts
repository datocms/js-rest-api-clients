import * as Utils from '@datocms/rest-client-utils';
import BaseResource from '../../BaseResource';
import type * as ApiTypes from '../ApiTypes';
import type * as RawApiTypes from '../RawApiTypes';

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
      Utils.deserializeResponseBody<ApiTypes.WhiteLabelSettingsSelfTargetSchema>(
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
  rawFind(): Promise<RawApiTypes.WhiteLabelSettingsSelfTargetSchema> {
    return this.client.request<RawApiTypes.WhiteLabelSettingsSelfTargetSchema>({
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
  update(body: ApiTypes.WhiteLabelSettingsUpdateSchema) {
    return this.rawUpdate(
      Utils.serializeRequestBody<RawApiTypes.WhiteLabelSettingsUpdateSchema>(
        body,
        {
          type: 'white_label_settings',
          attributes: ['custom_i18n_messages_template_url'],
          relationships: [],
        },
      ),
    ).then((body) =>
      Utils.deserializeResponseBody<ApiTypes.WhiteLabelSettingsUpdateTargetSchema>(
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
    body: RawApiTypes.WhiteLabelSettingsUpdateSchema,
  ): Promise<RawApiTypes.WhiteLabelSettingsUpdateTargetSchema> {
    return this.client.request<RawApiTypes.WhiteLabelSettingsUpdateTargetSchema>(
      {
        method: 'PUT',
        url: '/white-label-settings',
        body,
      },
    );
  }
}
