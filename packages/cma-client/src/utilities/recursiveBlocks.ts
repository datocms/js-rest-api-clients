import {
  isItemWithOptionalIdAndMeta, type BlockItemInARequest
} from '../fieldTypes';
import type * as ApiTypes from '../generated/ApiTypes';
import type * as RawApiTypes from '../generated/RawApiTypes';
import {
  nonRecursiveFilterBlocksInFieldValueAsync,
  nonRecursiveFindAllBlocksInFieldValueAsync,
  nonRecursiveMapBlocksInFieldValueAsync,
  nonRecursiveReduceBlocksInFieldValueAsync,
  nonRecursiveSomeBlocksInFieldValueAsync,
  nonRecursiveVisitBlocksInFieldValueAsync
} from './nonRecursiveBlocks';
import type { SchemaRepository } from './schemaRepository';

/**
 * Path through a field value (ie. ['content', 0, 'attributes', 'title'])
 */
export type TreePath = readonly (string | number)[];

export async function visitBlocksInFieldValues(
  schemaRepository: SchemaRepository,
  field: RawApiTypes.Field | ApiTypes.Field,
  value: unknown,
  visitor: (item: BlockItemInARequest, path: TreePath) => void | Promise<void>,
  path: TreePath = [],
): Promise<void> {
  await nonRecursiveVisitBlocksInFieldValueAsync(
    field,
    value,
    async (block, innerPath) => {
      await visitor(block, [...path, ...innerPath]);

      if (!isItemWithOptionalIdAndMeta(block)) {
        return;
      }

      const itemType = await schemaRepository.getRawItemTypeById(
        block.relationships.item_type.data.id,
      );

      const fields = await schemaRepository.getRawItemTypeFields(itemType);

      for (const field of fields) {
        await visitBlocksInFieldValues(
          schemaRepository,
          field,
          block.attributes[field.attributes.api_key],
          visitor,
          [
            ...path,
            ...innerPath,
            'attributes',
            field.attributes.api_key,
          ],
        );
      }
    },
  );
}

export async function findAllBlocksInFieldValues(
  schemaRepository: SchemaRepository,
  field: RawApiTypes.Field | ApiTypes.Field,
  value: unknown,
  predicate: (
    item: BlockItemInARequest,
    path: TreePath,
  ) => boolean | Promise<boolean>,
  path: TreePath = [],
): Promise<Array<{ item: BlockItemInARequest; path: TreePath }>> {
  const results: Array<{ item: BlockItemInARequest; path: TreePath }> = [];

  const directMatches = await nonRecursiveFindAllBlocksInFieldValueAsync(
    field,
    value,
    async (block, innerPath) => await predicate(block, [...path, ...innerPath]),
  );

  results.push(
    ...directMatches.map(({ item, path: innerPath }) => ({
      item,
      path: [...path, ...innerPath],
    })),
  );

  await nonRecursiveVisitBlocksInFieldValueAsync(
    field,
    value,
    async (block, innerPath) => {
      if (!isItemWithOptionalIdAndMeta(block)) {
        return;
      }

      const itemType = await schemaRepository.getRawItemTypeById(
        block.relationships.item_type.data.id,
      );

      const fields = await schemaRepository.getRawItemTypeFields(itemType);

      for (const field of fields) {
        const nestedResults = await findAllBlocksInFieldValues(
          schemaRepository,
          field,
          block.attributes[field.attributes.api_key],
          predicate,
          [
            ...path,
            ...innerPath,
            'attributes',
            field.attributes.api_key,
          ],
        );
        results.push(...nestedResults);
      }
    },
  );

  return results;
}

export async function filterBlocksInFieldValues(
  schemaRepository: SchemaRepository,
  field: RawApiTypes.Field | ApiTypes.Field,
  value: unknown,
  predicate: (
    item: BlockItemInARequest,
    path: TreePath,
  ) => boolean | Promise<boolean>,
  path: TreePath = [],
): Promise<unknown> {
  return nonRecursiveFilterBlocksInFieldValueAsync(
    field,
    value,
    async (block, innerPath) => {
      const blockPath = [...path, ...innerPath];
      const passes = await predicate(block, blockPath);

      if (!passes) {
        return false;
      }

      if (!isItemWithOptionalIdAndMeta(block)) {
        return true;
      }

      const itemType = await schemaRepository.getRawItemTypeById(
        block.relationships.item_type.data.id,
      );

      const fields = await schemaRepository.getRawItemTypeFields(itemType);

      for (const field of fields) {
        block.attributes[field.attributes.api_key] = await filterBlocksInFieldValues(
          schemaRepository,
          field,
          block.attributes[field.attributes.api_key],
          predicate,
          [
            ...blockPath,
            'attributes',
            field.attributes.api_key,
          ],
        );
      }

      return true;
    },
  );
}

