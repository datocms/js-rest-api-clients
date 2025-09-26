import * as Utils from '@datocms/rest-client-utils';
import BaseResource from '../../BaseResource';
import type * as ApiTypes from '../ApiTypes';
import type * as RawApiTypes from '../RawApiTypes';

export default class Session extends BaseResource {
  static readonly TYPE = 'session' as const;

  /**
   * Create a new session
   *
   * Read more: https://www.datocms.com/docs/content-management-api/resources/session/create
   *
   * @throws {ApiError}
   * @throws {TimeoutError}
   *
   * @deprecated This API call is to be considered private and might change without notice
   */
  create(body: ApiTypes.SessionCreateSchema) {
    return this.rawCreate(
      Utils.serializeRequestBody<RawApiTypes.SessionCreateSchema>(body, {
        type: 'email_credentials',
        attributes: ['email', 'password', 'otp_code'],
        relationships: [],
      }),
    ).then((body) =>
      Utils.deserializeResponseBody<ApiTypes.SessionCreateTargetSchema>(body),
    );
  }

  /**
   * Create a new session
   *
   * Read more: https://www.datocms.com/docs/content-management-api/resources/session/create
   *
   * @throws {ApiError}
   * @throws {TimeoutError}
   *
   * @deprecated This API call is to be considered private and might change without notice
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
