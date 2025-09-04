import * as Utils from '@datocms/rest-client-utils';
import type * as ApiTypes from '../generated/ApiTypes';
import type * as RawApiTypes from '../generated/RawApiTypes';
import { Item } from '../generated/resources';

export function buildBlockRecord(body: ApiTypes.ItemUpdateSchema) {
  return Utils.serializeRequestBody<RawApiTypes.ItemUpdateSchema>(body, {
    type: Item.TYPE,
    attributes: '*',
    relationships: ['item_type'],
  }).data;
}
