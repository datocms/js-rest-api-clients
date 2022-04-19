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
  find() {
    return this.rawFind().then((body) =>
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
  rawFind(): Promise<SchemaTypes.SiteSelfTargetSchema> {
    return this.client.request<SchemaTypes.SiteSelfTargetSchema>({
      method: 'GET',
      url: `/site`,
    });
  }

  /**
   * Update the site's settings
   *
   * Read more: https://www.datocms.com/docs/content-management-api/resources/site/update
   */
  update(body: SimpleSchemaTypes.SiteUpdateSchema) {
    return this.rawUpdate(
      Utils.serializeRequestBody<SchemaTypes.SiteUpdateSchema>({
        body,
        type: Site.TYPE,
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
}
