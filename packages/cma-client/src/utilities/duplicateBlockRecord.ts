import type {
  ItemWithOptionalIdAndMeta,
  NewBlockInRequest,
} from '../fieldTypes';
import type { ItemTypeDefinition } from './itemDefinition';
import { mapBlocksInNonLocalizedFieldValue } from './recursiveBlocks';
import type { SchemaRepository } from './schemaRepository';

type NoInfer<T> = [T][T extends any ? 0 : never];

export async function duplicateBlockRecord<
  D extends ItemTypeDefinition = ItemTypeDefinition,
>(
  existingBlock: ItemWithOptionalIdAndMeta<NoInfer<D>>,
  schemaRepository: SchemaRepository,
): Promise<NewBlockInRequest<NoInfer<D>>> {
  const { __itemTypeId, type, attributes, relationships } = existingBlock;

  const itemType = await schemaRepository.getRawItemTypeById(
    existingBlock.relationships.item_type.data.id,
  );

  const newBlock = {
    __itemTypeId,
    type,
    relationships,
    attributes,
  } as NewBlockInRequest;

  const fields = await schemaRepository.getRawItemTypeFields(itemType);

  for (const field of fields) {
    newBlock.attributes[field.attributes.api_key] =
      await mapBlocksInNonLocalizedFieldValue(
        newBlock.attributes[field.attributes.api_key],
        field.attributes.field_type,
        schemaRepository,
        (block, path) => {
          if (typeof block === 'string') {
            throw new Error(
              `Block cannot be duplicated as it contains nested block at ${path.join('.')} that is expressed as ID (${block}) instead of full object!`,
            );
          }

          if ('id' in block) {
            const { id, meta, ...blockWithoutIdAndMeta } = block;

            return blockWithoutIdAndMeta as NewBlockInRequest;
          }

          const { meta, ...blockWithoutMeta } = block;
          return blockWithoutMeta as NewBlockInRequest;
        },
      );
  }

  return newBlock as NewBlockInRequest<NoInfer<D>>;
}
