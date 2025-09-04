import * as Utils from '@datocms/rest-client-utils';
import BaseResource from '../../BaseResource';
import type * as ApiTypes from '../ApiTypes';
import type * as RawApiTypes from '../RawApiTypes';

export default class SsoSettings extends BaseResource {
  static readonly TYPE = 'sso_settings' as const;

  /**
   * Retrieve SSO Settings
   *
   * Read more: https://www.datocms.com/docs/content-management-api/resources/sso-settings/self
   *
   * @throws {ApiError}
   * @throws {TimeoutError}
   */
  find() {
    return this.rawFind().then((body) =>
      Utils.deserializeResponseBody<ApiTypes.SsoSettingsSelfTargetSchema>(body),
    );
  }

  /**
   * Retrieve SSO Settings
   *
   * Read more: https://www.datocms.com/docs/content-management-api/resources/sso-settings/self
   *
   * @throws {ApiError}
   * @throws {TimeoutError}
   */
  rawFind(): Promise<RawApiTypes.SsoSettingsSelfTargetSchema> {
    return this.client.request<RawApiTypes.SsoSettingsSelfTargetSchema>({
      method: 'GET',
      url: '/sso-settings',
    });
  }

  /**
   * Generate SSO token
   *
   * Read more: https://www.datocms.com/docs/content-management-api/resources/sso-settings/generate_token
   *
   * @throws {ApiError}
   * @throws {TimeoutError}
   */
  generateToken() {
    return this.rawGenerateToken().then((body) =>
      Utils.deserializeResponseBody<ApiTypes.SsoSettingsGenerateTokenTargetSchema>(
        body,
      ),
    );
  }

  /**
   * Generate SSO token
   *
   * Read more: https://www.datocms.com/docs/content-management-api/resources/sso-settings/generate_token
   *
   * @throws {ApiError}
   * @throws {TimeoutError}
   */
  rawGenerateToken(): Promise<RawApiTypes.SsoSettingsGenerateTokenTargetSchema> {
    return this.client.request<RawApiTypes.SsoSettingsGenerateTokenTargetSchema>(
      {
        method: 'PUT',
        url: '/sso-settings/generate-token',
      },
    );
  }

  /**
   * Update SSO Settings
   *
   * Read more: https://www.datocms.com/docs/content-management-api/resources/sso-settings/update
   *
   * @throws {ApiError}
   * @throws {TimeoutError}
   */
  update(body: ApiTypes.SsoSettingsUpdateSchema) {
    return this.rawUpdate(
      Utils.serializeRequestBody<RawApiTypes.SsoSettingsUpdateSchema>(body, {
        type: 'sso_settings',
        attributes: ['idp_saml_metadata_url', 'idp_saml_metadata_xml'],
        relationships: ['default_role'],
      }),
    ).then((body) =>
      Utils.deserializeResponseBody<ApiTypes.SsoSettingsUpdateTargetSchema>(
        body,
      ),
    );
  }

  /**
   * Update SSO Settings
   *
   * Read more: https://www.datocms.com/docs/content-management-api/resources/sso-settings/update
   *
   * @throws {ApiError}
   * @throws {TimeoutError}
   */
  rawUpdate(
    body: RawApiTypes.SsoSettingsUpdateSchema,
  ): Promise<RawApiTypes.SsoSettingsUpdateTargetSchema> {
    return this.client.request<RawApiTypes.SsoSettingsUpdateTargetSchema>({
      method: 'PUT',
      url: '/sso-settings',
      body,
    });
  }
}
