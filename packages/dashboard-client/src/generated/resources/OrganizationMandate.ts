import * as Utils from '@datocms/rest-client-utils';
import BaseResource from '../../BaseResource';
import type * as ApiTypes from '../ApiTypes';
import type * as RawApiTypes from '../RawApiTypes';

export default class OrganizationMandate extends BaseResource {
  static readonly TYPE = 'organization_mandate' as const;

  /**
   * Update an organization mandate
   *
   * @throws {ApiError}
   * @throws {TimeoutError}
   */
  update(
    organizationMandateId: string | ApiTypes.OrganizationMandateData,
    body: ApiTypes.OrganizationMandateUpdateSchema,
  ) {
    return this.rawUpdate(
      Utils.toId(organizationMandateId),
      Utils.serializeRequestBody<RawApiTypes.OrganizationMandateUpdateSchema>(
        body,
        {
          id: Utils.toId(organizationMandateId),
          type: 'organization_mandate',
          attributes: [],
          relationships: ['additional_enabled_plans'],
        },
      ),
    ).then((body) =>
      Utils.deserializeResponseBody<ApiTypes.OrganizationMandateUpdateTargetSchema>(
        body,
      ),
    );
  }

  /**
   * Update an organization mandate
   *
   * @throws {ApiError}
   * @throws {TimeoutError}
   */
  rawUpdate(
    organizationMandateId: string,
    body: RawApiTypes.OrganizationMandateUpdateSchema,
  ): Promise<RawApiTypes.OrganizationMandateUpdateTargetSchema> {
    return this.client.request<RawApiTypes.OrganizationMandateUpdateTargetSchema>(
      {
        method: 'PUT',
        url: `/organization-mandates/${organizationMandateId}`,
        body,
      },
    );
  }

  /**
   * List all mandates that the organization has approved
   *
   * @throws {ApiError}
   * @throws {TimeoutError}
   */
  approvedList() {
    return this.rawApprovedList().then((body) =>
      Utils.deserializeResponseBody<ApiTypes.OrganizationMandateApprovedInstancesTargetSchema>(
        body,
      ),
    );
  }

  /**
   * List all mandates that the organization has approved
   *
   * @throws {ApiError}
   * @throws {TimeoutError}
   */
  rawApprovedList(): Promise<RawApiTypes.OrganizationMandateApprovedInstancesTargetSchema> {
    return this.client.request<RawApiTypes.OrganizationMandateApprovedInstancesTargetSchema>(
      {
        method: 'GET',
        url: '/organization-mandates/approved',
      },
    );
  }

  /**
   * List all mandates that the organization has been given
   *
   * @throws {ApiError}
   * @throws {TimeoutError}
   */
  givenList(
    queryParams?: ApiTypes.OrganizationMandateGivenInstancesHrefSchema,
  ) {
    return this.rawGivenList(queryParams).then((body) =>
      Utils.deserializeResponseBody<ApiTypes.OrganizationMandateGivenInstancesTargetSchema>(
        body,
      ),
    );
  }

  /**
   * List all mandates that the organization has been given
   *
   * @throws {ApiError}
   * @throws {TimeoutError}
   */
  rawGivenList(
    queryParams?: RawApiTypes.OrganizationMandateGivenInstancesHrefSchema,
  ): Promise<RawApiTypes.OrganizationMandateGivenInstancesTargetSchema> {
    return this.client.request<RawApiTypes.OrganizationMandateGivenInstancesTargetSchema>(
      {
        method: 'GET',
        url: '/organization-mandates/given',
        queryParams,
      },
    );
  }

  /**
   * Cancel an organization mandate
   *
   * @throws {ApiError}
   * @throws {TimeoutError}
   */
  destroy(organizationMandateId: string | ApiTypes.OrganizationMandateData) {
    return this.rawDestroy(Utils.toId(organizationMandateId)).then((body) =>
      Utils.deserializeResponseBody<ApiTypes.OrganizationMandateDestroyTargetSchema>(
        body,
      ),
    );
  }

  /**
   * Cancel an organization mandate
   *
   * @throws {ApiError}
   * @throws {TimeoutError}
   */
  rawDestroy(
    organizationMandateId: string,
  ): Promise<RawApiTypes.OrganizationMandateDestroyTargetSchema> {
    return this.client.request<RawApiTypes.OrganizationMandateDestroyTargetSchema>(
      {
        method: 'DELETE',
        url: `/organization-mandates/${organizationMandateId}`,
      },
    );
  }
}
