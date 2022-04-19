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

export default class UploadSmartTag extends BaseResource {
  static readonly TYPE: 'upload_smart_tag' = 'upload_smart_tag';

  /**
   * List all automatically created upload tags
   *
   * Read more: https://www.datocms.com/docs/content-management-api/resources/upload-smart_tag/instances
   */
  list(queryParams?: SimpleSchemaTypes.UploadSmartTagInstancesHrefSchema) {
    return this.rawList(queryParams).then((body) =>
      deserializeResponseBody<SimpleSchemaTypes.UploadSmartTagInstancesTargetSchema>(
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
    iteratorOptions?: IteratorOptions,
  ) {
    for await (const element of this.rawListPagedIterator(
      queryParams,
      iteratorOptions,
    )) {
      yield deserializeJsonEntity<
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
    iteratorOptions?: IteratorOptions,
  ) {
    return rawPageIterator<
      SchemaTypes.UploadSmartTagInstancesTargetSchema['data'][0]
    >((page) => this.rawList({ ...queryParams, page }), iteratorOptions);
  }
}
