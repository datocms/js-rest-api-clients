import * as Utils from '@datocms/rest-client-utils';
import BaseResource from '../../BaseResource';
import type * as ApiTypes from '../ApiTypes';
import type * as RawApiTypes from '../RawApiTypes';

export default class OrganizationInvitation extends BaseResource {
  static readonly TYPE = 'organization_invitation' as const;

  /**
   * Invite a new member
   *
   * @throws {ApiError}
   * @throws {TimeoutError}
   */
  create(body: ApiTypes.OrganizationInvitationCreateSchema) {
    return this.rawCreate(
      Utils.serializeRequestBody<RawApiTypes.OrganizationInvitationCreateSchema>(
        body,
        {
          type: 'organization_invitation',
          attributes: ['email'],
          relationships: ['role'],
        },
      ),
    ).then((body) =>
      Utils.deserializeResponseBody<ApiTypes.OrganizationInvitationCreateTargetSchema>(
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
    body: RawApiTypes.OrganizationInvitationCreateSchema,
  ): Promise<RawApiTypes.OrganizationInvitationCreateTargetSchema> {
    return this.client.request<RawApiTypes.OrganizationInvitationCreateTargetSchema>(
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
    organizationInvitationId: string | ApiTypes.OrganizationInvitationData,
    body: ApiTypes.OrganizationInvitationUpdateSchema,
  ) {
    return this.rawUpdate(
      Utils.toId(organizationInvitationId),
      Utils.serializeRequestBody<RawApiTypes.OrganizationInvitationUpdateSchema>(
        body,
        {
          id: Utils.toId(organizationInvitationId),
          type: 'organization_invitation',
          attributes: [],
          relationships: ['role'],
        },
      ),
    ).then((body) =>
      Utils.deserializeResponseBody<ApiTypes.OrganizationInvitationUpdateTargetSchema>(
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
    body: RawApiTypes.OrganizationInvitationUpdateSchema,
  ): Promise<RawApiTypes.OrganizationInvitationUpdateTargetSchema> {
    return this.client.request<RawApiTypes.OrganizationInvitationUpdateTargetSchema>(
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
      Utils.deserializeResponseBody<ApiTypes.OrganizationInvitationInstancesTargetSchema>(
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
  rawList(): Promise<RawApiTypes.OrganizationInvitationInstancesTargetSchema> {
    return this.client.request<RawApiTypes.OrganizationInvitationInstancesTargetSchema>(
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
  find(organizationInvitationId: string | ApiTypes.OrganizationInvitationData) {
    return this.rawFind(Utils.toId(organizationInvitationId)).then((body) =>
      Utils.deserializeResponseBody<ApiTypes.OrganizationInvitationSelfTargetSchema>(
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
  ): Promise<RawApiTypes.OrganizationInvitationSelfTargetSchema> {
    return this.client.request<RawApiTypes.OrganizationInvitationSelfTargetSchema>(
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
    organizationInvitationId: string | ApiTypes.OrganizationInvitationData,
  ) {
    return this.rawDestroy(Utils.toId(organizationInvitationId)).then((body) =>
      Utils.deserializeResponseBody<ApiTypes.OrganizationInvitationDestroyTargetSchema>(
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
  ): Promise<RawApiTypes.OrganizationInvitationDestroyTargetSchema> {
    return this.client.request<RawApiTypes.OrganizationInvitationDestroyTargetSchema>(
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
    organizationInvitationId: string | ApiTypes.OrganizationInvitationData,
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
    organizationInvitationId: string | ApiTypes.OrganizationInvitationData,
    queryParams?: ApiTypes.OrganizationInvitationRedeemHrefSchema,
  ) {
    return this.rawRedeem(
      Utils.toId(organizationInvitationId),
      queryParams,
    ).then((body) =>
      Utils.deserializeResponseBody<ApiTypes.OrganizationInvitationRedeemTargetSchema>(
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
    queryParams?: RawApiTypes.OrganizationInvitationRedeemHrefSchema,
  ): Promise<RawApiTypes.OrganizationInvitationRedeemTargetSchema> {
    return this.client.request<RawApiTypes.OrganizationInvitationRedeemTargetSchema>(
      {
        method: 'PUT',
        url: `/organization-invitations/${organizationInvitationId}/redeem`,
        queryParams,
      },
    );
  }
}
