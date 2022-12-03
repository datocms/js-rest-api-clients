import * as Utils from '@datocms/rest-client-utils';
import * as SchemaTypes from '../SchemaTypes';
import * as SimpleSchemaTypes from '../SimpleSchemaTypes';
import BaseResource from '../../BaseResource';

export default class SiteInvitation extends BaseResource {
  static readonly TYPE: 'site_invitation' = 'site_invitation';

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
