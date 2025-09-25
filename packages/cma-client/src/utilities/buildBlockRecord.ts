import * as Utils from '@datocms/rest-client-utils';
import type { NewBlockInRequest } from '../fieldTypes';
import type * as ApiTypes from '../generated/ApiTypes';
import { Item } from '../generated/resources';
import type { ItemTypeDefinition } from './itemDefinition';

type NoInfer<T> = [T][T extends any ? 0 : never];

export function buildBlockRecord<
  D extends ItemTypeDefinition = ItemTypeDefinition,
>(body: ApiTypes.ItemUpdateSchema<NoInfer<D>>): NewBlockInRequest<NoInfer<D>> {
  return Utils.serializeRequestBody<{
    data: NewBlockInRequest<NoInfer<D>>;
  }>(body, {
    type: Item.TYPE,
    attributes: '*',
    relationships: ['item_type'],
  }).data;
}
