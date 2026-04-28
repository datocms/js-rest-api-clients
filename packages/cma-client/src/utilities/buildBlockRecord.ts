import * as Utils from '@datocms/rest-client-utils';
import type { NewBlockInRequest } from '../fieldTypes/index.js';
import type * as ApiTypes from '../generated/ApiTypes.js';
import { Item } from '../generated/resources/index.js';
import type {
  ItemTypeDefinition,
  ToItemAttributesInRequest,
} from './itemDefinition.js';

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
  //
  // `item_type` is optional on `UpdateBlockRecordSchema` (id-only updates), so
  // the ID may be absent here. Accept any source the caller provided and
  // leave `__itemTypeId` unset when none is available — the property is
  // declared optional, so consumers already handle the `undefined` case.
  const itemTypeId =
    body.__itemTypeId ??
    body.item_type?.id ??
    data.relationships?.item_type?.data?.id;

  if (itemTypeId === undefined) return data;

  return {
    ...data,
    __itemTypeId: itemTypeId,
  } as NewBlockInRequest<NoInfer<D>>;
}
