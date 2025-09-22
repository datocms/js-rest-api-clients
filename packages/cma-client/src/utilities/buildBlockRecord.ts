import * as Utils from '@datocms/rest-client-utils';
import type {
  ItemWithOptionalIdAndMeta,
  NewBlockInARequest,
} from '../fieldTypes';
import type * as ApiTypes from '../generated/ApiTypes';
import { Item } from '../generated/resources';
import type {
  ItemTypeDefinition,
  ToItemDefinitionAsRequest,
  ToItemDefinitionWithNestedBlocks,
} from './itemDefinition';
import { mapBlocksInNonLocalizedFieldValue } from './recursiveBlocks';
import type { SchemaRepository } from './schemaRepository';

type NoInfer<T> = [T][T extends any ? 0 : never];

export function buildBlockRecord<
  D extends ItemTypeDefinition = ItemTypeDefinition,
>(
  body: ApiTypes.ItemUpdateSchema<ToItemDefinitionAsRequest<NoInfer<D>>>,
): NewBlockInARequest<ToItemDefinitionAsRequest<NoInfer<D>>> {
  return Utils.serializeRequestBody<{
    data: NewBlockInARequest<ToItemDefinitionAsRequest<NoInfer<D>>>;
  }>(body, {
    type: Item.TYPE,
    attributes: '*',
    relationships: ['item_type'],
  }).data;
}

export async function duplicateBlockRecord<
  D extends ItemTypeDefinition = ItemTypeDefinition,
>(
  existingBlock: ItemWithOptionalIdAndMeta<
    ToItemDefinitionWithNestedBlocks<NoInfer<D>>
  >,
  schemaRepository: SchemaRepository,
): Promise<NewBlockInARequest<ToItemDefinitionAsRequest<NoInfer<D>>>> {
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
    newBlock.attributes[field.attributes.api_key] =
      mapBlocksInNonLocalizedFieldValue(
        schemaRepository,
        field.attributes.field_type,
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
      );
  }

  return newBlock as NewBlockInARequest<ToItemDefinitionAsRequest<NoInfer<D>>>;
}
