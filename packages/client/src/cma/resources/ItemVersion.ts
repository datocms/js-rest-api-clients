import BaseResource from '../BaseResource';
import serializeRequestBody from '../../serializeRequestBody';
import deserializeResponseBody from '../../deserializeResponseBody';
import toId from '../../toId';
import * as SchemaTypes from '../SchemaTypes';
import * as SimpleSchemaTypes from '../SimpleSchemaTypes';

export default class ItemVersion extends BaseResource {
  static readonly TYPE: 'item_version' = 'item_version';

  /**
   * Restore an old record version
   *
   * Read more: https://www.datocms.com/docs/content-management-api/resources/item-version/restore
   */
  restore(itemVersionId: string | SimpleSchemaTypes.ItemVersionData) {
    return this.rawRestore(toId(itemVersionId)).then((body) =>
      deserializeResponseBody<SimpleSchemaTypes.ItemVersionRestoreJobSchema>(
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
      url: `/versions/${itemVersionId}`,
    });
  }

  /**
   * List all record versions
   *
   * Read more: https://www.datocms.com/docs/content-management-api/resources/item-version/instances
   */
  list(itemId: string | SimpleSchemaTypes.ItemVersionData) {
    return this.rawList(toId(itemId)).then((body) =>
      deserializeResponseBody<SimpleSchemaTypes.ItemVersionInstancesTargetSchema>(
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
  ): Promise<SchemaTypes.ItemVersionInstancesTargetSchema> {
    return this.client.request<SchemaTypes.ItemVersionInstancesTargetSchema>({
      method: 'GET',
      url: `/items/${itemId}/versions`,
    });
  }

  /**
   * Retrieve a record version
   *
   * Read more: https://www.datocms.com/docs/content-management-api/resources/item-version/self
   */
  find(itemVersionId: string | SimpleSchemaTypes.ItemVersionData) {
    return this.rawFind(toId(itemVersionId)).then((body) =>
      deserializeResponseBody<SimpleSchemaTypes.ItemVersionSelfTargetSchema>(
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
