import * as Utils from '@datocms/rest-client-utils';
import * as SchemaTypes from '../SchemaTypes';
import * as SimpleSchemaTypes from '../SimpleSchemaTypes';
import BaseResource from '../../BaseResource';

export default class ItemVersion extends BaseResource {
  static readonly TYPE: 'item_version' = 'item_version';

  /**
   * Restore an old record version
   *
   * Read more: https://www.datocms.com/docs/content-management-api/resources/item-version/restore
   */
  restore(itemVersionId: string | SimpleSchemaTypes.ItemVersionData) {
    return this.rawRestore(Utils.toId(itemVersionId)).then((body) =>
      Utils.deserializeResponseBody<SimpleSchemaTypes.ItemVersionRestoreJobSchema>(
        body,
      ),
    );
  }

  /**
   * Restore an old record version
   *
   * Read more: https://www.datocms.com/docs/content-management-api/resources/item-version/restore
   */
  rawRestore(
    itemVersionId: string,
  ): Promise<SchemaTypes.ItemVersionRestoreJobSchema> {
    return this.client.request<SchemaTypes.ItemVersionRestoreJobSchema>({
      method: 'POST',
      url: `/versions/${itemVersionId}/restore`,
    });
  }

  /**
   * List all record versions
   *
   * Read more: https://www.datocms.com/docs/content-management-api/resources/item-version/instances
   */
  list(
    itemId: string | SimpleSchemaTypes.ItemData,
    queryParams?: SimpleSchemaTypes.ItemVersionInstancesHrefSchema,
  ) {
    return this.rawList(Utils.toId(itemId), queryParams).then((body) =>
      Utils.deserializeResponseBody<SimpleSchemaTypes.ItemVersionInstancesTargetSchema>(
        body,
      ),
    );
  }

  /**
   * List all record versions
   *
   * Read more: https://www.datocms.com/docs/content-management-api/resources/item-version/instances
   */
  rawList(
    itemId: string,
    queryParams?: SchemaTypes.ItemVersionInstancesHrefSchema,
  ): Promise<SchemaTypes.ItemVersionInstancesTargetSchema> {
    return this.client.request<SchemaTypes.ItemVersionInstancesTargetSchema>({
      method: 'GET',
      url: `/items/${itemId}/versions`,
      queryParams,
    });
  }

  /**
   * Async iterator to auto-paginate over elements returned by list()
   *
   * Read more: https://www.datocms.com/docs/content-management-api/resources/item-version/instances
   */
  async *listPagedIterator(
    itemId: string | SimpleSchemaTypes.ItemData,
    queryParams?: SimpleSchemaTypes.ItemVersionInstancesHrefSchema,
    iteratorOptions?: Utils.IteratorOptions,
  ) {
    for await (const element of this.rawListPagedIterator(
      Utils.toId(itemId),
      queryParams,
      iteratorOptions,
    )) {
      yield Utils.deserializeJsonEntity<
        SimpleSchemaTypes.ItemVersionInstancesTargetSchema[0]
      >(element);
    }
  }

  /**
   * Async iterator to auto-paginate over elements returned by rawList()
   *
   * Read more: https://www.datocms.com/docs/content-management-api/resources/item-version/instances
   */
  rawListPagedIterator(
    itemId: string,
    queryParams?: SchemaTypes.ItemVersionInstancesHrefSchema,
    iteratorOptions?: Utils.IteratorOptions,
  ) {
    return Utils.rawPageIterator<
      SchemaTypes.ItemVersionInstancesTargetSchema['data'][0]
    >(
      {
        defaultLimit: 15,
        maxLimit: 50,
      },
      (page) => this.rawList(itemId, { ...queryParams, page }),
      iteratorOptions,
    );
  }

  /**
   * Retrieve a record version
   *
   * Read more: https://www.datocms.com/docs/content-management-api/resources/item-version/self
   */
  find(itemVersionId: string | SimpleSchemaTypes.ItemVersionData) {
    return this.rawFind(Utils.toId(itemVersionId)).then((body) =>
      Utils.deserializeResponseBody<SimpleSchemaTypes.ItemVersionSelfTargetSchema>(
        body,
      ),
    );
  }

  /**
   * Retrieve a record version
   *
   * Read more: https://www.datocms.com/docs/content-management-api/resources/item-version/self
   */
  rawFind(
    itemVersionId: string,
  ): Promise<SchemaTypes.ItemVersionSelfTargetSchema> {
    return this.client.request<SchemaTypes.ItemVersionSelfTargetSchema>({
      method: 'GET',
      url: `/versions/${itemVersionId}`,
    });
  }
}
