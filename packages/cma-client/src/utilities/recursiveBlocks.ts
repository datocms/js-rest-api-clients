import {
  type BlockItemInARequest,
  isItemWithOptionalIdAndMeta,
} from '../fieldTypes';
import type * as ApiTypes from '../generated/ApiTypes';
import {
  nonRecursiveFilterBlocksInNonLocalizedFieldValueAsync,
  nonRecursiveFindAllBlocksInNonLocalizedFieldValueAsync,
  nonRecursiveMapBlocksInNonLocalizedFieldValueAsync,
  nonRecursiveReduceBlocksInNonLocalizedFieldValueAsync,
  nonRecursiveSomeBlocksInNonLocalizedFieldValueAsync,
  nonRecursiveVisitBlocksInNonLocalizedFieldValueAsync,
} from './nonRecursiveBlocks';
import type { SchemaRepository } from './schemaRepository';

/**
 * Path through a non-localized field value (ie. ['content', 0, 'attributes', 'title'])
 */
export type TreePath = readonly (string | number)[];

/**
 * Recursively visit every block in a non-localized field value and all nested blocks within those blocks.
 * This function traverses not only the direct blocks in the non-localized field value but also recursively
 * visits blocks contained within the attributes of each block, creating a complete traversal
 * of the entire block hierarchy.
 *
 * @param schemaRepository - Repository for accessing DatoCMS schema information to resolve block structures
 * @param fieldType - The type of DatoCMS field definition that determines how the value is processed
 * @param nonLocalizedFieldValue - The non-localized field value containing blocks to visit
 * @param visitor - Asynchronous function called for each block found, including nested blocks
 * @returns Promise that resolves when all blocks and nested blocks have been visited
 */
export async function visitBlocksInNonLocalizedFieldValue(
  schemaRepository: SchemaRepository,
  fieldType: ApiTypes.Field['field_type'],
  nonLocalizedFieldValue: unknown,
  visitor: (item: BlockItemInARequest, path: TreePath) => void | Promise<void>,
  path: TreePath = [],
): Promise<void> {
  await nonRecursiveVisitBlocksInNonLocalizedFieldValueAsync(
    fieldType,
    nonLocalizedFieldValue,
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
        await visitBlocksInNonLocalizedFieldValue(
          schemaRepository,
          fieldType,
          block.attributes[field.attributes.api_key],
          visitor,
          [...path, ...innerPath, 'attributes', field.attributes.api_key],
        );
      }
    },
  );
}

/**
 * Recursively find all blocks that match the predicate function in a non-localized field value.
 * Searches through all direct blocks and recursively through nested blocks within
 * the attributes of each block, returning all matches found throughout the hierarchy.
 *
 * @param schemaRepository - Repository for accessing DatoCMS schema information to resolve block structures
 * @param fieldType - The type of DatoCMS field definition that determines how the value is processed
 * @param nonLocalizedFieldValue - The non-localized field value containing blocks to search
 * @param predicate - Asynchronous function that tests each block, including nested ones
 * @returns Promise that resolves to an array of objects, each containing a matching block and its full path
 */
export async function findAllBlocksInNonLocalizedFieldValue(
  schemaRepository: SchemaRepository,
  fieldType: ApiTypes.Field['field_type'],
  nonLocalizedFieldValue: unknown,
  predicate: (
    item: BlockItemInARequest,
    path: TreePath,
  ) => boolean | Promise<boolean>,
  path: TreePath = [],
): Promise<Array<{ item: BlockItemInARequest; path: TreePath }>> {
  const results: Array<{ item: BlockItemInARequest; path: TreePath }> = [];

  const directMatches =
    await nonRecursiveFindAllBlocksInNonLocalizedFieldValueAsync(
      fieldType,
      nonLocalizedFieldValue,
      async (block, innerPath) =>
        await predicate(block, [...path, ...innerPath]),
    );

  results.push(
    ...directMatches.map(({ item, path: innerPath }) => ({
      item,
      path: [...path, ...innerPath],
    })),
  );

  await nonRecursiveVisitBlocksInNonLocalizedFieldValueAsync(
    fieldType,
    nonLocalizedFieldValue,
    async (block, innerPath) => {
      if (!isItemWithOptionalIdAndMeta(block)) {
        return;
      }

      const itemType = await schemaRepository.getRawItemTypeById(
        block.relationships.item_type.data.id,
      );

      const fields = await schemaRepository.getRawItemTypeFields(itemType);

      for (const field of fields) {
        const nestedResults = await findAllBlocksInNonLocalizedFieldValue(
          schemaRepository,
          fieldType,
          block.attributes[field.attributes.api_key],
          predicate,
          [...path, ...innerPath, 'attributes', field.attributes.api_key],
        );
        results.push(...nestedResults);
      }
    },
  );

  return results;
}

