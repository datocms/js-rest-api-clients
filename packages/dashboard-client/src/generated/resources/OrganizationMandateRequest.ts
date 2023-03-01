import * as Utils from '@datocms/rest-client-utils';
import * as SchemaTypes from '../SchemaTypes';
import * as SimpleSchemaTypes from '../SimpleSchemaTypes';
import BaseResource from '../../BaseResource';

export default class OrganizationMandateRequest extends BaseResource {
  static readonly TYPE: 'organization_mandate_request' =
    'organization_mandate_request';

  /**
   * Request a new mandate
   *
   * @throws {ApiError}
   * @throws {TimeoutError}
   */
  create(body: SimpleSchemaTypes.OrganizationMandateRequestCreateSchema) {
    return this.rawCreate(
      Utils.serializeRequestBody<SchemaTypes.OrganizationMandateRequestCreateSchema>(
        body,
        {
          type: 'organization_mandate_request',
          attributes: [],
          relationships: ['approver_organization'],
        },
      ),
    ).then((body) =>
      Utils.deserializeResponseBody<SimpleSchemaTypes.OrganizationMandateRequestCreateTargetSchema>(
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
    body: SchemaTypes.OrganizationMandateRequestCreateSchema,
  ): Promise<SchemaTypes.OrganizationMandateRequestCreateTargetSchema> {
    return this.client.request<SchemaTypes.OrganizationMandateRequestCreateTargetSchema>(
      {
        method: 'POST',
        url: '/organization-mandate-requests',
        body,
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
      Utils.deserializeResponseBody<SimpleSchemaTypes.OrganizationMandateRequestPendingInstancesTargetSchema>(
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
  rawPendingList(): Promise<SchemaTypes.OrganizationMandateRequestPendingInstancesTargetSchema> {
    return this.client.request<SchemaTypes.OrganizationMandateRequestPendingInstancesTargetSchema>(
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
      Utils.deserializeResponseBody<SimpleSchemaTypes.OrganizationMandateRequestRequestedInstancesTargetSchema>(
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
  rawRequestedList(): Promise<SchemaTypes.OrganizationMandateRequestRequestedInstancesTargetSchema> {
    return this.client.request<SchemaTypes.OrganizationMandateRequestRequestedInstancesTargetSchema>(
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
      | SimpleSchemaTypes.OrganizationMandateRequestData,
  ) {
    return this.rawDestroy(Utils.toId(organizationMandateRequestId)).then(
      (body) =>
        Utils.deserializeResponseBody<SimpleSchemaTypes.OrganizationMandateRequestDestroyTargetSchema>(
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
  ): Promise<SchemaTypes.OrganizationMandateRequestDestroyTargetSchema> {
    return this.client.request<SchemaTypes.OrganizationMandateRequestDestroyTargetSchema>(
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
      | SimpleSchemaTypes.OrganizationMandateRequestData,
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
      | SimpleSchemaTypes.OrganizationMandateRequestData,
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
