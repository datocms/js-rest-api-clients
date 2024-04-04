import * as Utils from '@datocms/rest-client-utils';
import BaseResource from '../../BaseResource';
import type * as SchemaTypes from '../SchemaTypes';
import type * as SimpleSchemaTypes from '../SimpleSchemaTypes';

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
      Utils.deserializeResponseBody<SimpleSchemaTypes.SsoSettingsSelfTargetSchema>(
        body,
      ),
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
  rawFind(): Promise<SchemaTypes.SsoSettingsSelfTargetSchema> {
    return this.client.request<SchemaTypes.SsoSettingsSelfTargetSchema>({
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
      Utils.deserializeResponseBody<SimpleSchemaTypes.SsoSettingsGenerateTokenTargetSchema>(
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
  rawGenerateToken(): Promise<SchemaTypes.SsoSettingsGenerateTokenTargetSchema> {
    return this.client.request<SchemaTypes.SsoSettingsGenerateTokenTargetSchema>(
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
  update(body: SimpleSchemaTypes.SsoSettingsUpdateSchema) {
    return this.rawUpdate(
      Utils.serializeRequestBody<SchemaTypes.SsoSettingsUpdateSchema>(body, {
        type: 'sso_settings',
        attributes: ['idp_saml_metadata_url', 'idp_saml_metadata_xml'],
        relationships: ['default_role'],
      }),
    ).then((body) =>
      Utils.deserializeResponseBody<SimpleSchemaTypes.SsoSettingsUpdateTargetSchema>(
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
    body: SchemaTypes.SsoSettingsUpdateSchema,
  ): Promise<SchemaTypes.SsoSettingsUpdateTargetSchema> {
    return this.client.request<SchemaTypes.SsoSettingsUpdateTargetSchema>({
      method: 'PUT',
      url: '/sso-settings',
      body,
    });
  }
}
