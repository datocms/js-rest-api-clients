import * as Utils from '@datocms/rest-client-utils';
import BaseResource from '../../BaseResource';
import type * as SchemaTypes from '../SchemaTypes';
import type * as SimpleSchemaTypes from '../SimpleSchemaTypes';

export default class Site extends BaseResource {
  static readonly TYPE = 'site' as const;

  /**
   * Retrieve the site
   *
   * Read more: https://www.datocms.com/docs/content-management-api/resources/site/self
   *
   * @throws {ApiError}
   * @throws {TimeoutError}
   */
  find(queryParams?: SimpleSchemaTypes.SiteSelfHrefSchema) {
    return this.rawFind(queryParams).then((body) =>
      Utils.deserializeResponseBody<SimpleSchemaTypes.SiteSelfTargetSchema>(
        body,
      ),
    );
  }

  /**
   * Retrieve the site
   *
   * Read more: https://www.datocms.com/docs/content-management-api/resources/site/self
   *
   * @throws {ApiError}
   * @throws {TimeoutError}
   */
  rawFind(
    queryParams?: SchemaTypes.SiteSelfHrefSchema,
  ): Promise<SchemaTypes.SiteSelfTargetSchema> {
    return this.client.request<SchemaTypes.SiteSelfTargetSchema>({
      method: 'GET',
      url: '/site',
      queryParams,
    });
  }

  /**
   * Update the site's settings
   *
   * Read more: https://www.datocms.com/docs/content-management-api/resources/site/update
   *
   * @throws {ApiError}
   * @throws {TimeoutError}
   */
  update(body: SimpleSchemaTypes.SiteUpdateSchema) {
    return this.rawUpdate(
      Utils.serializeRequestBody<SchemaTypes.SiteUpdateSchema>(body, {
        type: 'site',
        attributes: [
          'no_index',
          'favicon',
          'global_seo',
          'name',
          'theme',
          'locales',
          'timezone',
          'require_2fa',
          'ip_tracking_enabled',
          'force_use_of_sandbox_environments',
        ],
        relationships: ['sso_default_role'],
      }),
    ).then((body) =>
      Utils.deserializeResponseBody<SimpleSchemaTypes.SiteUpdateJobSchema>(
        body,
      ),
    );
  }

  /**
   * Update the site's settings
   *
   * Read more: https://www.datocms.com/docs/content-management-api/resources/site/update
   *
   * @throws {ApiError}
   * @throws {TimeoutError}
   */
  rawUpdate(
    body: SchemaTypes.SiteUpdateSchema,
  ): Promise<SchemaTypes.SiteUpdateJobSchema> {
    return this.client.request<SchemaTypes.SiteUpdateJobSchema>({
      method: 'PUT',
      url: '/site',
      body,
    });
  }

  /**
   * Activate improved timezone management
   *
   * Read more: https://www.datocms.com/docs/content-management-api/resources/site/activate_improved_timezone_management
   *
   * @throws {ApiError}
   * @throws {TimeoutError}
   *
   * @deprecated This API call is to be considered private and might change without notice
   */
  activateImprovedTimezoneManagement() {
    return this.rawActivateImprovedTimezoneManagement().then((body) =>
      Utils.deserializeResponseBody<SimpleSchemaTypes.SiteActivateImprovedTimezoneManagementJobSchema>(
        body,
      ),
    );
  }

  /**
   * Activate improved timezone management
   *
   * Read more: https://www.datocms.com/docs/content-management-api/resources/site/activate_improved_timezone_management
   *
   * @throws {ApiError}
   * @throws {TimeoutError}
   *
   * @deprecated This API call is to be considered private and might change without notice
   */
  rawActivateImprovedTimezoneManagement(): Promise<SchemaTypes.SiteActivateImprovedTimezoneManagementJobSchema> {
    return this.client.request<SchemaTypes.SiteActivateImprovedTimezoneManagementJobSchema>(
      {
        method: 'PUT',
        url: '/site/activate-improved-timezone-management',
      },
    );
  }

  /**
   * Activate improved hex management
   *
   * Read more: https://www.datocms.com/docs/content-management-api/resources/site/activate_improved_hex_management
   *
   * @throws {ApiError}
   * @throws {TimeoutError}
   *
   * @deprecated This API call is to be considered private and might change without notice
   */
  activateImprovedHexManagement() {
    return this.rawActivateImprovedHexManagement().then((body) =>
      Utils.deserializeResponseBody<SimpleSchemaTypes.SiteActivateImprovedHexManagementTargetSchema>(
        body,
      ),
    );
  }

  /**
   * Activate improved hex management
   *
   * Read more: https://www.datocms.com/docs/content-management-api/resources/site/activate_improved_hex_management
   *
   * @throws {ApiError}
   * @throws {TimeoutError}
   *
   * @deprecated This API call is to be considered private and might change without notice
   */
  rawActivateImprovedHexManagement(): Promise<SchemaTypes.SiteActivateImprovedHexManagementTargetSchema> {
    return this.client.request<SchemaTypes.SiteActivateImprovedHexManagementTargetSchema>(
      {
        method: 'PUT',
        url: '/site/activate-improved-hex-management',
      },
    );
  }

