import * as Utils from '@datocms/rest-client-utils';
import BaseResource from '../../BaseResource';
import type * as SchemaTypes from '../SchemaTypes';
import type * as SimpleSchemaTypes from '../SimpleSchemaTypes';

export default class EmojiSuggestions extends BaseResource {
  static readonly TYPE = 'emoji_suggestions' as const;

  /**
   * Retrieve emoji suggestions
   *
   * Read more: https://www.datocms.com/docs/content-management-api/resources/emoji-suggestions/self
   *
   * @throws {ApiError}
   * @throws {TimeoutError}
   *
   * @deprecated This API call is to be considered private and might change without notice
   */
  find(queryParams?: SimpleSchemaTypes.EmojiSuggestionsSelfHrefSchema) {
    return this.rawFind(queryParams).then((body) =>
      Utils.deserializeResponseBody<SimpleSchemaTypes.EmojiSuggestionsSelfTargetSchema>(
        body,
      ),
    );
  }

  /**
   * Retrieve emoji suggestions
   *
   * Read more: https://www.datocms.com/docs/content-management-api/resources/emoji-suggestions/self
   *
   * @throws {ApiError}
   * @throws {TimeoutError}
   *
   * @deprecated This API call is to be considered private and might change without notice
   */
  rawFind(
    queryParams?: SchemaTypes.EmojiSuggestionsSelfHrefSchema,
  ): Promise<SchemaTypes.EmojiSuggestionsSelfTargetSchema> {
    return this.client.request<SchemaTypes.EmojiSuggestionsSelfTargetSchema>({
      method: 'GET',
      url: '/emoji-suggestions',
      queryParams,
    });
  }
}
