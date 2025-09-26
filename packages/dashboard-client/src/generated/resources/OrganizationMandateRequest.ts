import * as Utils from '@datocms/rest-client-utils';
import BaseResource from '../../BaseResource';
import type * as ApiTypes from '../ApiTypes';
import type * as RawApiTypes from '../RawApiTypes';

export default class OrganizationMandateRequest extends BaseResource {
  static readonly TYPE = 'organization_mandate_request' as const;

  /**
   * Request a new mandate
   *
   * @throws {ApiError}
   * @throws {TimeoutError}
   */
  create(
    body: ApiTypes.OrganizationMandateRequestCreateSchema,
    queryParams?: ApiTypes.OrganizationMandateRequestCreateHrefSchema,
  ) {
    return this.rawCreate(
      Utils.serializeRequestBody<RawApiTypes.OrganizationMandateRequestCreateSchema>(
        body,
        {
          type: 'organization_mandate_request',
          attributes: [],
          relationships: ['approver_organization'],
        },
      ),
      queryParams,
    ).then((body) =>
      Utils.deserializeResponseBody<ApiTypes.OrganizationMandateRequestCreateTargetSchema>(
        body,
      ),
    );
  }

  /**
   * Request a new mandate
   *
   * @throws {ApiError}
   * @throws {TimeoutError}
   */
  rawCreate(
    body: RawApiTypes.OrganizationMandateRequestCreateSchema,
    queryParams?: RawApiTypes.OrganizationMandateRequestCreateHrefSchema,
  ): Promise<RawApiTypes.OrganizationMandateRequestCreateTargetSchema> {
    return this.client.request<RawApiTypes.OrganizationMandateRequestCreateTargetSchema>(
      {
        method: 'POST',
        url: '/organization-mandate-requests',
        body,
        queryParams,
      },
    );
  }

  /**
   * List all pending mandate requests
   *
   * @throws {ApiError}
   * @throws {TimeoutError}
   */
  pendingList() {
    return this.rawPendingList().then((body) =>
      Utils.deserializeResponseBody<ApiTypes.OrganizationMandateRequestPendingInstancesTargetSchema>(
        body,
      ),
    );
  }

  /**
   * List all pending mandate requests
   *
   * @throws {ApiError}
   * @throws {TimeoutError}
   */
  rawPendingList(): Promise<RawApiTypes.OrganizationMandateRequestPendingInstancesTargetSchema> {
    return this.client.request<RawApiTypes.OrganizationMandateRequestPendingInstancesTargetSchema>(
      {
        method: 'GET',
        url: '/organization-mandate-requests/pending',
      },
    );
  }

  /**
   * List all requested mandates
   *
   * @throws {ApiError}
   * @throws {TimeoutError}
   */
  requestedList() {
    return this.rawRequestedList().then((body) =>
      Utils.deserializeResponseBody<ApiTypes.OrganizationMandateRequestRequestedInstancesTargetSchema>(
        body,
      ),
    );
  }

  /**
   * List all requested mandates
   *
   * @throws {ApiError}
   * @throws {TimeoutError}
   */
  rawRequestedList(): Promise<RawApiTypes.OrganizationMandateRequestRequestedInstancesTargetSchema> {
    return this.client.request<RawApiTypes.OrganizationMandateRequestRequestedInstancesTargetSchema>(
      {
        method: 'GET',
        url: '/organization-mandate-requests/requested',
      },
    );
  }

  /**
   * Delete a mandate request
   *
   * @throws {ApiError}
   * @throws {TimeoutError}
   */
  destroy(
    organizationMandateRequestId:
      | string
      | ApiTypes.OrganizationMandateRequestData,
  ) {
    return this.rawDestroy(Utils.toId(organizationMandateRequestId)).then(
      (body) =>
        Utils.deserializeResponseBody<ApiTypes.OrganizationMandateRequestDestroyTargetSchema>(
          body,
        ),
    );
  }

  /**
   * Delete a mandate request
   *
   * @throws {ApiError}
   * @throws {TimeoutError}
   */
  rawDestroy(
    organizationMandateRequestId: string,
  ): Promise<RawApiTypes.OrganizationMandateRequestDestroyTargetSchema> {
    return this.client.request<RawApiTypes.OrganizationMandateRequestDestroyTargetSchema>(
      {
        method: 'DELETE',
        url: `/organization-mandate-requests/${organizationMandateRequestId}`,
      },
    );
  }

  /**
   * Approve a mandate request
   *
   * @throws {ApiError}
   * @throws {TimeoutError}
   */
  approve(
    organizationMandateRequestId:
      | string
      | ApiTypes.OrganizationMandateRequestData,
  ) {
    return this.rawApprove(Utils.toId(organizationMandateRequestId));
  }

  /**
   * Approve a mandate request
   *
   * @throws {ApiError}
   * @throws {TimeoutError}
   */
  rawApprove(organizationMandateRequestId: string): Promise<void> {
    return this.client.request<void>({
      method: 'PUT',
      url: `/organization-mandate-requests/${organizationMandateRequestId}/approve`,
    });
  }

  /**
   * Reject a mandate request
   *
   * @throws {ApiError}
   * @throws {TimeoutError}
   */
  reject(
    organizationMandateRequestId:
      | string
      | ApiTypes.OrganizationMandateRequestData,
  ) {
    return this.rawReject(Utils.toId(organizationMandateRequestId));
  }

  /**
   * Reject a mandate request
   *
   * @throws {ApiError}
   * @throws {TimeoutError}
   */
  rawReject(organizationMandateRequestId: string): Promise<void> {
    return this.client.request<void>({
      method: 'PUT',
      url: `/organization-mandate-requests/${organizationMandateRequestId}/reject`,
    });
  }
}
