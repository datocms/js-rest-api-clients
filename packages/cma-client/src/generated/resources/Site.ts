import * as Utils from '@datocms/rest-client-utils';
import BaseResource from '../../BaseResource';
import type * as ApiTypes from '../ApiTypes';
import type * as RawApiTypes from '../RawApiTypes';

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
  find(queryParams?: ApiTypes.SiteSelfHrefSchema) {
    return this.rawFind(queryParams).then((body) =>
      Utils.deserializeResponseBody<ApiTypes.SiteSelfTargetSchema>(body),
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
    queryParams?: RawApiTypes.SiteSelfHrefSchema,
  ): Promise<RawApiTypes.SiteSelfTargetSchema> {
    return this.client.request<RawApiTypes.SiteSelfTargetSchema>({
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
  update(body: ApiTypes.SiteUpdateSchema) {
    return this.rawUpdate(
      Utils.serializeRequestBody<RawApiTypes.SiteUpdateSchema>(body, {
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
      Utils.deserializeResponseBody<ApiTypes.SiteUpdateJobSchema>(body),
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
    body: RawApiTypes.SiteUpdateSchema,
  ): Promise<RawApiTypes.SiteUpdateJobSchema> {
    return this.client.request<RawApiTypes.SiteUpdateJobSchema>({
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
      Utils.deserializeResponseBody<ApiTypes.SiteActivateImprovedTimezoneManagementJobSchema>(
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
  rawActivateImprovedTimezoneManagement(): Promise<RawApiTypes.SiteActivateImprovedTimezoneManagementJobSchema> {
    return this.client.request<RawApiTypes.SiteActivateImprovedTimezoneManagementJobSchema>(
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
      Utils.deserializeResponseBody<ApiTypes.SiteActivateImprovedHexManagementTargetSchema>(
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
  rawActivateImprovedHexManagement(): Promise<RawApiTypes.SiteActivateImprovedHexManagementTargetSchema> {
    return this.client.request<RawApiTypes.SiteActivateImprovedHexManagementTargetSchema>(
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
      Utils.deserializeResponseBody<ApiTypes.SiteActivateImprovedGqlMultilocaleFieldsTargetSchema>(
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
  rawActivateImprovedGqlMultilocaleFields(): Promise<RawApiTypes.SiteActivateImprovedGqlMultilocaleFieldsTargetSchema> {
    return this.client.request<RawApiTypes.SiteActivateImprovedGqlMultilocaleFieldsTargetSchema>(
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
      Utils.deserializeResponseBody<ApiTypes.SiteActivateImprovedGqlVisibilityControlTargetSchema>(
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
  rawActivateImprovedGqlVisibilityControl(): Promise<RawApiTypes.SiteActivateImprovedGqlVisibilityControlTargetSchema> {
    return this.client.request<RawApiTypes.SiteActivateImprovedGqlVisibilityControlTargetSchema>(
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
      Utils.deserializeResponseBody<ApiTypes.SiteActivateImprovedBooleanFieldsTargetSchema>(
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
  rawActivateImprovedBooleanFields(): Promise<RawApiTypes.SiteActivateImprovedBooleanFieldsTargetSchema> {
    return this.client.request<RawApiTypes.SiteActivateImprovedBooleanFieldsTargetSchema>(
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
      Utils.deserializeResponseBody<ApiTypes.SiteActivateDraftModeAsDefaultTargetSchema>(
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
  rawActivateDraftModeAsDefault(): Promise<RawApiTypes.SiteActivateDraftModeAsDefaultTargetSchema> {
    return this.client.request<RawApiTypes.SiteActivateDraftModeAsDefaultTargetSchema>(
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
      Utils.deserializeResponseBody<ApiTypes.SiteActivateImprovedValidationAtPublishingTargetSchema>(
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
  rawActivateImprovedValidationAtPublishing(): Promise<RawApiTypes.SiteActivateImprovedValidationAtPublishingTargetSchema> {
    return this.client.request<RawApiTypes.SiteActivateImprovedValidationAtPublishingTargetSchema>(
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
      Utils.deserializeResponseBody<ApiTypes.SiteActivateImprovedExposureOfInlineBlocksInCdaTargetSchema>(
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
  rawActivateImprovedExposureOfInlineBlocksInCda(): Promise<RawApiTypes.SiteActivateImprovedExposureOfInlineBlocksInCdaTargetSchema> {
    return this.client.request<RawApiTypes.SiteActivateImprovedExposureOfInlineBlocksInCdaTargetSchema>(
      {
        method: 'PUT',
        url: '/site/activate-improved-exposure-of-inline-blocks-in-cda',
      },
    );
  }

  /**
   * Activate improved items listing
   *
   * Read more: https://www.datocms.com/docs/content-management-api/resources/site/activate_improved_items_listing
   *
   * @throws {ApiError}
   * @throws {TimeoutError}
   *
   * @deprecated This API call is to be considered private and might change without notice
   */
  activateImprovedItemsListing() {
    return this.rawActivateImprovedItemsListing().then((body) =>
      Utils.deserializeResponseBody<ApiTypes.SiteActivateImprovedItemsListingTargetSchema>(
        body,
      ),
    );
  }

  /**
   * Activate improved items listing
   *
   * Read more: https://www.datocms.com/docs/content-management-api/resources/site/activate_improved_items_listing
   *
   * @throws {ApiError}
   * @throws {TimeoutError}
   *
   * @deprecated This API call is to be considered private and might change without notice
   */
  rawActivateImprovedItemsListing(): Promise<RawApiTypes.SiteActivateImprovedItemsListingTargetSchema> {
    return this.client.request<RawApiTypes.SiteActivateImprovedItemsListingTargetSchema>(
      {
        method: 'PUT',
        url: '/site/activate-improved-items-listing',
      },
    );
  }

  /**
   * Activate milliseconds in datetime
   *
   * Read more: https://www.datocms.com/docs/content-management-api/resources/site/activate_milliseconds_in_datetime
   *
   * @throws {ApiError}
   * @throws {TimeoutError}
   *
   * @deprecated This API call is to be considered private and might change without notice
   */
  activateMillisecondsInDatetime() {
    return this.rawActivateMillisecondsInDatetime().then((body) =>
      Utils.deserializeResponseBody<ApiTypes.SiteActivateMillisecondsInDatetimeTargetSchema>(
        body,
      ),
    );
  }

  /**
   * Activate milliseconds in datetime
   *
   * Read more: https://www.datocms.com/docs/content-management-api/resources/site/activate_milliseconds_in_datetime
   *
   * @throws {ApiError}
   * @throws {TimeoutError}
   *
   * @deprecated This API call is to be considered private and might change without notice
   */
  rawActivateMillisecondsInDatetime(): Promise<RawApiTypes.SiteActivateMillisecondsInDatetimeTargetSchema> {
    return this.client.request<RawApiTypes.SiteActivateMillisecondsInDatetimeTargetSchema>(
      {
        method: 'PUT',
        url: '/site/activate-milliseconds-in-datetime',
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
    body: ApiTypes.SiteUpdateAssetsCdnDefaultSettingsSchema,
  ) {
    return this.rawUpdateAssetsCdnDefaultSettings(
      Utils.serializeRequestBody<RawApiTypes.SiteUpdateAssetsCdnDefaultSettingsSchema>(
        body,
        {
          type: 'assets-cdn-default-settings',
          attributes: ['assets_cdn_default_settings'],
          relationships: [],
        },
      ),
    ).then((body) =>
      Utils.deserializeResponseBody<ApiTypes.SiteUpdateAssetsCdnDefaultSettingsTargetSchema>(
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
    body: RawApiTypes.SiteUpdateAssetsCdnDefaultSettingsSchema,
  ): Promise<RawApiTypes.SiteUpdateAssetsCdnDefaultSettingsTargetSchema> {
    return this.client.request<RawApiTypes.SiteUpdateAssetsCdnDefaultSettingsTargetSchema>(
      {
        method: 'PUT',
        url: '/site/assets-cdn-default-settings',
        body,
      },
    );
  }
}