/**
 * Recursively filter blocks in a non-localized field value, removing those that don't match the predicate.
 * Creates a new non-localized field value structure containing only blocks that pass the predicate test,
 * including recursive filtering of nested blocks within block attributes. The filtering
 * preserves the original non-localized field value structure and hierarchy.
 *
 * @param schemaRepository - Repository for accessing DatoCMS schema information to resolve block structures
 * @param fieldType - The type of DatoCMS field definition that determines how the value is processed
 * @param nonLocalizedFieldValue - The non-localized field value containing blocks to filter
 * @param predicate - Asynchronous function that tests each block, including nested ones
 * @returns Promise that resolves to the new non-localized field value with recursively filtered blocks
 */
export async function filterBlocksInNonLocalizedFieldValue(
  schemaRepository: SchemaRepository,
  fieldType: ApiTypes.Field['field_type'],
  nonLocalizedFieldValue: unknown,
  predicate: (
    item: BlockItemInARequest,
    path: TreePath,
  ) => boolean | Promise<boolean>,
  path: TreePath = [],
): Promise<unknown> {
  return nonRecursiveFilterBlocksInNonLocalizedFieldValueAsync(
    fieldType,
    nonLocalizedFieldValue,
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
        block.attributes[field.attributes.api_key] =
          await filterBlocksInNonLocalizedFieldValue(
            schemaRepository,
            fieldType,
            block.attributes[field.attributes.api_key],
            predicate,
            [...blockPath, 'attributes', field.attributes.api_key],
          );
      }

      return true;
    },
  );
}

/**
 * Recursively reduce all blocks in a non-localized field value to a single value by applying a reducer function.
 * Processes each direct block and recursively processes nested blocks within block attributes,
 * accumulating results from the entire block hierarchy into a single value.
 *
 * @template R - The type of the accumulated result
 * @param schemaRepository - Repository for accessing DatoCMS schema information to resolve block structures
 * @param fieldType - The type of DatoCMS field definition that determines how the value is processed
 * @param nonLocalizedFieldValue - The non-localized field value containing blocks to reduce
 * @param reducer - Asynchronous function that processes each block and updates the accumulator
 * @param initialNonLocalizedFieldValue - The initial value for the accumulator
 * @returns Promise that resolves to the final accumulated value from all blocks in the hierarchy
 */
export async function reduceBlocksInNonLocalizedFieldValue<R>(
  schemaRepository: SchemaRepository,
  fieldType: ApiTypes.Field['field_type'],
  nonLocalizedFieldValue: unknown,
  reducer: (
    accumulator: R,
    item: BlockItemInARequest,
    path: TreePath,
  ) => R | Promise<R>,
  initialValue: R,
  path: TreePath = [],
): Promise<R> {
  let accumulator = await nonRecursiveReduceBlocksInNonLocalizedFieldValueAsync(
    fieldType,
    nonLocalizedFieldValue,
    async (acc, block, innerPath) =>
      await reducer(acc, block, [...path, ...innerPath]),
    initialValue,
  );

  await nonRecursiveVisitBlocksInNonLocalizedFieldValueAsync(
    fieldType,
    nonLocalizedFieldValue,
    async (block, innerPath) => {
      if (!isItemWithOptionalIdAndMeta(block)) {
        return;
      }

      const itemType = await schemaRepository.getRawItemTypeById(
        block.relationships.item_type.data.id,
      );

      const fields = await schemaRepository.getRawItemTypeFields(itemType);

      for (const field of fields) {
        accumulator = await reduceBlocksInNonLocalizedFieldValue(
          schemaRepository,
          fieldType,
          block.attributes[field.attributes.api_key],
          reducer,
          accumulator,
          [...path, ...innerPath, 'attributes', field.attributes.api_key],
        );
      }
    },
  );

  return accumulator;
}

