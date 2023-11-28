import * as Utils from '@datocms/rest-client-utils';
import * as SchemaTypes from '../SchemaTypes';
import * as SimpleSchemaTypes from '../SimpleSchemaTypes';
import BaseResource from '../../BaseResource';

export default class Site extends BaseResource {
  static readonly TYPE: 'site' = 'site';

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
}
