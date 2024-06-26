import * as Utils from '@datocms/rest-client-utils';
import BaseResource from '../../BaseResource';
import type * as SchemaTypes from '../SchemaTypes';
import type * as SimpleSchemaTypes from '../SimpleSchemaTypes';

export default class SiteInvitation extends BaseResource {
  static readonly TYPE = 'site_invitation' as const;

  /**
   * Redeem token
   *
   * @throws {ApiError}
   * @throws {TimeoutError}
   */
  redeem(
    siteInvitationId: string | SimpleSchemaTypes.SiteInvitationData,
    queryParams?: SimpleSchemaTypes.SiteInvitationRedeemHrefSchema,
  ) {
    return this.rawRedeem(Utils.toId(siteInvitationId), queryParams).then(
      (body) =>
        Utils.deserializeResponseBody<SimpleSchemaTypes.SiteInvitationRedeemTargetSchema>(
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
    siteInvitationId: string,
    queryParams?: SchemaTypes.SiteInvitationRedeemHrefSchema,
  ): Promise<SchemaTypes.SiteInvitationRedeemTargetSchema> {
    return this.client.request<SchemaTypes.SiteInvitationRedeemTargetSchema>({
      method: 'PUT',
      url: `/site-invitations/${siteInvitationId}/redeem`,
      queryParams,
    });
  }
}