  /**
   * Activate improved GraphQL multi-locale fields option
   *
   * Read more: https://www.datocms.com/docs/content-management-api/resources/site/activate_improved_gql_multilocale_fields
   *
   * @throws {ApiError}
   * @throws {TimeoutError}
   *
   * @deprecated This API call is to be considered private and might change without notice
   */
  activateImprovedGqlMultilocaleFields() {
    return this.rawActivateImprovedGqlMultilocaleFields().then((body) =>
      Utils.deserializeResponseBody<SimpleSchemaTypes.SiteActivateImprovedGqlMultilocaleFieldsTargetSchema>(
        body,
      ),
    );
  }

  /**
   * Activate improved GraphQL multi-locale fields option
   *
   * Read more: https://www.datocms.com/docs/content-management-api/resources/site/activate_improved_gql_multilocale_fields
   *
   * @throws {ApiError}
   * @throws {TimeoutError}
   *
   * @deprecated This API call is to be considered private and might change without notice
   */
  rawActivateImprovedGqlMultilocaleFields(): Promise<SchemaTypes.SiteActivateImprovedGqlMultilocaleFieldsTargetSchema> {
    return this.client.request<SchemaTypes.SiteActivateImprovedGqlMultilocaleFieldsTargetSchema>(
      {
        method: 'PUT',
        url: '/site/activate-improved-gql-multilocale-fields',
      },
    );
  }

  /**
   * Activate improved GraphQL visibility control option
   *
   * Read more: https://www.datocms.com/docs/content-management-api/resources/site/activate_improved_gql_visibility_control
   *
   * @throws {ApiError}
   * @throws {TimeoutError}
   *
   * @deprecated This API call is to be considered private and might change without notice
   */
  activateImprovedGqlVisibilityControl() {
    return this.rawActivateImprovedGqlVisibilityControl().then((body) =>
      Utils.deserializeResponseBody<SimpleSchemaTypes.SiteActivateImprovedGqlVisibilityControlTargetSchema>(
        body,
      ),
    );
  }

  /**
   * Activate improved GraphQL visibility control option
   *
   * Read more: https://www.datocms.com/docs/content-management-api/resources/site/activate_improved_gql_visibility_control
   *
   * @throws {ApiError}
   * @throws {TimeoutError}
   *
   * @deprecated This API call is to be considered private and might change without notice
   */
  rawActivateImprovedGqlVisibilityControl(): Promise<SchemaTypes.SiteActivateImprovedGqlVisibilityControlTargetSchema> {
    return this.client.request<SchemaTypes.SiteActivateImprovedGqlVisibilityControlTargetSchema>(
      {
        method: 'PUT',
        url: '/site/activate-improved-gql-visibility-control',
      },
    );
  }

  /**
   * Activate improved Boolean fields option
   *
   * Read more: https://www.datocms.com/docs/content-management-api/resources/site/activate_improved_boolean_fields
   *
   * @throws {ApiError}
   * @throws {TimeoutError}
   *
   * @deprecated This API call is to be considered private and might change without notice
   */
  activateImprovedBooleanFields() {
    return this.rawActivateImprovedBooleanFields().then((body) =>
      Utils.deserializeResponseBody<SimpleSchemaTypes.SiteActivateImprovedBooleanFieldsTargetSchema>(
        body,
      ),
    );
  }

  /**
   * Activate improved Boolean fields option
   *
   * Read more: https://www.datocms.com/docs/content-management-api/resources/site/activate_improved_boolean_fields
   *
   * @throws {ApiError}
   * @throws {TimeoutError}
   *
   * @deprecated This API call is to be considered private and might change without notice
   */
  rawActivateImprovedBooleanFields(): Promise<SchemaTypes.SiteActivateImprovedBooleanFieldsTargetSchema> {
    return this.client.request<SchemaTypes.SiteActivateImprovedBooleanFieldsTargetSchema>(
      {
        method: 'PUT',
        url: '/site/activate-improved-boolean-fields',
      },
    );
  }

  /**
   * Set draft mode default to true for all environment's models
   *
   * Read more: https://www.datocms.com/docs/content-management-api/resources/site/activate_draft_mode_as_default
   *
   * @throws {ApiError}
   * @throws {TimeoutError}
   *
   * @deprecated This API call is to be considered private and might change without notice
   */
  activateDraftModeAsDefault() {
    return this.rawActivateDraftModeAsDefault().then((body) =>
      Utils.deserializeResponseBody<SimpleSchemaTypes.SiteActivateDraftModeAsDefaultTargetSchema>(
        body,
      ),
    );
  }

