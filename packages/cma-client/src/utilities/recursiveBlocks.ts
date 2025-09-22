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
 * Traversal direction for recursive operations
 */
export type TraversalDirection = 'top-down' | 'bottom-up';

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
          field.attributes.field_type,
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
          field.attributes.field_type,
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
 * @param options - Optional configuration object
 * @param options.traversalDirection - Direction of traversal: 'top-down' (default) applies predicate before processing children, 'bottom-up' processes children first
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
  options: { traversalDirection?: TraversalDirection } = {},
  path: TreePath = [],
): Promise<unknown> {
  const { traversalDirection = 'top-down' } = options;

  const mapperFunc = async (
    block: BlockItemInARequest,
    innerPath: TreePath,
  ) => {
    const blockPath = [...path, ...innerPath];

    if (!isItemWithOptionalIdAndMeta(block)) {
      return block;
    }

    const itemType = await schemaRepository.getRawItemTypeById(
      block.relationships.item_type.data.id,
    );

    const fields = await schemaRepository.getRawItemTypeFields(itemType);

    if (traversalDirection === 'top-down') {
      const blockCopy = { ...block, attributes: { ...block.attributes } };

      for (const field of fields) {
        blockCopy.attributes[field.attributes.api_key] =
          await filterBlocksInNonLocalizedFieldValue(
            schemaRepository,
            field.attributes.field_type,
            blockCopy.attributes[field.attributes.api_key],
            predicate,
            options,
            [...blockPath, 'attributes', field.attributes.api_key],
          );
      }

      return blockCopy;
    }

    const blockCopy = { ...block, attributes: { ...block.attributes } };

    for (const field of fields) {
      blockCopy.attributes[field.attributes.api_key] =
        await filterBlocksInNonLocalizedFieldValue(
          schemaRepository,
          field.attributes.field_type,
          blockCopy.attributes[field.attributes.api_key],
          predicate,
          options,
          [...blockPath, 'attributes', field.attributes.api_key],
        );
    }

    return blockCopy;
  };

  const mappedValue = await nonRecursiveMapBlocksInNonLocalizedFieldValueAsync(
    fieldType,
    nonLocalizedFieldValue,
    mapperFunc,
  );

  return nonRecursiveFilterBlocksInNonLocalizedFieldValueAsync(
    fieldType,
    mappedValue,
    async (block, innerPath) => {
      const blockPath = [...path, ...innerPath];
      return await predicate(block, blockPath);
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
          field.attributes.field_type,
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
          field.attributes.field_type,
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
 * @param options - Optional configuration object
 * @param options.traversalDirection - Direction of traversal: 'top-down' (default) applies mapper before processing children, 'bottom-up' processes children first
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
  options: { traversalDirection?: TraversalDirection } = {},
  path: TreePath = [],
) {
  const { traversalDirection = 'top-down' } = options;

  return nonRecursiveMapBlocksInNonLocalizedFieldValueAsync(
    fieldType,
    nonLocalizedFieldValue,
    async (block, innerPath) => {
      const blockPath = [...path, ...innerPath];

      if (!isItemWithOptionalIdAndMeta(block)) {
        return await mapper(block, blockPath);
      }

      const itemType = await schemaRepository.getRawItemTypeById(
        block.relationships.item_type.data.id,
      );

      const fields = await schemaRepository.getRawItemTypeFields(itemType);

      if (traversalDirection === 'top-down') {
        const newBlock = await mapper(block, blockPath);

        if (!isItemWithOptionalIdAndMeta(newBlock)) {
          return newBlock;
        }

        for (const field of fields) {
          newBlock.attributes[field.attributes.api_key] =
            await mapBlocksInNonLocalizedFieldValue(
              schemaRepository,
              field.attributes.field_type,
              newBlock.attributes[field.attributes.api_key],
              mapper,
              options,
              [...blockPath, 'attributes', field.attributes.api_key],
            );
        }

        return newBlock;
      }

      const blockCopy = { ...block };

      for (const field of fields) {
        blockCopy.attributes[field.attributes.api_key] =
          await mapBlocksInNonLocalizedFieldValue(
            schemaRepository,
            field.attributes.field_type,
            blockCopy.attributes[field.attributes.api_key],
            mapper,
            options,
            [...blockPath, 'attributes', field.attributes.api_key],
          );
      }

      return await mapper(blockCopy, blockPath);
    },
  );
}
