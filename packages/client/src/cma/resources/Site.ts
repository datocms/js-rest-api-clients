import BaseResource from '../BaseResource';
import { serializeRequestBody } from '../../serialize';
import {
  deserializeResponseBody,
  deserializeJsonEntity,
} from '../../deserialize';
import toId from '../../toId';
import * as SchemaTypes from '../SchemaTypes';
import * as SimpleSchemaTypes from '../SimpleSchemaTypes';
import { IteratorOptions, rawPageIterator } from '../../rawPageIterator';

export default class Site extends BaseResource {
  static readonly TYPE: 'site' = 'site';

  /**
   * Retrieve the site
   *
   * Read more: https://www.datocms.com/docs/content-management-api/resources/site/self
   */
  find() {
    return this.rawFind().then((body) =>
      deserializeResponseBody<SimpleSchemaTypes.SiteSelfTargetSchema>(body),
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
      serializeRequestBody<SchemaTypes.SiteUpdateSchema>({
        body,
        type: Site.TYPE,
      }),
    ).then((body) =>
      deserializeResponseBody<SimpleSchemaTypes.SiteUpdateJobSchema>(body),
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
