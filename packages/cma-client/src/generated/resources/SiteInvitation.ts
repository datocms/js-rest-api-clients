import * as Utils from '@datocms/rest-client-utils';
import BaseResource from '../../BaseResource';
import type * as SchemaTypes from '../SchemaTypes';
import type * as SimpleSchemaTypes from '../SimpleSchemaTypes';

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
  create(body: SimpleSchemaTypes.SiteInvitationCreateSchema) {
    return this.rawCreate(
      Utils.serializeRequestBody<SchemaTypes.SiteInvitationCreateSchema>(body, {
        type: 'site_invitation',
        attributes: ['email'],
        relationships: ['role'],
      }),
    ).then((body) =>
      Utils.deserializeResponseBody<SimpleSchemaTypes.SiteInvitationCreateTargetSchema>(
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
    body: SchemaTypes.SiteInvitationCreateSchema,
  ): Promise<SchemaTypes.SiteInvitationCreateTargetSchema> {
    return this.client.request<SchemaTypes.SiteInvitationCreateTargetSchema>({
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
    siteInvitationId: string | SimpleSchemaTypes.SiteInvitationData,
    body: SimpleSchemaTypes.SiteInvitationUpdateSchema,
  ) {
    return this.rawUpdate(
      Utils.toId(siteInvitationId),
      Utils.serializeRequestBody<SchemaTypes.SiteInvitationUpdateSchema>(body, {
        id: Utils.toId(siteInvitationId),
        type: 'site_invitation',
        attributes: [],
        relationships: ['role'],
      }),
    ).then((body) =>
      Utils.deserializeResponseBody<SimpleSchemaTypes.SiteInvitationUpdateTargetSchema>(
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
    body: SchemaTypes.SiteInvitationUpdateSchema,
  ): Promise<SchemaTypes.SiteInvitationUpdateTargetSchema> {
    return this.client.request<SchemaTypes.SiteInvitationUpdateTargetSchema>({
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
      Utils.deserializeResponseBody<SimpleSchemaTypes.SiteInvitationInstancesTargetSchema>(
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
  rawList(): Promise<SchemaTypes.SiteInvitationInstancesTargetSchema> {
    return this.client.request<SchemaTypes.SiteInvitationInstancesTargetSchema>(
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
  find(siteInvitationId: string | SimpleSchemaTypes.SiteInvitationData) {
    return this.rawFind(Utils.toId(siteInvitationId)).then((body) =>
      Utils.deserializeResponseBody<SimpleSchemaTypes.SiteInvitationSelfTargetSchema>(
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
  ): Promise<SchemaTypes.SiteInvitationSelfTargetSchema> {
    return this.client.request<SchemaTypes.SiteInvitationSelfTargetSchema>({
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
  destroy(siteInvitationId: string | SimpleSchemaTypes.SiteInvitationData) {
    return this.rawDestroy(Utils.toId(siteInvitationId)).then((body) =>
      Utils.deserializeResponseBody<SimpleSchemaTypes.SiteInvitationDestroyTargetSchema>(
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
  ): Promise<SchemaTypes.SiteInvitationDestroyTargetSchema> {
    return this.client.request<SchemaTypes.SiteInvitationDestroyTargetSchema>({
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
  resend(siteInvitationId: string | SimpleSchemaTypes.SiteInvitationData) {
    return this.rawResend(Utils.toId(siteInvitationId)).then((body) =>
      Utils.deserializeResponseBody<SimpleSchemaTypes.SiteInvitationResendTargetSchema>(
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
  ): Promise<SchemaTypes.SiteInvitationResendTargetSchema> {
    return this.client.request<SchemaTypes.SiteInvitationResendTargetSchema>({
      method: 'POST',
      url: `/site-invitations/${siteInvitationId}/resend`,
    });
  }
}
