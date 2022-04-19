import * as Utils from '@datocms/rest-client-utils';
import * as SchemaTypes from '../SchemaTypes';
import * as SimpleSchemaTypes from '../SimpleSchemaTypes';
import BaseResource from '../../BaseResource';

export default class UploadSmartTag extends BaseResource {
  static readonly TYPE: 'upload_smart_tag' = 'upload_smart_tag';

  /**
   * List all automatically created upload tags
   *
   * Read more: https://www.datocms.com/docs/content-management-api/resources/upload-smart_tag/instances
   */
  list(queryParams?: SimpleSchemaTypes.UploadSmartTagInstancesHrefSchema) {
    return this.rawList(queryParams).then((body) =>
      Utils.deserializeResponseBody<SimpleSchemaTypes.UploadSmartTagInstancesTargetSchema>(
        body,
      ),
    );
  }

  /**
   * List all automatically created upload tags
   *
   * Read more: https://www.datocms.com/docs/content-management-api/resources/upload-smart_tag/instances
   */
  rawList(
    queryParams?: SchemaTypes.UploadSmartTagInstancesHrefSchema,
  ): Promise<SchemaTypes.UploadSmartTagInstancesTargetSchema> {
    return this.client.request<SchemaTypes.UploadSmartTagInstancesTargetSchema>(
      {
        method: 'GET',
        url: `/upload-smart-tags`,
        queryParams,
      },
    );
  }

  /**
   * Async iterator to auto-paginate over elements returned by list()
   *
   * Read more: https://www.datocms.com/docs/content-management-api/resources/upload-smart_tag/instances
   */
  async *listPagedIterator(
    queryParams?: SimpleSchemaTypes.UploadSmartTagInstancesHrefSchema,
    iteratorOptions?: Utils.IteratorOptions,
  ) {
    for await (const element of this.rawListPagedIterator(
      queryParams,
      iteratorOptions,
    )) {
      yield Utils.deserializeJsonEntity<
        SimpleSchemaTypes.UploadSmartTagInstancesTargetSchema[0]
      >(element);
    }
  }

  /**
   * Async iterator to auto-paginate over elements returned by rawList()
   *
   * Read more: https://www.datocms.com/docs/content-management-api/resources/upload-smart_tag/instances
   */
  rawListPagedIterator(
    queryParams?: SchemaTypes.UploadSmartTagInstancesHrefSchema,
    iteratorOptions?: Utils.IteratorOptions,
  ) {
    return Utils.rawPageIterator<
      SchemaTypes.UploadSmartTagInstancesTargetSchema['data'][0]
    >(
      {
        defaultLimit: 50,
        maxLimit: 500,
      },
      (page) => this.rawList({ ...queryParams, page }),
      iteratorOptions,
    );
  }
}
