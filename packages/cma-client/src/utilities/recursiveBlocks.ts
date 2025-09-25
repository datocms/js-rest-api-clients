import {
  type BlockInRequest,
  type RichTextFieldValue,
  type RichTextFieldValueInNestedResponse,
  type RichTextFieldValueInRequest,
  type SingleBlockFieldValue,
  type SingleBlockFieldValueInNestedResponse,
  type SingleBlockFieldValueInRequest,
  type StructuredTextFieldValue,
  type StructuredTextFieldValueInNestedResponse,
  type StructuredTextFieldValueInRequest,
  isItemWithOptionalIdAndMeta,
} from '../fieldTypes';
import type * as ApiTypes from '../generated/ApiTypes';
import type { ExtractNestedBlocksFromFieldValue } from './itemDefinition';
import {
  nonRecursiveFilterBlocksInNonLocalizedFieldValueAsync,
  nonRecursiveFindAllBlocksInNonLocalizedFieldValueAsync,
  nonRecursiveMapBlocksInNonLocalizedFieldValueAsync,
  nonRecursiveReduceBlocksInNonLocalizedFieldValueAsync,
  nonRecursiveSomeBlocksInNonLocalizedFieldValueAsync,
  nonRecursiveVisitBlocksInNonLocalizedFieldValueAsync,
} from './nonRecursiveBlocks';
import type { SchemaRepository } from './schemaRepository';

type RecognizableFieldValue =
  | RichTextFieldValueInNestedResponse
  | SingleBlockFieldValueInNestedResponse
  | StructuredTextFieldValueInNestedResponse
  | RichTextFieldValueInRequest
  | SingleBlockFieldValueInRequest
  | StructuredTextFieldValueInRequest
  | RichTextFieldValue
  | SingleBlockFieldValue
  | StructuredTextFieldValue;

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
 * @param nonLocalizedFieldValue - The non-localized field value containing blocks to visit
 * @param fieldType - The type field (determines how the value is processed)
 * @param schemaRepository - Repository for accessing DatoCMS schema information (to resolve block structures)
 * @param visitor - Asynchronous function called for each block found, including nested blocks
 * @returns Promise that resolves when all blocks and nested blocks have been visited
 */
export async function visitBlocksInNonLocalizedFieldValue<
  T extends RecognizableFieldValue,
