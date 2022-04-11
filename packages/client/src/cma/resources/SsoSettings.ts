import BaseResource from '../BaseResource';
import serializeRequestBody from '../../serializeRequestBody';
import deserializeResponseBody from '../../deserializeResponseBody';
import toId from '../../toId';
import * as SchemaTypes from '../SchemaTypes';
import * as SimpleSchemaTypes from '../SimpleSchemaTypes';

export default class SsoSettings extends BaseResource {
  static readonly TYPE: 'sso_settings' = 'sso_settings';

  /**
   * Retrieve SSO Settings
   *
   * Read more: https://www.datocms.com/docs/content-management-api/resources/sso-settings/self
   */
  find() {
    return this.rawFind().then((body) =>
      deserializeResponseBody<SimpleSchemaTypes.SsoSettingsSelfTargetSchema>(
        body,
      ),
    );
  }

  /**
   * Retrieve SSO Settings
   *
   * Read more: https://www.datocms.com/docs/content-management-api/resources/sso-settings/self
   */
  rawFind(): Promise<SchemaTypes.SsoSettingsSelfTargetSchema> {
    return this.client.request<SchemaTypes.SsoSettingsSelfTargetSchema>({
      method: 'GET',
      url: `/sso-settings`,
    });
  }

  /**
   * Generate SSO token
   *
   * Read more: https://www.datocms.com/docs/content-management-api/resources/sso-settings/generate_token
   */
  generateToken() {
    return this.rawGenerateToken().then((body) =>
      deserializeResponseBody<SimpleSchemaTypes.SsoSettingsGenerateTokenTargetSchema>(
        body,
      ),
    );
  }

  /**
   * Generate SSO token
   *
   * Read more: https://www.datocms.com/docs/content-management-api/resources/sso-settings/generate_token
   */
  rawGenerateToken(): Promise<SchemaTypes.SsoSettingsGenerateTokenTargetSchema> {
    return this.client.request<SchemaTypes.SsoSettingsGenerateTokenTargetSchema>(
      {
        method: 'PUT',
        url: `/sso-settings/generate-token`,
      },
    );
  }

  /**
   * Update SSO Settings
   *
   * Read more: https://www.datocms.com/docs/content-management-api/resources/sso-settings/update
   */
  update(body: SimpleSchemaTypes.SsoSettingsUpdateSchema) {
    return this.rawUpdate(
      serializeRequestBody<SchemaTypes.SsoSettingsUpdateSchema>({
        body,
        type: SsoSettings.TYPE,
      }),
    ).then((body) =>
      deserializeResponseBody<SimpleSchemaTypes.SsoSettingsUpdateTargetSchema>(
        body,
      ),
    );
  }

  /**
   * Update SSO Settings
   *
   * Read more: https://www.datocms.com/docs/content-management-api/resources/sso-settings/update
   */
  rawUpdate(
    body: SchemaTypes.SsoSettingsUpdateSchema,
  ): Promise<SchemaTypes.SsoSettingsUpdateTargetSchema> {
    return this.client.request<SchemaTypes.SsoSettingsUpdateTargetSchema>({
      method: 'PUT',
      url: `/sso-settings`,
      body,
    });
  }
}
