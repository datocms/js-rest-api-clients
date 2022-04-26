import * as Utils from '@datocms/rest-client-utils';
import * as SimpleSchemaTypes from './generated/SimpleSchemaTypes';
import * as SchemaTypes from './generated/SchemaTypes';
import { Item } from './generated/resources';

export function buildBlockRecord(body: SimpleSchemaTypes.ItemUpdateSchema) {
  return Utils.serializeRequestBody<SchemaTypes.ItemUpdateSchema>(body, {
    type: Item.TYPE,
    attributes: '*',
    relationships: ['item_type'],
  }).data;
}
