import * as Utils from '@datocms/rest-client-utils';
import BaseResource from '../../BaseResource';
import type * as SchemaTypes from '../SchemaTypes';
import type * as SimpleSchemaTypes from '../SimpleSchemaTypes';

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
  create(body: SimpleSchemaTypes.TfaDeactivateRequestCreateSchema) {
    return this.rawCreate(
      Utils.serializeRequestBody<SchemaTypes.TfaDeactivateRequestCreateSchema>(
        body,
        {
          type: 'tfa_deactivate_request',
          attributes: ['email', 'password'],
          relationships: [],
        },
      ),
    ).then((body) =>
      Utils.deserializeResponseBody<SimpleSchemaTypes.TfaDeactivateRequestCreateTargetSchema>(
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
    body: SchemaTypes.TfaDeactivateRequestCreateSchema,
  ): Promise<SchemaTypes.TfaDeactivateRequestCreateTargetSchema> {
    return this.client.request<SchemaTypes.TfaDeactivateRequestCreateTargetSchema>(
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
      Utils.deserializeResponseBody<SimpleSchemaTypes.TfaDeactivateRequestInstancesTargetSchema>(
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
  rawList(): Promise<SchemaTypes.TfaDeactivateRequestInstancesTargetSchema> {
    return this.client.request<SchemaTypes.TfaDeactivateRequestInstancesTargetSchema>(
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
  approve(
    tfaDeactivateRequestId: string | SimpleSchemaTypes.TfaDeactivateRequestData,
  ) {
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
  reject(
    tfaDeactivateRequestId: string | SimpleSchemaTypes.TfaDeactivateRequestData,
  ) {
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