export async function reduceBlocksInFieldValues<R>(
  schemaRepository: SchemaRepository,
  field: RawApiTypes.Field | ApiTypes.Field,
  value: unknown,
  reducer: (
    accumulator: R,
    item: BlockItemInARequest,
    path: TreePath,
  ) => R | Promise<R>,
  initialValue: R,
  path: TreePath = [],
): Promise<R> {
  let accumulator = await nonRecursiveReduceBlocksInFieldValueAsync(
    field,
    value,
    async (acc, block, innerPath) =>
      await reducer(acc, block, [...path, ...innerPath]),
    initialValue,
  );

  await nonRecursiveVisitBlocksInFieldValueAsync(
    field,
    value,
    async (block, innerPath) => {
      if (!isItemWithOptionalIdAndMeta(block)) {
        return;
      }

      const itemType = await schemaRepository.getRawItemTypeById(
        block.relationships.item_type.data.id,
      );

      const fields = await schemaRepository.getRawItemTypeFields(itemType);

      for (const field of fields) {
        accumulator = await reduceBlocksInFieldValues(
          schemaRepository,
          field,
          block.attributes[field.attributes.api_key],
          reducer,
          accumulator,
          [
            ...path,
            ...innerPath,
            'attributes',
            field.attributes.api_key,
          ],
        );
      }
    },
  );

  return accumulator;
}

export async function someBlocksInFieldValues(
  schemaRepository: SchemaRepository,
  field: RawApiTypes.Field | ApiTypes.Field,
  value: unknown,
  predicate: (
    item: BlockItemInARequest,
    path: TreePath,
  ) => boolean | Promise<boolean>,
  path: TreePath = [],
): Promise<boolean> {
  const directMatch = await nonRecursiveSomeBlocksInFieldValueAsync(
    field,
    value,
    async (block, innerPath) => await predicate(block, [...path, ...innerPath]),
  );

  if (directMatch) {
    return true;
  }

  let found = false;
  await nonRecursiveVisitBlocksInFieldValueAsync(
    field,
    value,
    async (block, innerPath) => {
      if (found || !isItemWithOptionalIdAndMeta(block)) {
        return;
      }

      const itemType = await schemaRepository.getRawItemTypeById(
        block.relationships.item_type.data.id,
      );

      const fields = await schemaRepository.getRawItemTypeFields(itemType);

      for (const field of fields) {
        if (found) break;

        const nestedMatch = await someBlocksInFieldValues(
          schemaRepository,
          field,
          block.attributes[field.attributes.api_key],
          predicate,
          [
            ...path,
            ...innerPath,
            'attributes',
            field.attributes.api_key,
          ],
        );

        if (nestedMatch) {
          found = true;
        }
      }
    },
  );

  return found;
}

export async function everyBlockInFieldValues(
  schemaRepository: SchemaRepository,
  field: RawApiTypes.Field | ApiTypes.Field,
  value: unknown,
  predicate: (
    item: BlockItemInARequest,
    path: TreePath,
  ) => boolean | Promise<boolean>,
  path: TreePath = [],
): Promise<boolean> {
  return !(await someBlocksInFieldValues(
    schemaRepository,
    field,
    value,
    async (item, path) => !(await predicate(item, path)),
    path,
  ));
}

export async function mapBlocksInFieldValues(
  schemaRepository: SchemaRepository,
  field: RawApiTypes.Field | ApiTypes.Field,
  value: unknown,
  mapper: (
    item: BlockItemInARequest,
    path: TreePath,
  ) => BlockItemInARequest | Promise<BlockItemInARequest>,
  path: TreePath = [],
) {
  return nonRecursiveMapBlocksInFieldValueAsync(
    field,
    value,
    async (block, innerPath) => {
      const newBlock = await mapper(block, [...path, ...innerPath]);

      if (!isItemWithOptionalIdAndMeta(newBlock)) {
        return newBlock;
      }

      const itemType = await schemaRepository.getRawItemTypeById(
        newBlock.relationships.item_type.data.id,
      );

      const fields = await schemaRepository.getRawItemTypeFields(itemType);

      for (const field of fields) {
        newBlock.attributes[field.attributes.api_key] = await mapBlocksInFieldValues(
          schemaRepository,
          field,
          newBlock.attributes[field.attributes.api_key],
          mapper,
          [
            ...path,
            ...innerPath,
            'attributes',
            field.attributes.api_key,
          ],
        );
      }

      return newBlock;
    },
  );
}
