import * as Utils from '@datocms/rest-client-utils';
import BaseResource from '../../BaseResource';
import type * as ApiTypes from '../ApiTypes';
import type * as RawApiTypes from '../RawApiTypes';

export default class OrganizationMembership extends BaseResource {
  static readonly TYPE = 'organization_membership' as const;

  /**
   * Update an organization membership
   *
   * @throws {ApiError}
   * @throws {TimeoutError}
   */
  update(
    organizationMembershipId: string | ApiTypes.OrganizationMembershipData,
    body: ApiTypes.OrganizationMembershipUpdateSchema,
  ) {
    return this.rawUpdate(
      Utils.toId(organizationMembershipId),
      Utils.serializeRequestBody<RawApiTypes.OrganizationMembershipUpdateSchema>(
        body,
        {
          id: Utils.toId(organizationMembershipId),
          type: 'organization_membership',
          attributes: [],
          relationships: ['role'],
        },
      ),
    ).then((body) =>
      Utils.deserializeResponseBody<ApiTypes.OrganizationMembershipUpdateTargetSchema>(
        body,
      ),
    );
  }

  /**
   * Update an organization membership
   *
   * @throws {ApiError}
   * @throws {TimeoutError}
   */
  rawUpdate(
    organizationMembershipId: string,
    body: RawApiTypes.OrganizationMembershipUpdateSchema,
  ): Promise<RawApiTypes.OrganizationMembershipUpdateTargetSchema> {
    return this.client.request<RawApiTypes.OrganizationMembershipUpdateTargetSchema>(
      {
        method: 'PUT',
        url: `/organization-memberships/${organizationMembershipId}`,
        body,
      },
    );
  }

  /**
   * List all organization memberships
   *
   * @throws {ApiError}
   * @throws {TimeoutError}
   */
  list(queryParams?: ApiTypes.OrganizationMembershipInstancesHrefSchema) {
    return this.rawList(queryParams).then((body) =>
      Utils.deserializeResponseBody<ApiTypes.OrganizationMembershipInstancesTargetSchema>(
        body,
      ),
    );
  }

  /**
   * List all organization memberships
   *
   * @throws {ApiError}
   * @throws {TimeoutError}
   */
  rawList(
    queryParams?: RawApiTypes.OrganizationMembershipInstancesHrefSchema,
  ): Promise<RawApiTypes.OrganizationMembershipInstancesTargetSchema> {
    return this.client.request<RawApiTypes.OrganizationMembershipInstancesTargetSchema>(
      {
        method: 'GET',
        url: '/organization-memberships',
        queryParams,
      },
    );
  }

  /**
   * Retrieve an organization membership
   *
   * @throws {ApiError}
   * @throws {TimeoutError}
   */
  find(
    organizationMembershipId: string | ApiTypes.OrganizationMembershipData,
    queryParams?: ApiTypes.OrganizationMembershipSelfHrefSchema,
  ) {
    return this.rawFind(Utils.toId(organizationMembershipId), queryParams).then(
      (body) =>
        Utils.deserializeResponseBody<ApiTypes.OrganizationMembershipSelfTargetSchema>(
          body,
        ),
    );
  }

  /**
   * Retrieve an organization membership
   *
   * @throws {ApiError}
   * @throws {TimeoutError}
   */
  rawFind(
    organizationMembershipId: string,
    queryParams?: RawApiTypes.OrganizationMembershipSelfHrefSchema,
  ): Promise<RawApiTypes.OrganizationMembershipSelfTargetSchema> {
    return this.client.request<RawApiTypes.OrganizationMembershipSelfTargetSchema>(
      {
        method: 'GET',
        url: `/organization-memberships/${organizationMembershipId}`,
        queryParams,
      },
    );
  }

  /**
   * Retrieve currently signed-in account organization membership
   *
   * @throws {ApiError}
   * @throws {TimeoutError}
   */
  findMe(queryParams?: ApiTypes.OrganizationMembershipMeHrefSchema) {
    return this.rawFindMe(queryParams).then((body) =>
      Utils.deserializeResponseBody<ApiTypes.OrganizationMembershipMeTargetSchema>(
        body,
      ),
    );
  }

  /**
   * Retrieve currently signed-in account organization membership
   *
   * @throws {ApiError}
   * @throws {TimeoutError}
   */
  rawFindMe(
    queryParams?: RawApiTypes.OrganizationMembershipMeHrefSchema,
  ): Promise<RawApiTypes.OrganizationMembershipMeTargetSchema> {
    return this.client.request<RawApiTypes.OrganizationMembershipMeTargetSchema>(
      {
        method: 'GET',
        url: '/organization-memberships/me',
        queryParams,
      },
    );
  }

  /**
   * Delete an organization membership
   *
   * @throws {ApiError}
   * @throws {TimeoutError}
   */
  destroy(
    organizationMembershipId: string | ApiTypes.OrganizationMembershipData,
  ) {
    return this.rawDestroy(Utils.toId(organizationMembershipId)).then((body) =>
      Utils.deserializeResponseBody<ApiTypes.OrganizationMembershipDestroyTargetSchema>(
        body,
      ),
    );
  }

  /**
   * Delete an organization membership
   *
   * @throws {ApiError}
   * @throws {TimeoutError}
   */
  rawDestroy(
    organizationMembershipId: string,
  ): Promise<RawApiTypes.OrganizationMembershipDestroyTargetSchema> {
    return this.client.request<RawApiTypes.OrganizationMembershipDestroyTargetSchema>(
      {
        method: 'DELETE',
        url: `/organization-memberships/${organizationMembershipId}`,
      },
    );
  }
}
