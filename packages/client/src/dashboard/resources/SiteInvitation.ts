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
   * Redeem token
   */
  redeem() {
    return this.rawRedeem().then((body) =>
      deserializeResponseBody<SimpleSchemaTypes.SiteInvitationRedeemTargetSchema>(
        body,
      ),
    );
  }

  /**
   * Redeem token
   */
  rawRedeem(): Promise<SchemaTypes.SiteInvitationRedeemTargetSchema> {
    return this.client.request<SchemaTypes.SiteInvitationRedeemTargetSchema>({
      method: 'PUT',
      url: `/site_invitations/{(%2Fschemata%2Ffield%23%2Fdefinitions%2Fsite_invitation%2Ftoken)}/redeem`,
    });
  }
}
