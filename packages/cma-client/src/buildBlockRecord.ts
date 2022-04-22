import * as Utils from '@datocms/rest-client-utils';
import * as SimpleSchemaTypes from './generated/SimpleSchemaTypes';
import { Item } from './generated/resources';

export function buildBlockRecord(body: SimpleSchemaTypes.ItemUpdateSchema) {
  return Utils.serializeRequestBody<SimpleSchemaTypes.ItemUpdateSchema>(body, {
    type: Item.TYPE,
    attributes: '*',
    relationships: ['item_type'],
  });
}
