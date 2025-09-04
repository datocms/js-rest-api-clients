import * as Utils from '@datocms/rest-client-utils';
import BaseResource from '../../BaseResource';
import type * as ApiTypes from '../ApiTypes';
import type * as RawApiTypes from '../RawApiTypes';

export default class TfaDeactivateRequest extends BaseResource {
  static readonly TYPE = 'tfa_deactivate_request' as const;

  /**
   * Request the belonging organization to deactivate two-factor authentication
   *
   * @throws {ApiError}
   * @throws {TimeoutError}
   *
   * @deprecated This API call is to be considered private and might change without notice
   */
  create(body: ApiTypes.TfaDeactivateRequestCreateSchema) {
    return this.rawCreate(
      Utils.serializeRequestBody<RawApiTypes.TfaDeactivateRequestCreateSchema>(
        body,
        {
          type: 'tfa_deactivate_request',
          attributes: ['email', 'password'],
          relationships: [],
        },
      ),
    ).then((body) =>
      Utils.deserializeResponseBody<ApiTypes.TfaDeactivateRequestCreateTargetSchema>(
        body,
      ),
    );
  }

  /**
   * Request the belonging organization to deactivate two-factor authentication
   *
   * @throws {ApiError}
   * @throws {TimeoutError}
   *
   * @deprecated This API call is to be considered private and might change without notice
   */
  rawCreate(
    body: RawApiTypes.TfaDeactivateRequestCreateSchema,
  ): Promise<RawApiTypes.TfaDeactivateRequestCreateTargetSchema> {
    return this.client.request<RawApiTypes.TfaDeactivateRequestCreateTargetSchema>(
      {
        method: 'POST',
        url: '/tfa-deactivate-requests',
        body,
      },
    );
  }

  /**
   * List all two-factor authentication deactivate requests
   *
   * @throws {ApiError}
   * @throws {TimeoutError}
   *
   * @deprecated This API call is to be considered private and might change without notice
   */
  list() {
    return this.rawList().then((body) =>
      Utils.deserializeResponseBody<ApiTypes.TfaDeactivateRequestInstancesTargetSchema>(
        body,
      ),
    );
  }

  /**
   * List all two-factor authentication deactivate requests
   *
   * @throws {ApiError}
   * @throws {TimeoutError}
   *
   * @deprecated This API call is to be considered private and might change without notice
   */
  rawList(): Promise<RawApiTypes.TfaDeactivateRequestInstancesTargetSchema> {
    return this.client.request<RawApiTypes.TfaDeactivateRequestInstancesTargetSchema>(
      {
        method: 'GET',
        url: '/tfa-deactivate-requests',
      },
    );
  }

  /**
   * Approve a two-factor authentication deactivate request
   *
   * @throws {ApiError}
   * @throws {TimeoutError}
   *
   * @deprecated This API call is to be considered private and might change without notice
   */
  approve(tfaDeactivateRequestId: string | ApiTypes.TfaDeactivateRequestData) {
    return this.rawApprove(Utils.toId(tfaDeactivateRequestId));
  }

  /**
   * Approve a two-factor authentication deactivate request
   *
   * @throws {ApiError}
   * @throws {TimeoutError}
   *
   * @deprecated This API call is to be considered private and might change without notice
   */
  rawApprove(tfaDeactivateRequestId: string): Promise<void> {
    return this.client.request<void>({
      method: 'PUT',
      url: `/tfa-deactivate-requests/${tfaDeactivateRequestId}/approve`,
    });
  }

  /**
   * Reject a two-factor authentication deactivate request
   *
   * @throws {ApiError}
   * @throws {TimeoutError}
   *
   * @deprecated This API call is to be considered private and might change without notice
   */
  reject(tfaDeactivateRequestId: string | ApiTypes.TfaDeactivateRequestData) {
    return this.rawReject(Utils.toId(tfaDeactivateRequestId));
  }

  /**
   * Reject a two-factor authentication deactivate request
   *
   * @throws {ApiError}
   * @throws {TimeoutError}
   *
   * @deprecated This API call is to be considered private and might change without notice
   */
  rawReject(tfaDeactivateRequestId: string): Promise<void> {
    return this.client.request<void>({
      method: 'PUT',
      url: `/tfa-deactivate-requests/${tfaDeactivateRequestId}/reject`,
    });
  }
}