>(
  nonLocalizedFieldValue: T,
  fieldType: ApiTypes.Field['field_type'],
  schemaRepository: SchemaRepository,
  visitor: (
    item: ExtractNestedBlocksFromFieldValue<T>,
    path: TreePath,
  ) => void | Promise<void>,
  path?: TreePath,
): Promise<void>;
export async function visitBlocksInNonLocalizedFieldValue(
  nonLocalizedFieldValue: unknown,
  fieldType: ApiTypes.Field['field_type'],
  schemaRepository: SchemaRepository,
  visitor: (item: BlockInRequest, path: TreePath) => void | Promise<void>,
  path?: TreePath,
): Promise<void>;
export async function visitBlocksInNonLocalizedFieldValue(
  nonLocalizedFieldValue: unknown,
  fieldType: ApiTypes.Field['field_type'],
  schemaRepository: SchemaRepository,
  visitor: (item: BlockInRequest, path: TreePath) => void | Promise<void>,
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
          block.attributes[field.attributes.api_key],
          field.attributes.field_type,
          schemaRepository,
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
 * @param nonLocalizedFieldValue - The non-localized field value containing blocks to search
 * @param fieldType - The type field (determines how the value is processed)
 * @param schemaRepository - Repository for accessing DatoCMS schema information (to resolve block structures)
 * @param predicate - Asynchronous function that tests each block, including nested ones
 * @returns Promise that resolves to an array of objects, each containing a matching block and its full path
 */
export async function findAllBlocksInNonLocalizedFieldValue<
  T extends RecognizableFieldValue,
>(
  nonLocalizedFieldValue: T,
  fieldType: ApiTypes.Field['field_type'],
  schemaRepository: SchemaRepository,
  predicate: (
    item: ExtractNestedBlocksFromFieldValue<T>,
    path: TreePath,
  ) => boolean | Promise<boolean>,
  path?: TreePath,
): Promise<
  Array<{ item: ExtractNestedBlocksFromFieldValue<T>; path: TreePath }>
>;
export async function findAllBlocksInNonLocalizedFieldValue(
  nonLocalizedFieldValue: unknown,
  fieldType: ApiTypes.Field['field_type'],
  schemaRepository: SchemaRepository,
  predicate: (
    item: BlockInRequest,
    path: TreePath,
  ) => boolean | Promise<boolean>,
  path?: TreePath,
): Promise<Array<{ item: BlockInRequest; path: TreePath }>>;
export async function findAllBlocksInNonLocalizedFieldValue(
  nonLocalizedFieldValue: unknown,
  fieldType: ApiTypes.Field['field_type'],
  schemaRepository: SchemaRepository,
  predicate: (
    item: BlockInRequest,
    path: TreePath,
  ) => boolean | Promise<boolean>,
  path: TreePath = [],
): Promise<Array<{ item: BlockInRequest; path: TreePath }>> {
  const results: Array<{ item: BlockInRequest; path: TreePath }> = [];

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
          block.attributes[field.attributes.api_key],
          field.attributes.field_type,
          schemaRepository,
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
 * @param nonLocalizedFieldValue - The non-localized field value containing blocks to filter
 * @param fieldType - The type field (determines how the value is processed)
 * @param schemaRepository - Repository for accessing DatoCMS schema information (to resolve block structures)
 * @param predicate - Asynchronous function that tests each block, including nested ones
 * @param options - Optional configuration object
 * @param options.traversalDirection - Direction of traversal: 'top-down' (default) applies predicate before processing children, 'bottom-up' processes children first
 * @returns Promise that resolves to the new non-localized field value with recursively filtered blocks
 */
export async function filterBlocksInNonLocalizedFieldValue<
  T extends RecognizableFieldValue,
>(
  nonLocalizedFieldValue: T,
  fieldType: ApiTypes.Field['field_type'],
  schemaRepository: SchemaRepository,
  predicate: (
    item: ExtractNestedBlocksFromFieldValue<T>,
    path: TreePath,
  ) => boolean | Promise<boolean>,
  options?: { traversalDirection?: TraversalDirection },
  path?: TreePath,
): Promise<T>;
export async function filterBlocksInNonLocalizedFieldValue(
  nonLocalizedFieldValue: unknown,
  fieldType: ApiTypes.Field['field_type'],
  schemaRepository: SchemaRepository,
  predicate: (
    item: BlockInRequest,
    path: TreePath,
  ) => boolean | Promise<boolean>,
  options?: { traversalDirection?: TraversalDirection },
  path?: TreePath,
): Promise<unknown>;
export async function filterBlocksInNonLocalizedFieldValue(
  nonLocalizedFieldValue: unknown,
  fieldType: ApiTypes.Field['field_type'],
  schemaRepository: SchemaRepository,
  predicate: (
    item: BlockInRequest,
    path: TreePath,
  ) => boolean | Promise<boolean>,
  options: { traversalDirection?: TraversalDirection } = {},
  path: TreePath = [],
): Promise<unknown> {
  const { traversalDirection = 'top-down' } = options;

  const mapperFunc = async (block: BlockInRequest, innerPath: TreePath) => {
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
            blockCopy.attributes[field.attributes.api_key],
            field.attributes.field_type,
            schemaRepository,

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
          blockCopy.attributes[field.attributes.api_key],
          field.attributes.field_type,
          schemaRepository,
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
 * @param nonLocalizedFieldValue - The non-localized field value containing blocks to reduce
 * @param fieldType - The type field (determines how the value is processed)
 * @param schemaRepository - Repository for accessing DatoCMS schema information (to resolve block structures)
 * @param reducer - Asynchronous function that processes each block and updates the accumulator
 * @param initialNonLocalizedFieldValue - The initial value for the accumulator
 * @returns Promise that resolves to the final accumulated value from all blocks in the hierarchy
 */
export async function reduceBlocksInNonLocalizedFieldValue<T, R>(
  nonLocalizedFieldValue: T,
  fieldType: ApiTypes.Field['field_type'],
  schemaRepository: SchemaRepository,
  reducer: (
    accumulator: R,
    item: ExtractNestedBlocksFromFieldValue<T>,
    path: TreePath,
  ) => R | Promise<R>,
  initialValue: R,
  path?: TreePath,
): Promise<R>;
export async function reduceBlocksInNonLocalizedFieldValue<R>(
  nonLocalizedFieldValue: unknown,
  fieldType: ApiTypes.Field['field_type'],
  schemaRepository: SchemaRepository,
  reducer: (
    accumulator: R,
    item: BlockInRequest,
    path: TreePath,
  ) => R | Promise<R>,
  initialValue: R,
  path?: TreePath,
): Promise<R>;
export async function reduceBlocksInNonLocalizedFieldValue<R>(
  nonLocalizedFieldValue: unknown,
  fieldType: ApiTypes.Field['field_type'],
  schemaRepository: SchemaRepository,
  reducer: (
    accumulator: R,
    item: BlockInRequest,
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
          block.attributes[field.attributes.api_key],
          field.attributes.field_type,
          schemaRepository,
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
 * @param nonLocalizedFieldValue - The non-localized field value containing blocks to test
 * @param fieldType - The type field (determines how the value is processed)
 * @param schemaRepository - Repository for accessing DatoCMS schema information (to resolve block structures)
 * @param predicate - Asynchronous function that tests each block, including nested ones
 * @returns Promise that resolves to true if any block in the hierarchy matches, false otherwise
 */
export async function someBlocksInNonLocalizedFieldValue<
  T extends RecognizableFieldValue,
>(
  nonLocalizedFieldValue: T,
  fieldType: ApiTypes.Field['field_type'],
  schemaRepository: SchemaRepository,
  predicate: (
    item: ExtractNestedBlocksFromFieldValue<T>,
    path: TreePath,
  ) => boolean | Promise<boolean>,
  path?: TreePath,
): Promise<boolean>;
export async function someBlocksInNonLocalizedFieldValue(
  nonLocalizedFieldValue: unknown,
  fieldType: ApiTypes.Field['field_type'],
  schemaRepository: SchemaRepository,
  predicate: (
    item: BlockInRequest,
    path: TreePath,
  ) => boolean | Promise<boolean>,
  path?: TreePath,
): Promise<boolean>;
export async function someBlocksInNonLocalizedFieldValue(
  nonLocalizedFieldValue: unknown,
  fieldType: ApiTypes.Field['field_type'],
  schemaRepository: SchemaRepository,
  predicate: (
    item: BlockInRequest,
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
          block.attributes[field.attributes.api_key],
          field.attributes.field_type,
          schemaRepository,
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
 * @param nonLocalizedFieldValue - The non-localized field value containing blocks to test
 * @param fieldType - The type field (determines how the value is processed)
 * @param schemaRepository - Repository for accessing DatoCMS schema information (to resolve block structures)
 * @param predicate - Asynchronous function that tests each block, including nested ones
 * @returns Promise that resolves to true if all blocks in the hierarchy match, false otherwise
 */
export async function everyBlockInNonLocalizedFieldValue<
  T extends RecognizableFieldValue,
>(
  nonLocalizedFieldValue: T,
  fieldType: ApiTypes.Field['field_type'],
  schemaRepository: SchemaRepository,
  predicate: (
    item: ExtractNestedBlocksFromFieldValue<T>,
    path: TreePath,
  ) => boolean | Promise<boolean>,
  path?: TreePath,
): Promise<boolean>;
export async function everyBlockInNonLocalizedFieldValue(
  nonLocalizedFieldValue: unknown,
  fieldType: ApiTypes.Field['field_type'],
  schemaRepository: SchemaRepository,
  predicate: (
    item: BlockInRequest,
    path: TreePath,
  ) => boolean | Promise<boolean>,
  path?: TreePath,
): Promise<boolean>;
export async function everyBlockInNonLocalizedFieldValue(
  nonLocalizedFieldValue: unknown,
  fieldType: ApiTypes.Field['field_type'],
  schemaRepository: SchemaRepository,
  predicate: (
    item: BlockInRequest,
    path: TreePath,
  ) => boolean | Promise<boolean>,
  path: TreePath = [],
): Promise<boolean> {
  return !(await someBlocksInNonLocalizedFieldValue(
    nonLocalizedFieldValue,
    fieldType,
    schemaRepository,
    async (item, path) => !(await predicate(item, path)),
    path,
  ));
}

// Converts fields
// RichTextFieldValueInNestedResponse<Block1>
// into their as-request variant
// RichTextFieldValueInRequest<Block1>
type FieldValueInRequest<T> = T extends RichTextFieldValueInNestedResponse<
  infer D
>
  ? RichTextFieldValueInRequest<D>
  : T extends SingleBlockFieldValueInNestedResponse<infer D>
    ? SingleBlockFieldValueInRequest<D>
    : T extends StructuredTextFieldValueInNestedResponse<infer DB, infer DI>
      ? StructuredTextFieldValueInRequest<DB, DI>
      : T extends StructuredTextFieldValueInNestedResponse<infer DB>
        ? StructuredTextFieldValueInRequest<DB>
        : T;

/**
 * Recursively transform blocks in a non-localized field value by applying a mapping function to each block.
 * Creates a new non-localized field value structure with transformed blocks while preserving the original
 * structure. Applies the mapping function to both direct blocks and recursively to nested
 * blocks within block attributes throughout the entire hierarchy.
 *
 * @param nonLocalizedFieldValue - The non-localized field value containing blocks to transform
 * @param fieldType - The type field (determines how the value is processed)
 * @param schemaRepository - Repository for accessing DatoCMS schema information (to resolve block structures)
 * @param mapper - Asynchronous function that transforms each block, including nested ones
 * @param options - Optional configuration object
 * @param options.traversalDirection - Direction of traversal: 'top-down' (default) applies mapper before processing children, 'bottom-up' processes children first
 * @returns Promise that resolves to the new non-localized field value with recursively transformed blocks
 */
export async function mapBlocksInNonLocalizedFieldValue<
  T extends RecognizableFieldValue,
>(
  nonLocalizedFieldValue: T,
  fieldType: ApiTypes.Field['field_type'],
  schemaRepository: SchemaRepository,
  mapper: (
    item: ExtractNestedBlocksFromFieldValue<T>,
    path: TreePath,
  ) => BlockInRequest | Promise<BlockInRequest>,
  options?: { traversalDirection?: TraversalDirection },
  path?: TreePath,
): Promise<FieldValueInRequest<T>>;
export async function mapBlocksInNonLocalizedFieldValue(
  nonLocalizedFieldValue: unknown,
  fieldType: ApiTypes.Field['field_type'],
  schemaRepository: SchemaRepository,
  mapper: (
    item: BlockInRequest,
    path: TreePath,
  ) => BlockInRequest | Promise<BlockInRequest>,
  options?: { traversalDirection?: TraversalDirection },
  path?: TreePath,
): Promise<unknown>;
export async function mapBlocksInNonLocalizedFieldValue(
  nonLocalizedFieldValue: unknown,
  fieldType: ApiTypes.Field['field_type'],
  schemaRepository: SchemaRepository,
  mapper: (
    item: BlockInRequest,
    path: TreePath,
  ) => BlockInRequest | Promise<BlockInRequest>,
  options: { traversalDirection?: TraversalDirection } = {},
  path: TreePath = [],
): Promise<unknown> {
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
              newBlock.attributes[field.attributes.api_key],
              field.attributes.field_type,
              schemaRepository,
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
            blockCopy.attributes[field.attributes.api_key],
            field.attributes.field_type,
            schemaRepository,

            mapper,
            options,
            [...blockPath, 'attributes', field.attributes.api_key],
          );
      }

      return await mapper(blockCopy, blockPath);
    },
  );
}
