import BaseResource from '../BaseResource';
import serializeRequestBody from '../../serializeRequestBody';
import deserializeResponseBody from '../../deserializeResponseBody';
import toId from '../../toId';
import * as SchemaTypes from '../SchemaTypes';
import * as SimpleSchemaTypes from '../SimpleSchemaTypes';

export default class SearchResult extends BaseResource {
  static readonly TYPE: 'search_result' = 'search_result';

  /**
   * Search for results
   *
   * Read more: https://www.datocms.com/docs/content-management-api/resources/search-result/instances
   */
  list(queryParams?: SimpleSchemaTypes.SearchResultInstancesHrefSchema) {
    return this.rawList(queryParams).then((body) =>
      deserializeResponseBody<SimpleSchemaTypes.SearchResultInstancesTargetSchema>(
        body,
      ),
    );
  }

  /**
   * Search for results
   *
   * Read more: https://www.datocms.com/docs/content-management-api/resources/search-result/instances
   */
  rawList(
    queryParams?: SchemaTypes.SearchResultInstancesHrefSchema,
  ): Promise<SchemaTypes.SearchResultInstancesTargetSchema> {
    return this.client.request<SchemaTypes.SearchResultInstancesTargetSchema>({
      method: 'GET',
      url: `/search-results`,
      queryParams,
    });
  }
}
