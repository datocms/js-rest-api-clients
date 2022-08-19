import * as Utils from '@datocms/rest-client-utils';
import * as SchemaTypes from '../SchemaTypes';
import * as SimpleSchemaTypes from '../SimpleSchemaTypes';
import BaseResource from '../../BaseResource';

export default class SearchResult extends BaseResource {
  static readonly TYPE: 'search_result' = 'search_result';

  /**
   * Search for results
   *
   * Read more: https://www.datocms.com/docs/content-management-api/resources/search-result/instances
   */
  list(queryParams: SimpleSchemaTypes.SearchResultInstancesHrefSchema) {
    return this.rawList(queryParams).then((body) =>
      Utils.deserializeResponseBody<SimpleSchemaTypes.SearchResultInstancesTargetSchema>(
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
    queryParams: SchemaTypes.SearchResultInstancesHrefSchema,
  ): Promise<SchemaTypes.SearchResultInstancesTargetSchema> {
    return this.client.request<SchemaTypes.SearchResultInstancesTargetSchema>({
      method: 'GET',
      url: `/search-results`,
      queryParams,
    });
  }

  /**
   * Async iterator to auto-paginate over elements returned by list()
   *
   * Read more: https://www.datocms.com/docs/content-management-api/resources/search-result/instances
   */
  async *listPagedIterator(
    queryParams: SimpleSchemaTypes.SearchResultInstancesHrefSchema,
    iteratorOptions?: Utils.IteratorOptions,
  ) {
    for await (const element of this.rawListPagedIterator(
      queryParams,
      iteratorOptions,
    )) {
      yield Utils.deserializeJsonEntity<
        SimpleSchemaTypes.SearchResultInstancesTargetSchema[0]
      >(element);
    }
  }

  /**
   * Async iterator to auto-paginate over elements returned by rawList()
   *
   * Read more: https://www.datocms.com/docs/content-management-api/resources/search-result/instances
   */
  rawListPagedIterator(
    queryParams: SchemaTypes.SearchResultInstancesHrefSchema,
    iteratorOptions?: Utils.IteratorOptions,
  ) {
    return Utils.rawPageIterator<
      SchemaTypes.SearchResultInstancesTargetSchema['data'][0]
    >(
      {
        defaultLimit: 20,
        maxLimit: 100,
      },
      (page: SchemaTypes.SearchResultInstancesHrefSchema['page']) =>
        this.rawList({ ...queryParams, page }),
      iteratorOptions,
    );
  }
}
