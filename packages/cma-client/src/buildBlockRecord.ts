import * as Utils from '@datocms/rest-client-utils';
import type * as SchemaTypes from './generated/SchemaTypes';
import type * as SimpleSchemaTypes from './generated/SimpleSchemaTypes';
import { Item } from './generated/resources';

export function buildBlockRecord(body: SimpleSchemaTypes.ItemUpdateSchema) {
  return Utils.serializeRequestBody<SchemaTypes.ItemUpdateSchema>(body, {
    type: Item.TYPE,
    attributes: '*',
    relationships: ['item_type'],
  }).data;
}
