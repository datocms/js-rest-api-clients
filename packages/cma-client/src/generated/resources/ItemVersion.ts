import * as Utils from '@datocms/rest-client-utils';
import BaseResource from '../../BaseResource';
import type * as ApiTypes from '../ApiTypes';
import type * as RawApiTypes from '../RawApiTypes';

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
  restore(itemVersionId: string | ApiTypes.ItemVersionData) {
    return this.rawRestore(Utils.toId(itemVersionId)).then((body) =>
      Utils.deserializeResponseBody<ApiTypes.ItemVersionRestoreJobSchema>(body),
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
  ): Promise<RawApiTypes.ItemVersionRestoreJobSchema> {
    return this.client.request<RawApiTypes.ItemVersionRestoreJobSchema>({
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
    itemId: string | ApiTypes.ItemData,
    queryParams?: ApiTypes.ItemVersionInstancesHrefSchema,
  ) {
    return this.rawList(Utils.toId(itemId), queryParams).then((body) =>
      Utils.deserializeResponseBody<ApiTypes.ItemVersionInstancesTargetSchema>(
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
    queryParams?: RawApiTypes.ItemVersionInstancesHrefSchema,
  ): Promise<RawApiTypes.ItemVersionInstancesTargetSchema> {
    return this.client.request<RawApiTypes.ItemVersionInstancesTargetSchema>({
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
    itemId: string | ApiTypes.ItemData,
    queryParams?: Utils.OmitFromKnownKeys<
      ApiTypes.ItemVersionInstancesHrefSchema,
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
        ApiTypes.ItemVersionInstancesTargetSchema[0]
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
      RawApiTypes.ItemVersionInstancesHrefSchema,
      'page'
    >,
    iteratorOptions?: Utils.IteratorOptions,
  ) {
    Utils.warnOnPageQueryParam(queryParams);

    return Utils.rawPageIterator<
      RawApiTypes.ItemVersionInstancesTargetSchema['data'][0]
    >(
      {
        defaultLimit: 15,
        maxLimit: 50,
      },
      (page: RawApiTypes.ItemVersionInstancesHrefSchema['page']) =>
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
  find(
    itemVersionId: string | ApiTypes.ItemVersionData,
    queryParams?: ApiTypes.ItemVersionSelfHrefSchema,
  ) {
    return this.rawFind(Utils.toId(itemVersionId), queryParams).then((body) =>
      Utils.deserializeResponseBody<ApiTypes.ItemVersionSelfTargetSchema>(body),
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
    queryParams?: RawApiTypes.ItemVersionSelfHrefSchema,
  ): Promise<RawApiTypes.ItemVersionSelfTargetSchema> {
    return this.client.request<RawApiTypes.ItemVersionSelfTargetSchema>({
      method: 'GET',
      url: `/versions/${itemVersionId}`,
      queryParams,
    });
  }
}
