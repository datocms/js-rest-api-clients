import * as Utils from '@datocms/rest-client-utils';
import * as SchemaTypes from '../SchemaTypes';
import * as SimpleSchemaTypes from '../SimpleSchemaTypes';
import BaseResource from '../../BaseResource';

export default class OrganizationMembership extends BaseResource {
  static readonly TYPE = 'organization_membership' as const;

  /**
   * Update an organization membership
   *
   * @throws {ApiError}
   * @throws {TimeoutError}
   */
  update(
    organizationMembershipId:
      | string
      | SimpleSchemaTypes.OrganizationMembershipData,
    body: SimpleSchemaTypes.OrganizationMembershipUpdateSchema,
  ) {
    return this.rawUpdate(
      Utils.toId(organizationMembershipId),
      Utils.serializeRequestBody<SchemaTypes.OrganizationMembershipUpdateSchema>(
        body,
        {
          id: Utils.toId(organizationMembershipId),
          type: 'organization_membership',
          attributes: [],
          relationships: ['role'],
        },
      ),
    ).then((body) =>
      Utils.deserializeResponseBody<SimpleSchemaTypes.OrganizationMembershipUpdateTargetSchema>(
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
    body: SchemaTypes.OrganizationMembershipUpdateSchema,
  ): Promise<SchemaTypes.OrganizationMembershipUpdateTargetSchema> {
    return this.client.request<SchemaTypes.OrganizationMembershipUpdateTargetSchema>(
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
  list(
    queryParams?: SimpleSchemaTypes.OrganizationMembershipInstancesHrefSchema,
  ) {
    return this.rawList(queryParams).then((body) =>
      Utils.deserializeResponseBody<SimpleSchemaTypes.OrganizationMembershipInstancesTargetSchema>(
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
    queryParams?: SchemaTypes.OrganizationMembershipInstancesHrefSchema,
  ): Promise<SchemaTypes.OrganizationMembershipInstancesTargetSchema> {
    return this.client.request<SchemaTypes.OrganizationMembershipInstancesTargetSchema>(
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
    organizationMembershipId:
      | string
      | SimpleSchemaTypes.OrganizationMembershipData,
    queryParams?: SimpleSchemaTypes.OrganizationMembershipSelfHrefSchema,
  ) {
    return this.rawFind(Utils.toId(organizationMembershipId), queryParams).then(
      (body) =>
        Utils.deserializeResponseBody<SimpleSchemaTypes.OrganizationMembershipSelfTargetSchema>(
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
    queryParams?: SchemaTypes.OrganizationMembershipSelfHrefSchema,
  ): Promise<SchemaTypes.OrganizationMembershipSelfTargetSchema> {
    return this.client.request<SchemaTypes.OrganizationMembershipSelfTargetSchema>(
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
  findMe(queryParams?: SimpleSchemaTypes.OrganizationMembershipMeHrefSchema) {
    return this.rawFindMe(queryParams).then((body) =>
      Utils.deserializeResponseBody<SimpleSchemaTypes.OrganizationMembershipMeTargetSchema>(
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
    queryParams?: SchemaTypes.OrganizationMembershipMeHrefSchema,
  ): Promise<SchemaTypes.OrganizationMembershipMeTargetSchema> {
    return this.client.request<SchemaTypes.OrganizationMembershipMeTargetSchema>(
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
    organizationMembershipId:
      | string
      | SimpleSchemaTypes.OrganizationMembershipData,
  ) {
    return this.rawDestroy(Utils.toId(organizationMembershipId)).then((body) =>
      Utils.deserializeResponseBody<SimpleSchemaTypes.OrganizationMembershipDestroyTargetSchema>(
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
  ): Promise<SchemaTypes.OrganizationMembershipDestroyTargetSchema> {
    return this.client.request<SchemaTypes.OrganizationMembershipDestroyTargetSchema>(
      {
        method: 'DELETE',
        url: `/organization-memberships/${organizationMembershipId}`,
      },
    );
  }
}
