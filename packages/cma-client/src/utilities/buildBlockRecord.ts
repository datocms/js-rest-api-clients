import * as Utils from '@datocms/rest-client-utils';
import type { NewBlockInRequest } from '../fieldTypes';
import type * as ApiTypes from '../generated/ApiTypes';
import { Item } from '../generated/resources';
import type {
  ItemTypeDefinition,
  ToItemAttributesInRequest,
} from './itemDefinition';

type NoInfer<T> = [T][T extends any ? 0 : never];

type CreateBlockRecordSchema<
  D extends ItemTypeDefinition = ItemTypeDefinition,
> = {
  type?: ApiTypes.ItemType1;
  item_type: ApiTypes.ItemTypeData<D>;
  meta?: ApiTypes.ItemUpdateSchema['meta'];
  creator?: ApiTypes.ItemUpdateSchema['creator'];
  __itemTypeId?: D['itemTypeId'];
} & ToItemAttributesInRequest<D>;

type UpdateBlockRecordSchema<
  D extends ItemTypeDefinition = ItemTypeDefinition,
> = {
  id: ApiTypes.ItemIdentity;
  type?: ApiTypes.ItemType1;
  item_type?: ApiTypes.ItemTypeData<D>;
  meta?: ApiTypes.ItemUpdateSchema['meta'];
  creator?: ApiTypes.ItemUpdateSchema['creator'];
  __itemTypeId?: D['itemTypeId'];
} & ToItemAttributesInRequest<D>;

export function buildBlockRecord<
  D extends ItemTypeDefinition = ItemTypeDefinition,
>(
  body:
    | CreateBlockRecordSchema<NoInfer<D>>
    | UpdateBlockRecordSchema<NoInfer<D>>,
): NewBlockInRequest<NoInfer<D>> {
  const data = Utils.serializeRequestBody<{
    data: NewBlockInRequest<NoInfer<D>>;
  }>(body, {
    type: Item.TYPE,
    attributes: '*',
    relationships: ['item_type'],
  }).data;

  // Mirror the deserializer: expose `item_type.data.id` as a top-level
  // `__itemTypeId` so locally-built blocks support the same TS narrowing
  // pattern as blocks read from API responses. The field is TS-only and is
  // stripped again by the serializer when the outer request is sent.
  return {
    ...data,
    __itemTypeId: data.relationships.item_type.data.id,
  } as NewBlockInRequest<NoInfer<D>>;
}
