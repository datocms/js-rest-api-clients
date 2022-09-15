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
  redeem() {
    return this.rawRedeem().then((body) =>
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
  rawRedeem(): Promise<SchemaTypes.SiteInvitationRedeemTargetSchema> {
    return this.client.request<SchemaTypes.SiteInvitationRedeemTargetSchema>({
      method: 'PUT',
      url: `/site_invitations/{(%2Fschemata%2Ffield%23%2Fdefinitions%2Fsite_invitation%2Ftoken)}/redeem`,
    });
  }
}
