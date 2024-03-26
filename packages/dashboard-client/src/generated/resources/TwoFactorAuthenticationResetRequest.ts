import * as Utils from '@datocms/rest-client-utils';
import BaseResource from '../../BaseResource';
import * as SchemaTypes from '../SchemaTypes';
import * as SimpleSchemaTypes from '../SimpleSchemaTypes';

export default class TwoFactorAuthenticationResetRequest extends BaseResource {
  static readonly TYPE = 'two_factor_authentication_reset_request' as const;

  /**
   * Request a two-factor reset to the belonging organization
   *
   * @throws {ApiError}
   * @throws {TimeoutError}
   *
   * @deprecated This API call is to be considered private and might change without notice
   */
  create(
    body: SimpleSchemaTypes.TwoFactorAuthenticationResetRequestCreateSchema,
  ) {
    return this.rawCreate(
      Utils.serializeRequestBody<SchemaTypes.TwoFactorAuthenticationResetRequestCreateSchema>(
        body,
        {
          type: 'two_factor_authentication_reset_request',
          attributes: ['email', 'password'],
          relationships: [],
        },
      ),
    ).then((body) =>
      Utils.deserializeResponseBody<SimpleSchemaTypes.TwoFactorAuthenticationResetRequestCreateTargetSchema>(
        body,
      ),
    );
  }

  /**
   * Request a two-factor reset to the belonging organization
   *
   * @throws {ApiError}
   * @throws {TimeoutError}
   *
   * @deprecated This API call is to be considered private and might change without notice
   */
  rawCreate(
    body: SchemaTypes.TwoFactorAuthenticationResetRequestCreateSchema,
  ): Promise<SchemaTypes.TwoFactorAuthenticationResetRequestCreateTargetSchema> {
    return this.client.request<SchemaTypes.TwoFactorAuthenticationResetRequestCreateTargetSchema>(
      {
        method: 'POST',
        url: '/tfa-reset-requests',
        body,
      },
    );
  }

  /**
   * List all two-factor authentication reset requests
   *
   * @throws {ApiError}
   * @throws {TimeoutError}
   */
  requestedList() {
    return this.rawRequestedList().then((body) =>
      Utils.deserializeResponseBody<SimpleSchemaTypes.TwoFactorAuthenticationResetRequestRequestedInstancesTargetSchema>(
        body,
      ),
    );
  }

  /**
   * List all two-factor authentication reset requests
   *
   * @throws {ApiError}
   * @throws {TimeoutError}
   */
  rawRequestedList(): Promise<SchemaTypes.TwoFactorAuthenticationResetRequestRequestedInstancesTargetSchema> {
    return this.client.request<SchemaTypes.TwoFactorAuthenticationResetRequestRequestedInstancesTargetSchema>(
      {
        method: 'GET',
        url: '/tfa-reset-requests',
      },
    );
  }

  /**
   * Delete a two-factor authentication reset
   *
   * @throws {ApiError}
   * @throws {TimeoutError}
   */
  destroy(
    twoFactorAuthenticationResetRequestId:
      | string
      | SimpleSchemaTypes.TwoFactorAuthenticationResetRequestData,
  ) {
    return this.rawDestroy(
      Utils.toId(twoFactorAuthenticationResetRequestId),
    ).then((body) =>
      Utils.deserializeResponseBody<SimpleSchemaTypes.TwoFactorAuthenticationResetRequestDestroyTargetSchema>(
        body,
      ),
    );
  }

  /**
   * Delete a two-factor authentication reset
   *
   * @throws {ApiError}
   * @throws {TimeoutError}
   */
  rawDestroy(
    twoFactorAuthenticationResetRequestId: string,
  ): Promise<SchemaTypes.TwoFactorAuthenticationResetRequestDestroyTargetSchema> {
    return this.client.request<SchemaTypes.TwoFactorAuthenticationResetRequestDestroyTargetSchema>(
      {
        method: 'DELETE',
        url: `/tfa-reset-requests/${twoFactorAuthenticationResetRequestId}`,
      },
    );
  }

  /**
   * Approve a two-factor authentication reset request
   *
   * @throws {ApiError}
   * @throws {TimeoutError}
   */
  approve(
    twoFactorAuthenticationResetRequestId:
      | string
      | SimpleSchemaTypes.TwoFactorAuthenticationResetRequestData,
  ) {
    return this.rawApprove(Utils.toId(twoFactorAuthenticationResetRequestId));
  }

  /**
   * Approve a two-factor authentication reset request
   *
   * @throws {ApiError}
   * @throws {TimeoutError}
   */
  rawApprove(twoFactorAuthenticationResetRequestId: string): Promise<void> {
    return this.client.request<void>({
      method: 'PUT',
      url: `/tfa-reset-requests/${twoFactorAuthenticationResetRequestId}/approve`,
    });
  }

  /**
   * Reject a two-factor authentication reset request
   *
   * @throws {ApiError}
   * @throws {TimeoutError}
   */
  reject(
    twoFactorAuthenticationResetRequestId:
      | string
      | SimpleSchemaTypes.TwoFactorAuthenticationResetRequestData,
  ) {
    return this.rawReject(Utils.toId(twoFactorAuthenticationResetRequestId));
  }

  /**
   * Reject a two-factor authentication reset request
   *
   * @throws {ApiError}
   * @throws {TimeoutError}
   */
  rawReject(twoFactorAuthenticationResetRequestId: string): Promise<void> {
    return this.client.request<void>({
      method: 'PUT',
      url: `/tfa-reset-requests/${twoFactorAuthenticationResetRequestId}/reject`,
    });
  }
}