  /**
   * Set draft mode default to true for all environment's models
   *
   * Read more: https://www.datocms.com/docs/content-management-api/resources/site/activate_draft_mode_as_default
   *
   * @throws {ApiError}
   * @throws {TimeoutError}
   *
   * @deprecated This API call is to be considered private and might change without notice
   */
  rawActivateDraftModeAsDefault(): Promise<SchemaTypes.SiteActivateDraftModeAsDefaultTargetSchema> {
    return this.client.request<SchemaTypes.SiteActivateDraftModeAsDefaultTargetSchema>(
      {
        method: 'PUT',
        url: '/site/activate-draft-mode-as-default',
      },
    );
  }

  /**
   * Activate improved validation at publishing option
   *
   * Read more: https://www.datocms.com/docs/content-management-api/resources/site/activate_improved_validation_at_publishing
   *
   * @throws {ApiError}
   * @throws {TimeoutError}
   *
   * @deprecated This API call is to be considered private and might change without notice
   */
  activateImprovedValidationAtPublishing() {
    return this.rawActivateImprovedValidationAtPublishing().then((body) =>
      Utils.deserializeResponseBody<SimpleSchemaTypes.SiteActivateImprovedValidationAtPublishingTargetSchema>(
        body,
      ),
    );
  }

  /**
   * Activate improved validation at publishing option
   *
   * Read more: https://www.datocms.com/docs/content-management-api/resources/site/activate_improved_validation_at_publishing
   *
   * @throws {ApiError}
   * @throws {TimeoutError}
   *
   * @deprecated This API call is to be considered private and might change without notice
   */
  rawActivateImprovedValidationAtPublishing(): Promise<SchemaTypes.SiteActivateImprovedValidationAtPublishingTargetSchema> {
    return this.client.request<SchemaTypes.SiteActivateImprovedValidationAtPublishingTargetSchema>(
      {
        method: 'PUT',
        url: '/site/activate-improved-validation-at-publishing',
      },
    );
  }

  /**
   * Activate having two different GraphQL fields for regular blocks and inline blocks
   *
   * Read more: https://www.datocms.com/docs/content-management-api/resources/site/activate_improved_exposure_of_inline_blocks_in_cda
   *
   * @throws {ApiError}
   * @throws {TimeoutError}
   *
   * @deprecated This API call is to be considered private and might change without notice
   */
  activateImprovedExposureOfInlineBlocksInCda() {
    return this.rawActivateImprovedExposureOfInlineBlocksInCda().then((body) =>
      Utils.deserializeResponseBody<SimpleSchemaTypes.SiteActivateImprovedExposureOfInlineBlocksInCdaTargetSchema>(
        body,
      ),
    );
  }

  /**
   * Activate having two different GraphQL fields for regular blocks and inline blocks
   *
   * Read more: https://www.datocms.com/docs/content-management-api/resources/site/activate_improved_exposure_of_inline_blocks_in_cda
   *
   * @throws {ApiError}
   * @throws {TimeoutError}
   *
   * @deprecated This API call is to be considered private and might change without notice
   */
  rawActivateImprovedExposureOfInlineBlocksInCda(): Promise<SchemaTypes.SiteActivateImprovedExposureOfInlineBlocksInCdaTargetSchema> {
    return this.client.request<SchemaTypes.SiteActivateImprovedExposureOfInlineBlocksInCdaTargetSchema>(
      {
        method: 'PUT',
        url: '/site/activate-improved-exposure-of-inline-blocks-in-cda',
      },
    );
  }

  /**
   * Update CDN settings default assets
   *
   * Read more: https://www.datocms.com/docs/content-management-api/resources/site/update_assets_cdn_default_settings
   *
   * @throws {ApiError}
   * @throws {TimeoutError}
   *
   * @deprecated This API call is to be considered private and might change without notice
   */
  updateAssetsCdnDefaultSettings(
    body: SimpleSchemaTypes.SiteUpdateAssetsCdnDefaultSettingsSchema,
  ) {
    return this.rawUpdateAssetsCdnDefaultSettings(
      Utils.serializeRequestBody<SchemaTypes.SiteUpdateAssetsCdnDefaultSettingsSchema>(
        body,
        {
          type: 'assets-cdn-default-settings',
          attributes: ['assets_cdn_default_settings'],
          relationships: [],
        },
      ),
    ).then((body) =>
      Utils.deserializeResponseBody<SimpleSchemaTypes.SiteUpdateAssetsCdnDefaultSettingsTargetSchema>(
        body,
      ),
    );
  }

  /**
   * Update CDN settings default assets
   *
   * Read more: https://www.datocms.com/docs/content-management-api/resources/site/update_assets_cdn_default_settings
   *
   * @throws {ApiError}
   * @throws {TimeoutError}
   *
   * @deprecated This API call is to be considered private and might change without notice
   */
  rawUpdateAssetsCdnDefaultSettings(
    body: SchemaTypes.SiteUpdateAssetsCdnDefaultSettingsSchema,
  ): Promise<SchemaTypes.SiteUpdateAssetsCdnDefaultSettingsTargetSchema> {
    return this.client.request<SchemaTypes.SiteUpdateAssetsCdnDefaultSettingsTargetSchema>(
      {
        method: 'PUT',
        url: '/site/assets-cdn-default-settings',
        body,
      },
    );
  }
}
