import * as Utils from '@datocms/rest-client-utils';
import * as SchemaTypes from '../SchemaTypes';
import * as SimpleSchemaTypes from '../SimpleSchemaTypes';
import BaseResource from '../../BaseResource';

export default class OrganizationInvitation extends BaseResource {
  static readonly TYPE: 'organization_invitation' = 'organization_invitation';

  /**
   * Invite a new member
   *
   * @throws {ApiError}
   * @throws {TimeoutError}
   */
  create(body: SimpleSchemaTypes.OrganizationInvitationCreateSchema) {
    return this.rawCreate(
      Utils.serializeRequestBody<SchemaTypes.OrganizationInvitationCreateSchema>(
        body,
        {
          type: 'organization_invitation',
          attributes: ['email'],
          relationships: ['role'],
        },
      ),
    ).then((body) =>
      Utils.deserializeResponseBody<SimpleSchemaTypes.OrganizationInvitationCreateTargetSchema>(
        body,
      ),
    );
  }

  /**
   * Invite a new member
   *
   * @throws {ApiError}
   * @throws {TimeoutError}
   */
  rawCreate(
    body: SchemaTypes.OrganizationInvitationCreateSchema,
  ): Promise<SchemaTypes.OrganizationInvitationCreateTargetSchema> {
    return this.client.request<SchemaTypes.OrganizationInvitationCreateTargetSchema>(
      {
        method: 'POST',
        url: '/organization-invitations',
        body,
      },
    );
  }

  /**
   * Update an invitation
   *
   * @throws {ApiError}
   * @throws {TimeoutError}
   */
  update(
    organizationInvitationId:
      | string
      | SimpleSchemaTypes.OrganizationInvitationData,
    body: SimpleSchemaTypes.OrganizationInvitationUpdateSchema,
  ) {
    return this.rawUpdate(
      Utils.toId(organizationInvitationId),
      Utils.serializeRequestBody<SchemaTypes.OrganizationInvitationUpdateSchema>(
        body,
        {
          id: Utils.toId(organizationInvitationId),
          type: 'organization_invitation',
          attributes: [],
          relationships: ['role'],
        },
      ),
    ).then((body) =>
      Utils.deserializeResponseBody<SimpleSchemaTypes.OrganizationInvitationUpdateTargetSchema>(
        body,
      ),
    );
  }

  /**
   * Update an invitation
   *
   * @throws {ApiError}
   * @throws {TimeoutError}
   */
  rawUpdate(
    organizationInvitationId: string,
    body: SchemaTypes.OrganizationInvitationUpdateSchema,
  ): Promise<SchemaTypes.OrganizationInvitationUpdateTargetSchema> {
    return this.client.request<SchemaTypes.OrganizationInvitationUpdateTargetSchema>(
      {
        method: 'PUT',
        url: `/organization-invitations/${organizationInvitationId}`,
        body,
      },
    );
  }

  /**
   * List all invitations
   *
   * @throws {ApiError}
   * @throws {TimeoutError}
   */
  list() {
    return this.rawList().then((body) =>
      Utils.deserializeResponseBody<SimpleSchemaTypes.OrganizationInvitationInstancesTargetSchema>(
        body,
      ),
    );
  }

  /**
   * List all invitations
   *
   * @throws {ApiError}
   * @throws {TimeoutError}
   */
  rawList(): Promise<SchemaTypes.OrganizationInvitationInstancesTargetSchema> {
    return this.client.request<SchemaTypes.OrganizationInvitationInstancesTargetSchema>(
      {
        method: 'GET',
        url: '/organization-invitations',
      },
    );
  }

  /**
   * Retrieve an invitation
   *
   * @throws {ApiError}
   * @throws {TimeoutError}
   */
  find(
    organizationInvitationId:
      | string
      | SimpleSchemaTypes.OrganizationInvitationData,
  ) {
    return this.rawFind(Utils.toId(organizationInvitationId)).then((body) =>
      Utils.deserializeResponseBody<SimpleSchemaTypes.OrganizationInvitationSelfTargetSchema>(
        body,
      ),
    );
  }

  /**
   * Retrieve an invitation
   *
   * @throws {ApiError}
   * @throws {TimeoutError}
   */
  rawFind(
    organizationInvitationId: string,
  ): Promise<SchemaTypes.OrganizationInvitationSelfTargetSchema> {
    return this.client.request<SchemaTypes.OrganizationInvitationSelfTargetSchema>(
      {
        method: 'GET',
        url: `/organization-invitations/${organizationInvitationId}`,
      },
    );
  }

  /**
   * Delete an invitation
   *
   * @throws {ApiError}
   * @throws {TimeoutError}
   */
  destroy(
    organizationInvitationId:
      | string
      | SimpleSchemaTypes.OrganizationInvitationData,
  ) {
    return this.rawDestroy(Utils.toId(organizationInvitationId)).then((body) =>
      Utils.deserializeResponseBody<SimpleSchemaTypes.OrganizationInvitationDestroyTargetSchema>(
        body,
      ),
    );
  }

  /**
   * Delete an invitation
   *
   * @throws {ApiError}
   * @throws {TimeoutError}
   */
  rawDestroy(
    organizationInvitationId: string,
  ): Promise<SchemaTypes.OrganizationInvitationDestroyTargetSchema> {
    return this.client.request<SchemaTypes.OrganizationInvitationDestroyTargetSchema>(
      {
        method: 'DELETE',
        url: `/organization-invitations/${organizationInvitationId}`,
      },
    );
  }

  /**
   * Resend an invitation
   *
   * @throws {ApiError}
   * @throws {TimeoutError}
   */
  resend(
    organizationInvitationId:
      | string
      | SimpleSchemaTypes.OrganizationInvitationData,
  ) {
    return this.rawResend(Utils.toId(organizationInvitationId));
  }

  /**
   * Resend an invitation
   *
   * @throws {ApiError}
   * @throws {TimeoutError}
   */
  rawResend(organizationInvitationId: string): Promise<void> {
    return this.client.request<void>({
      method: 'POST',
      url: `/organization-invitations/${organizationInvitationId}/resend`,
    });
  }

  /**
   * Redeem token
   *
   * @throws {ApiError}
   * @throws {TimeoutError}
   */
  redeem(
    organizationInvitationId:
      | string
      | SimpleSchemaTypes.OrganizationInvitationData,
    queryParams?: SimpleSchemaTypes.OrganizationInvitationRedeemHrefSchema,
  ) {
    return this.rawRedeem(
      Utils.toId(organizationInvitationId),
      queryParams,
    ).then((body) =>
      Utils.deserializeResponseBody<SimpleSchemaTypes.OrganizationInvitationRedeemTargetSchema>(
        body,
      ),
    );
  }

  /**
   * Redeem token
   *
   * @throws {ApiError}
   * @throws {TimeoutError}
   */
  rawRedeem(
    organizationInvitationId: string,
    queryParams?: SchemaTypes.OrganizationInvitationRedeemHrefSchema,
  ): Promise<SchemaTypes.OrganizationInvitationRedeemTargetSchema> {
    return this.client.request<SchemaTypes.OrganizationInvitationRedeemTargetSchema>(
      {
        method: 'PUT',
        url: `/organization-invitations/${organizationInvitationId}/redeem`,
        queryParams,
      },
    );
  }
}
