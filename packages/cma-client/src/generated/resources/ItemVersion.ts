import * as Utils from '@datocms/rest-client-utils';
import BaseResource from '../../BaseResource';
import type * as SchemaTypes from '../SchemaTypes';
import type * as SimpleSchemaTypes from '../SimpleSchemaTypes';

export default class ItemVersion extends BaseResource {
  static readonly TYPE = 'item_version' as const;

  /**
   * Restore an old record version
   *
   * Read more: https://www.datocms.com/docs/content-management-api/resources/item-version/restore
   *
   * @throws {ApiError}
   * @throws {TimeoutError}
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
   *
   * @throws {ApiError}
   * @throws {TimeoutError}
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
   *
   * @throws {ApiError}
   * @throws {TimeoutError}
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
   *
   * @throws {ApiError}
   * @throws {TimeoutError}
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
   *
   * @throws {ApiError}
   * @throws {TimeoutError}
   */
  async *listPagedIterator(
    itemId: string | SimpleSchemaTypes.ItemData,
    queryParams?: Utils.OmitFromKnownKeys<
      SimpleSchemaTypes.ItemVersionInstancesHrefSchema,
      'page'
    >,
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
   *
   * @throws {ApiError}
   * @throws {TimeoutError}
   */
  rawListPagedIterator(
    itemId: string,
    queryParams?: Utils.OmitFromKnownKeys<
      SchemaTypes.ItemVersionInstancesHrefSchema,
      'page'
    >,
    iteratorOptions?: Utils.IteratorOptions,
  ) {
    Utils.warnOnPageQueryParam(queryParams);

    return Utils.rawPageIterator<
      SchemaTypes.ItemVersionInstancesTargetSchema['data'][0]
    >(
      {
        defaultLimit: 15,
        maxLimit: 50,
      },
      (page: SchemaTypes.ItemVersionInstancesHrefSchema['page']) =>
        this.rawList(itemId, { ...queryParams, page }),
      iteratorOptions,
    );
  }

  /**
   * Retrieve a record version
   *
   * Read more: https://www.datocms.com/docs/content-management-api/resources/item-version/self
   *
   * @throws {ApiError}
   * @throws {TimeoutError}
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
   *
   * @throws {ApiError}
   * @throws {TimeoutError}
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