/**
 * Recursively check if any block in the non-localized field value matches the predicate function.
 * Tests both direct blocks and recursively tests nested blocks within block attributes.
 * Returns true as soon as the first matching block is found anywhere in the hierarchy
 * (short-circuit evaluation).
 *
 * @param schemaRepository - Repository for accessing DatoCMS schema information to resolve block structures
 * @param fieldType - The type of DatoCMS field definition that determines how the value is processed
 * @param nonLocalizedFieldValue - The non-localized field value containing blocks to test
 * @param predicate - Asynchronous function that tests each block, including nested ones
 * @returns Promise that resolves to true if any block in the hierarchy matches, false otherwise
 */
export async function someBlocksInNonLocalizedFieldValue(
  schemaRepository: SchemaRepository,
  fieldType: ApiTypes.Field['field_type'],
  nonLocalizedFieldValue: unknown,
  predicate: (
    item: BlockItemInARequest,
    path: TreePath,
  ) => boolean | Promise<boolean>,
  path: TreePath = [],
): Promise<boolean> {
  const directMatch = await nonRecursiveSomeBlocksInNonLocalizedFieldValueAsync(
    fieldType,
    nonLocalizedFieldValue,
    async (block, innerPath) => await predicate(block, [...path, ...innerPath]),
  );

  if (directMatch) {
    return true;
  }

  let found = false;
  await nonRecursiveVisitBlocksInNonLocalizedFieldValueAsync(
    fieldType,
    nonLocalizedFieldValue,
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

        const nestedMatch = await someBlocksInNonLocalizedFieldValue(
          schemaRepository,
          fieldType,
          block.attributes[field.attributes.api_key],
          predicate,
          [...path, ...innerPath, 'attributes', field.attributes.api_key],
        );

        if (nestedMatch) {
          found = true;
        }
      }
    },
  );

  return found;
}

/**
 * Recursively check if every block in the non-localized field value matches the predicate function.
 * Tests both direct blocks and recursively tests nested blocks within block attributes.
 * Returns false as soon as the first non-matching block is found anywhere in the hierarchy
 * (short-circuit evaluation).
 *
 * @param schemaRepository - Repository for accessing DatoCMS schema information to resolve block structures
 * @param fieldType - The type of DatoCMS field definition that determines how the value is processed
 * @param nonLocalizedFieldValue - The non-localized field value containing blocks to test
 * @param predicate - Asynchronous function that tests each block, including nested ones
 * @returns Promise that resolves to true if all blocks in the hierarchy match, false otherwise
 */
export async function everyBlockInNonLocalizedFieldValue(
  schemaRepository: SchemaRepository,
  fieldType: ApiTypes.Field['field_type'],
  nonLocalizedFieldValue: unknown,
  predicate: (
    item: BlockItemInARequest,
    path: TreePath,
  ) => boolean | Promise<boolean>,
  path: TreePath = [],
): Promise<boolean> {
  return !(await someBlocksInNonLocalizedFieldValue(
    schemaRepository,
    fieldType,
    nonLocalizedFieldValue,
    async (item, path) => !(await predicate(item, path)),
    path,
  ));
}

/**
 * Recursively transform blocks in a non-localized field value by applying a mapping function to each block.
 * Creates a new non-localized field value structure with transformed blocks while preserving the original
 * structure. Applies the mapping function to both direct blocks and recursively to nested
 * blocks within block attributes throughout the entire hierarchy.
 *
 * @param schemaRepository - Repository for accessing DatoCMS schema information to resolve block structures
 * @param fieldType - The type of DatoCMS field definition that determines how the value is processed
 * @param nonLocalizedFieldValue - The non-localized field value containing blocks to transform
 * @param mapper - Asynchronous function that transforms each block, including nested ones
 * @returns Promise that resolves to the new non-localized field value with recursively transformed blocks
 */
export async function mapBlocksInNonLocalizedFieldValue(
  schemaRepository: SchemaRepository,
  fieldType: ApiTypes.Field['field_type'],
  nonLocalizedFieldValue: unknown,
  mapper: (
    item: BlockItemInARequest,
    path: TreePath,
  ) => BlockItemInARequest | Promise<BlockItemInARequest>,
  path: TreePath = [],
) {
  return nonRecursiveMapBlocksInNonLocalizedFieldValueAsync(
    fieldType,
    nonLocalizedFieldValue,
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
        newBlock.attributes[field.attributes.api_key] =
          await mapBlocksInNonLocalizedFieldValue(
            schemaRepository,
            fieldType,
            newBlock.attributes[field.attributes.api_key],
            mapper,
            [...path, ...innerPath, 'attributes', field.attributes.api_key],
          );
      }

      return newBlock;
    },
  );
}
