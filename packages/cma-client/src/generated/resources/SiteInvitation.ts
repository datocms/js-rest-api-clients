import * as Utils from '@datocms/rest-client-utils';
import BaseResource from '../../BaseResource';
import type * as ApiTypes from '../ApiTypes';
import type * as RawApiTypes from '../RawApiTypes';

export default class SiteInvitation extends BaseResource {
  static readonly TYPE = 'site_invitation' as const;

  /**
   * Invite a new user
   *
   * Read more: https://www.datocms.com/docs/content-management-api/resources/site-invitation/create
   *
   * @throws {ApiError}
   * @throws {TimeoutError}
   */
  create(body: ApiTypes.SiteInvitationCreateSchema) {
    return this.rawCreate(
      Utils.serializeRequestBody<RawApiTypes.SiteInvitationCreateSchema>(body, {
        type: 'site_invitation',
        attributes: ['email'],
        relationships: ['role'],
      }),
    ).then((body) =>
      Utils.deserializeResponseBody<ApiTypes.SiteInvitationCreateTargetSchema>(
        body,
      ),
    );
  }

  /**
   * Invite a new user
   *
   * Read more: https://www.datocms.com/docs/content-management-api/resources/site-invitation/create
   *
   * @throws {ApiError}
   * @throws {TimeoutError}
   */
  rawCreate(
    body: RawApiTypes.SiteInvitationCreateSchema,
  ): Promise<RawApiTypes.SiteInvitationCreateTargetSchema> {
    return this.client.request<RawApiTypes.SiteInvitationCreateTargetSchema>({
      method: 'POST',
      url: '/site-invitations',
      body,
    });
  }

  /**
   * Update an invitation
   *
   * Read more: https://www.datocms.com/docs/content-management-api/resources/site-invitation/update
   *
   * @throws {ApiError}
   * @throws {TimeoutError}
   */
  update(
    siteInvitationId: string | ApiTypes.SiteInvitationData,
    body: ApiTypes.SiteInvitationUpdateSchema,
  ) {
    return this.rawUpdate(
      Utils.toId(siteInvitationId),
      Utils.serializeRequestBody<RawApiTypes.SiteInvitationUpdateSchema>(body, {
        id: Utils.toId(siteInvitationId),
        type: 'site_invitation',
        attributes: [],
        relationships: ['role'],
      }),
    ).then((body) =>
      Utils.deserializeResponseBody<ApiTypes.SiteInvitationUpdateTargetSchema>(
        body,
      ),
    );
  }

  /**
   * Update an invitation
   *
   * Read more: https://www.datocms.com/docs/content-management-api/resources/site-invitation/update
   *
   * @throws {ApiError}
   * @throws {TimeoutError}
   */
  rawUpdate(
    siteInvitationId: string,
    body: RawApiTypes.SiteInvitationUpdateSchema,
  ): Promise<RawApiTypes.SiteInvitationUpdateTargetSchema> {
    return this.client.request<RawApiTypes.SiteInvitationUpdateTargetSchema>({
      method: 'PUT',
      url: `/site-invitations/${siteInvitationId}`,
      body,
    });
  }

  /**
   * List all invitations
   *
   * Read more: https://www.datocms.com/docs/content-management-api/resources/site-invitation/instances
   *
   * @throws {ApiError}
   * @throws {TimeoutError}
   */
  list() {
    return this.rawList().then((body) =>
      Utils.deserializeResponseBody<ApiTypes.SiteInvitationInstancesTargetSchema>(
        body,
      ),
    );
  }

  /**
   * List all invitations
   *
   * Read more: https://www.datocms.com/docs/content-management-api/resources/site-invitation/instances
   *
   * @throws {ApiError}
   * @throws {TimeoutError}
   */
  rawList(): Promise<RawApiTypes.SiteInvitationInstancesTargetSchema> {
    return this.client.request<RawApiTypes.SiteInvitationInstancesTargetSchema>(
      {
        method: 'GET',
        url: '/site-invitations',
      },
    );
  }

  /**
   * Retrieve an invitation
   *
   * Read more: https://www.datocms.com/docs/content-management-api/resources/site-invitation/self
   *
   * @throws {ApiError}
   * @throws {TimeoutError}
   */
  find(siteInvitationId: string | ApiTypes.SiteInvitationData) {
    return this.rawFind(Utils.toId(siteInvitationId)).then((body) =>
      Utils.deserializeResponseBody<ApiTypes.SiteInvitationSelfTargetSchema>(
        body,
      ),
    );
  }

  /**
   * Retrieve an invitation
   *
   * Read more: https://www.datocms.com/docs/content-management-api/resources/site-invitation/self
   *
   * @throws {ApiError}
   * @throws {TimeoutError}
   */
  rawFind(
    siteInvitationId: string,
  ): Promise<RawApiTypes.SiteInvitationSelfTargetSchema> {
    return this.client.request<RawApiTypes.SiteInvitationSelfTargetSchema>({
      method: 'GET',
      url: `/site-invitations/${siteInvitationId}`,
    });
  }

  /**
   * Delete an invitation
   *
   * Read more: https://www.datocms.com/docs/content-management-api/resources/site-invitation/destroy
   *
   * @throws {ApiError}
   * @throws {TimeoutError}
   */
  destroy(siteInvitationId: string | ApiTypes.SiteInvitationData) {
    return this.rawDestroy(Utils.toId(siteInvitationId)).then((body) =>
      Utils.deserializeResponseBody<ApiTypes.SiteInvitationDestroyTargetSchema>(
        body,
      ),
    );
  }

  /**
   * Delete an invitation
   *
   * Read more: https://www.datocms.com/docs/content-management-api/resources/site-invitation/destroy
   *
   * @throws {ApiError}
   * @throws {TimeoutError}
   */
  rawDestroy(
    siteInvitationId: string,
  ): Promise<RawApiTypes.SiteInvitationDestroyTargetSchema> {
    return this.client.request<RawApiTypes.SiteInvitationDestroyTargetSchema>({
      method: 'DELETE',
      url: `/site-invitations/${siteInvitationId}`,
    });
  }

  /**
   * Resend an invitation
   *
   * Read more: https://www.datocms.com/docs/content-management-api/resources/site-invitation/resend
   *
   * @throws {ApiError}
   * @throws {TimeoutError}
   */
  resend(siteInvitationId: string | ApiTypes.SiteInvitationData) {
    return this.rawResend(Utils.toId(siteInvitationId)).then((body) =>
      Utils.deserializeResponseBody<ApiTypes.SiteInvitationResendTargetSchema>(
        body,
      ),
    );
  }

  /**
   * Resend an invitation
   *
   * Read more: https://www.datocms.com/docs/content-management-api/resources/site-invitation/resend
   *
   * @throws {ApiError}
   * @throws {TimeoutError}
   */
  rawResend(
    siteInvitationId: string,
  ): Promise<RawApiTypes.SiteInvitationResendTargetSchema> {
    return this.client.request<RawApiTypes.SiteInvitationResendTargetSchema>({
      method: 'POST',
      url: `/site-invitations/${siteInvitationId}/resend`,
    });
  }
}
