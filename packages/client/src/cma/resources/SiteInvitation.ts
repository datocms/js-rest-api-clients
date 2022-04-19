import BaseResource from '../BaseResource';
import { serializeRequestBody } from '../../serialize';
import {
  deserializeResponseBody,
  deserializeJsonEntity,
} from '../../deserialize';
import toId from '../../toId';
import * as SchemaTypes from '../SchemaTypes';
import * as SimpleSchemaTypes from '../SimpleSchemaTypes';
import { IteratorOptions, rawPageIterator } from '../../rawPageIterator';

export default class SiteInvitation extends BaseResource {
  static readonly TYPE: 'site_invitation' = 'site_invitation';

  /**
   * Invite a new user
   *
   * Read more: https://www.datocms.com/docs/content-management-api/resources/site-invitation/create
   */
  create(body: SimpleSchemaTypes.SiteInvitationCreateSchema) {
    return this.rawCreate(
      serializeRequestBody<SchemaTypes.SiteInvitationCreateSchema>({
        body,
        type: SiteInvitation.TYPE,
      }),
    ).then((body) =>
      deserializeResponseBody<SimpleSchemaTypes.SiteInvitationCreateTargetSchema>(
        body,
      ),
    );
  }

  /**
   * Invite a new user
   *
   * Read more: https://www.datocms.com/docs/content-management-api/resources/site-invitation/create
   */
  rawCreate(
    body: SchemaTypes.SiteInvitationCreateSchema,
  ): Promise<SchemaTypes.SiteInvitationCreateTargetSchema> {
    return this.client.request<SchemaTypes.SiteInvitationCreateTargetSchema>({
      method: 'POST',
      url: `/site-invitations`,
      body,
    });
  }

  /**
   * Update an invitation
   *
   * Read more: https://www.datocms.com/docs/content-management-api/resources/site-invitation/update
   */
  update(
    siteInvitationId: string | SimpleSchemaTypes.SiteInvitationData,
    body: SimpleSchemaTypes.SiteInvitationUpdateSchema,
  ) {
    return this.rawUpdate(
      toId(siteInvitationId),
      serializeRequestBody<SchemaTypes.SiteInvitationUpdateSchema>({
        body,
        id: toId(siteInvitationId),
        type: SiteInvitation.TYPE,
      }),
    ).then((body) =>
      deserializeResponseBody<SimpleSchemaTypes.SiteInvitationUpdateTargetSchema>(
        body,
      ),
    );
  }

  /**
   * Update an invitation
   *
   * Read more: https://www.datocms.com/docs/content-management-api/resources/site-invitation/update
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
   */
  list() {
    return this.rawList().then((body) =>
      deserializeResponseBody<SimpleSchemaTypes.SiteInvitationInstancesTargetSchema>(
        body,
      ),
    );
  }

  /**
   * List all invitations
   *
   * Read more: https://www.datocms.com/docs/content-management-api/resources/site-invitation/instances
   */
  rawList(): Promise<SchemaTypes.SiteInvitationInstancesTargetSchema> {
    return this.client.request<SchemaTypes.SiteInvitationInstancesTargetSchema>(
      {
        method: 'GET',
        url: `/site-invitations`,
      },
    );
  }

  /**
   * Retrieve an invitation
   *
   * Read more: https://www.datocms.com/docs/content-management-api/resources/site-invitation/self
   */
  find(siteInvitationId: string | SimpleSchemaTypes.SiteInvitationData) {
    return this.rawFind(toId(siteInvitationId)).then((body) =>
      deserializeResponseBody<SimpleSchemaTypes.SiteInvitationSelfTargetSchema>(
        body,
      ),
    );
  }

  /**
   * Retrieve an invitation
   *
   * Read more: https://www.datocms.com/docs/content-management-api/resources/site-invitation/self
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
   */
  destroy(siteInvitationId: string | SimpleSchemaTypes.SiteInvitationData) {
    return this.rawDestroy(toId(siteInvitationId)).then((body) =>
      deserializeResponseBody<SimpleSchemaTypes.SiteInvitationDestroyTargetSchema>(
        body,
      ),
    );
  }

  /**
   * Delete an invitation
   *
   * Read more: https://www.datocms.com/docs/content-management-api/resources/site-invitation/destroy
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
   */
  resend(siteInvitationId: string | SimpleSchemaTypes.SiteInvitationData) {
    return this.rawResend(toId(siteInvitationId));
  }

  /**
   * Resend an invitation
   *
   * Read more: https://www.datocms.com/docs/content-management-api/resources/site-invitation/resend
   */
  rawResend(siteInvitationId: string): Promise<void> {
    return this.client.request<void>({
      method: 'POST',
      url: `/site-invitations/${siteInvitationId}/resend`,
    });
  }
}
