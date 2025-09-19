import * as Utils from '@datocms/rest-client-utils';
import type {
  ItemWithOptionalIdAndMeta,
  NewBlockInARequest,
} from '../fieldTypes';
import type * as ApiTypes from '../generated/ApiTypes';
import { Item } from '../generated/resources';
import type {
  ItemTypeDefinition,
  ItemTypeDefinitionToItemDefinitionAsRequest,
} from './itemDefinition';
import { mapBlocksInFieldValues } from './recursiveBlocks';
import type { SchemaRepository } from './schemaRepository';

type NoInfer<T> = [T][T extends any ? 0 : never];

export function buildBlockRecord<
  D extends ItemTypeDefinition = ItemTypeDefinition,
>(
  body: ApiTypes.ItemUpdateSchema<
    ItemTypeDefinitionToItemDefinitionAsRequest<NoInfer<D>>
  >,
): NewBlockInARequest<ItemTypeDefinitionToItemDefinitionAsRequest<NoInfer<D>>> {
  return Utils.serializeRequestBody<{
    data: NewBlockInARequest<
      ItemTypeDefinitionToItemDefinitionAsRequest<NoInfer<D>>
    >;
  }>(body, {
    type: Item.TYPE,
    attributes: '*',
    relationships: ['item_type'],
  }).data;
}

export async function duplicateBlockRecord<
  D extends ItemTypeDefinition = ItemTypeDefinition,
>(
  existingBlock: ItemWithOptionalIdAndMeta<D>,
  schemaRepository: SchemaRepository,
): Promise<ItemWithOptionalIdAndMeta<D>> {
  const { type, attributes, relationships } = existingBlock;

  const itemType = await schemaRepository.getRawItemTypeById(
    existingBlock.relationships.item_type.data.id,
  );

  const newBlock = {
    type,
    relationships,
    attributes,
  } as NewBlockInARequest;

  const fields = await schemaRepository.getRawItemTypeFields(itemType);

  for (const field of fields) {
    newBlock.attributes[field.attributes.api_key] = mapBlocksInFieldValues(
      schemaRepository,
      field,
      newBlock.attributes[field.attributes.api_key],
      (block, path) => {
        if (typeof block === 'string') {
          throw new Error(
            `Block cannot be duplicated as it contains nested block at ${path.join('.')} that is expressed as ID (${block}) instead of full object!`,
          );
        }

        const { id, meta, ...blockWithoutIdAndMeta } = block;

        return blockWithoutIdAndMeta;
      },
      [],
    );
  }

  return newBlock as ItemWithOptionalIdAndMeta<D>;
}
