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
   */
  rawFind(
    queryParams?: SchemaTypes.SiteSelfHrefSchema,
  ): Promise<SchemaTypes.SiteSelfTargetSchema> {
    return this.client.request<SchemaTypes.SiteSelfTargetSchema>({
      method: 'GET',
      url: `/site`,
      queryParams,
    });
  }

  /**
   * Update the site's settings
   *
   * Read more: https://www.datocms.com/docs/content-management-api/resources/site/update
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
   */
  rawUpdate(
    body: SchemaTypes.SiteUpdateSchema,
  ): Promise<SchemaTypes.SiteUpdateJobSchema> {
    return this.client.request<SchemaTypes.SiteUpdateJobSchema>({
      method: 'PUT',
      url: `/site`,
      body,
    });
  }

  /**
   * Activate improved timezone management
   *
   * Read more: https://www.datocms.com/docs/content-management-api/resources/site/activate_improved_timezone_management
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
   */
  rawActivateImprovedTimezoneManagement(): Promise<SchemaTypes.SiteActivateImprovedTimezoneManagementJobSchema> {
    return this.client.request<SchemaTypes.SiteActivateImprovedTimezoneManagementJobSchema>(
      {
        method: 'PUT',
        url: `/site/activate-improved-timezone-management`,
      },
    );
  }
}
