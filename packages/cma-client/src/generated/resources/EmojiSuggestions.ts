import * as Utils from '@datocms/rest-client-utils';
import BaseResource from '../../BaseResource';
import type * as ApiTypes from '../ApiTypes';
import type * as RawApiTypes from '../RawApiTypes';

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
  find(queryParams?: ApiTypes.EmojiSuggestionsSelfHrefSchema) {
    return this.rawFind(queryParams).then((body) =>
      Utils.deserializeResponseBody<ApiTypes.EmojiSuggestionsSelfTargetSchema>(
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
    queryParams?: RawApiTypes.EmojiSuggestionsSelfHrefSchema,
  ): Promise<RawApiTypes.EmojiSuggestionsSelfTargetSchema> {
    return this.client.request<RawApiTypes.EmojiSuggestionsSelfTargetSchema>({
      method: 'GET',
      url: '/emoji-suggestions',
      queryParams,
    });
  }
}
