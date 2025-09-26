import * as Utils from '@datocms/rest-client-utils';
import BaseResource from '../../BaseResource';
import type * as ApiTypes from '../ApiTypes';
import type * as RawApiTypes from '../RawApiTypes';

export default class Session extends BaseResource {
  static readonly TYPE = 'session' as const;

  /**
   * Create a new session
   *
   * @throws {ApiError}
   * @throws {TimeoutError}
   */
  rawCreate(
    body: RawApiTypes.SessionCreateSchema,
  ): Promise<RawApiTypes.SessionCreateTargetSchema> {
    return this.client.request<RawApiTypes.SessionCreateTargetSchema>({
      method: 'POST',
      url: '/sessions',
      body,
    });
  }
}
