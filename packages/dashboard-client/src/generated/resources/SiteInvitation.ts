import * as Utils from '@datocms/rest-client-utils';
import BaseResource from '../../BaseResource';
import type * as ApiTypes from '../ApiTypes';
import type * as RawApiTypes from '../RawApiTypes';

export default class SiteInvitation extends BaseResource {
  static readonly TYPE = 'site_invitation' as const;

  /**
   * Redeem token
   *
   * @throws {ApiError}
   * @throws {TimeoutError}
   */
  redeem(
    siteInvitationId: string | ApiTypes.SiteInvitationData,
    queryParams?: ApiTypes.SiteInvitationRedeemHrefSchema,
  ) {
    return this.rawRedeem(Utils.toId(siteInvitationId), queryParams).then(
      (body) =>
        Utils.deserializeResponseBody<ApiTypes.SiteInvitationRedeemTargetSchema>(
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
    queryParams?: RawApiTypes.SiteInvitationRedeemHrefSchema,
  ): Promise<RawApiTypes.SiteInvitationRedeemTargetSchema> {
    return this.client.request<RawApiTypes.SiteInvitationRedeemTargetSchema>({
      method: 'PUT',
      url: `/site-invitations/${siteInvitationId}/redeem`,
      queryParams,
    });
  }
}
