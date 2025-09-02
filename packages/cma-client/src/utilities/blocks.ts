/**
 * DatoCMS Block Field Value Processing Utilities
 *
 * This utility provides a unified interface for working with blocks embedded within DatoCMS field values.
 * DatoCMS supports three field types that can contain blocks:
 * - Modular Content fields: arrays of blocks
 * - Single Block fields: a single block
 * - Structured Text fields: complex document structures with embedded blocks
 *
 * The challenge this solves: Each field type stores blocks differently and requires different
 * traversal logic, making it complex to perform operations like transformations, filtering,
 * or searching across blocks regardless of their containing field type.
 *
 * This utility abstracts away these differences, providing a consistent API to:
 * - Visit/iterate through all blocks in any field type
 * - Transform blocks while preserving field structure
 * - Filter blocks based on conditions
 * - Search for specific blocks
 * - Perform functional operations (map, reduce, some, every)
 *
 * All functions come in both sync and async variants to support different use cases,
 * particularly useful when block transformations require async operations like API calls.
 */

import type {
  BlockItemInARequest,
  RichTextFieldValue,
  RichTextFieldValueAsRequest,
  RichTextFieldValueWithResolvedBlocks,
  SingleBlockFieldValue,
  SingleBlockFieldValueAsRequest,
  SingleBlockFieldValueWithResolvedBlocks,
  StructuredTextFieldValue,
  StructuredTextFieldValueAsRequest,
  StructuredTextFieldValueWithResolvedBlocks,
} from '../fieldTypes';
import type * as SchemaTypes from '../generated/SchemaTypes';
import type * as SimpleSchemaTypes from '../generated/SimpleSchemaTypes';
import {
  type TreePath,
  filterNodes,
  filterNodesAsync,
  findAllNodes,
  findAllNodesAsync,
  mapNodes,
  mapNodesAsync,
} from './structuredText';

type PossibleRichTextValue =
  | RichTextFieldValue
  | RichTextFieldValueAsRequest
  | RichTextFieldValueWithResolvedBlocks;
type PossibleSingleBlockValue =
  | SingleBlockFieldValue
  | SingleBlockFieldValueAsRequest
  | SingleBlockFieldValueWithResolvedBlocks;
type PossibleStructuredTextValue =
  | StructuredTextFieldValue
  | StructuredTextFieldValueAsRequest
  | StructuredTextFieldValueWithResolvedBlocks;

function getFieldType(field: SchemaTypes.Field | SimpleSchemaTypes.Field) {
  return 'attributes' in field ? field.attributes.field_type : field.field_type;
}

function* iterateBlocks(
  field: SchemaTypes.Field | SimpleSchemaTypes.Field,
  value: unknown,
): Generator<{ item: BlockItemInARequest; path: TreePath }> {
  const fieldType = getFieldType(field);

  if (fieldType === 'rich_text') {
    const richTextValue = value as PossibleRichTextValue;
    if (richTextValue) {
      for (let index = 0; index < richTextValue.length; index++) {
        const item = richTextValue[index]!;
        yield { item, path: [index] };
      }
    }
    return;
  }

  if (fieldType === 'single_block') {
    const singleBlockValue = value as PossibleSingleBlockValue;
    if (singleBlockValue) {
      yield { item: singleBlockValue, path: [] };
    }
    return;
  }

  if (fieldType === 'structured_text') {
    const structuredTextValue = value as PossibleStructuredTextValue;
    if (structuredTextValue) {
      const foundNodes = findAllNodes(
        structuredTextValue.document,
        (node) => node.type === 'block' || node.type === 'inlineBlock',
      );

      for (const { node, path } of foundNodes) {
        if (node.type === 'block' || node.type === 'inlineBlock') {
          yield { item: node.item, path };
        }
      }
    }
    return;
  }
}

async function* iterateBlocksAsync(
  field: SchemaTypes.Field | SimpleSchemaTypes.Field,
  value: unknown,
): AsyncGenerator<{ item: BlockItemInARequest; path: TreePath }> {
  const fieldType = getFieldType(field);

  if (fieldType === 'rich_text') {
    const richTextValue = value as PossibleRichTextValue;
    if (richTextValue) {
      for (let index = 0; index < richTextValue.length; index++) {
        const item = richTextValue[index]!;
        yield { item, path: [index] };
      }
    }
    return;
  }

  if (fieldType === 'single_block') {
    const singleBlockValue = value as PossibleSingleBlockValue;
    if (singleBlockValue) {
      yield { item: singleBlockValue, path: [] };
    }
    return;
  }

  if (fieldType === 'structured_text') {
    const structuredTextValue = value as PossibleStructuredTextValue;
    if (structuredTextValue) {
      const foundNodes = await findAllNodesAsync(
        structuredTextValue.document,
        async (node) => node.type === 'block' || node.type === 'inlineBlock',
      );

      for (const { node, path } of foundNodes) {
        if (node.type === 'block' || node.type === 'inlineBlock') {
          yield { item: node.item, path };
        }
      }
    }
    return;
  }
}

/**
 * Visit every block in a field value, calling the visitor function for each block found.
 * Supports rich text, single block, and structured text field types.
 *
 * @param field - The DatoCMS field definition that determines how blocks are processed
 * @param value - The field value containing blocks to visit
 * @param visitor - Synchronous function called for each block. Receives the block item and its path
 */
export function nonRecursiveVisitBlocksInFieldValue(
  field: SchemaTypes.Field | SimpleSchemaTypes.Field,
  value: unknown,
  visitor: (item: BlockItemInARequest, path: TreePath) => void,
): void {
  for (const { item, path } of iterateBlocks(field, value)) {
    visitor(item, path);
  }
}

/**
 * Visit every block in a field value, calling the visitor function for each block found.
 * Supports rich text, single block, and structured text field types.
 *
 * @param field - The DatoCMS field definition that determines how blocks are processed
 * @param value - The field value containing blocks to visit
 * @param visitor - Asynchronous function called for each block. Receives the block item and its path
 * @returns Promise that resolves when all blocks have been visited
 */
export async function nonRecursiveVisitBlocksInFieldValueAsync(
  field: SchemaTypes.Field | SimpleSchemaTypes.Field,
  value: unknown,
  visitor: (item: BlockItemInARequest, path: TreePath) => Promise<void>,
): Promise<void> {
  for await (const { item, path } of iterateBlocksAsync(field, value)) {
    await visitor(item, path);
  }
}

/**
 * Transform blocks in a field value by applying a mapping function to each block.
 * Creates a new field value structure with transformed blocks while preserving the original structure.
 * Supports rich text, single block, and structured text field types.
 *
 * @param field - The DatoCMS field definition that determines how blocks are processed
 * @param value - The field value containing blocks to transform
 * @param mapper - Synchronous function that transforms each block. Receives block item and path, returns new block
 * @returns The new field value with transformed blocks
 */
export function nonRecursiveMapBlocksInFieldValue(
  field: SchemaTypes.Field | SimpleSchemaTypes.Field,
  value: unknown,
  mapper: (item: BlockItemInARequest, path: TreePath) => BlockItemInARequest,
): unknown {
  const fieldType = getFieldType(field);

  if (fieldType === 'rich_text') {
    const richTextValue = value as PossibleRichTextValue;
    return richTextValue
      ? richTextValue.map((item, index) => mapper(item, [index]))
      : richTextValue;
  }

  if (fieldType === 'single_block') {
    const singleBlockValue = value as PossibleSingleBlockValue;
    return singleBlockValue ? mapper(singleBlockValue, []) : null;
  }

  if (fieldType === 'structured_text') {
    const structuredTextValue = value as PossibleStructuredTextValue;

    if (!structuredTextValue) {
      return null;
    }

    return {
      schema: 'dast',
      document: mapNodes(
        structuredTextValue.document,
        (node, _parent, path) => {
          if (node.type === 'block' || node.type === 'inlineBlock') {
            return { ...node, item: mapper(node.item, path) };
          }

          return node;
        },
      ),
    };
  }

  return value;
}

/**
 * Transform blocks in a field value by applying a mapping function to each block.
 * Creates a new field value structure with transformed blocks while preserving the original structure.
 * Supports rich text, single block, and structured text field types.
 *
 * @param field - The DatoCMS field definition that determines how blocks are processed
 * @param value - The field value containing blocks to transform
 * @param mapper - Asynchronous function that transforms each block. Receives block item and path, returns new block
 * @returns Promise that resolves to the new field value with transformed blocks
 */
export async function nonRecursiveMapBlocksInFieldValueAsync(
  field: SchemaTypes.Field | SimpleSchemaTypes.Field,
  value: unknown,
  mapper: (
    item: BlockItemInARequest,
    path: TreePath,
  ) => Promise<BlockItemInARequest>,
): Promise<unknown> {
  const fieldType = getFieldType(field);

  if (fieldType === 'rich_text') {
    const richTextValue = value as PossibleRichTextValue;
    return richTextValue
      ? await Promise.all(
          richTextValue.map((item, index) => mapper(item, [index])),
        )
      : richTextValue;
  }

  if (fieldType === 'single_block') {
    const singleBlockValue = value as PossibleSingleBlockValue;
    return singleBlockValue ? await mapper(singleBlockValue, []) : null;
  }

  if (fieldType === 'structured_text') {
    const structuredTextValue = value as PossibleStructuredTextValue;

    if (!structuredTextValue) {
      return null;
    }

    return {
      schema: 'dast',
      document: await mapNodesAsync(
        structuredTextValue.document,
        async (node, _parent, path) => {
          if (node.type === 'block' || node.type === 'inlineBlock') {
            return { ...node, item: await mapper(node.item, path) };
          }

          return node;
        },
      ),
    };
  }

  return value;
}

/**
 * Find all blocks that match the predicate function.
 * Searches through all blocks in the field value and returns all matches.
 *
 * @param field - The DatoCMS field definition that determines how blocks are processed
 * @param value - The field value containing blocks to search
 * @param predicate - Synchronous function that tests each block. Should return true for matching blocks
 * @returns Array of objects, each containing a matching block and its path
 */
export function nonRecursiveFindAllBlocksInFieldValue(
  field: SchemaTypes.Field | SimpleSchemaTypes.Field,
  value: unknown,
  predicate: (item: BlockItemInARequest, path: TreePath) => boolean,
): Array<{ item: BlockItemInARequest; path: TreePath }> {
  const results: Array<{ item: BlockItemInARequest; path: TreePath }> = [];

  for (const { item, path } of iterateBlocks(field, value)) {
    if (predicate(item, path)) {
      results.push({ item, path });
    }
  }

  return results;
}

/**
 * Find all blocks that match the predicate function.
 * Searches through all blocks in the field value and returns all matches.
 *
 * @param field - The DatoCMS field definition that determines how blocks are processed
 * @param value - The field value containing blocks to search
 * @param predicate - Asynchronous function that tests each block. Should return true for matching blocks
 * @returns Promise that resolves to an array of objects, each containing a matching block and its path
 */
export async function nonRecursiveFindAllBlocksInFieldValueAsync(
  field: SchemaTypes.Field | SimpleSchemaTypes.Field,
  value: unknown,
  predicate: (item: BlockItemInARequest, path: TreePath) => Promise<boolean>,
): Promise<Array<{ item: BlockItemInARequest; path: TreePath }>> {
  const results: Array<{ item: BlockItemInARequest; path: TreePath }> = [];

  for await (const { item, path } of iterateBlocksAsync(field, value)) {
    if (await predicate(item, path)) {
      results.push({ item, path });
    }
  }

  return results;
}

/**
 * Filter blocks in a field value, removing those that don't match the predicate.
 * Creates a new field value containing only blocks that pass the predicate test.
 * Preserves the original field value structure and hierarchy.
 *
 * @param field - The DatoCMS field definition that determines how blocks are processed
 * @param value - The field value containing blocks to filter
 * @param predicate - Synchronous function that tests each block. Blocks returning false are removed
 * @returns The new field value with filtered blocks
 */
export function nonRecursiveFilterBlocksInFieldValue(
  field: SchemaTypes.Field | SimpleSchemaTypes.Field,
  value: unknown,
  predicate: (item: BlockItemInARequest, path: TreePath) => boolean,
): unknown {
  const fieldType = getFieldType(field);

  if (fieldType === 'rich_text') {
    const filteredItems: BlockItemInARequest[] = [];

    for (const { item, path } of iterateBlocks(field, value)) {
      if (predicate(item, path)) {
        filteredItems.push(item);
      }
    }

    return value ? filteredItems : value;
  }

  if (fieldType === 'single_block') {
    for (const { item, path } of iterateBlocks(field, value)) {
      if (predicate(item, path)) {
        return item;
      }
    }
    return null;
  }

  if (fieldType === 'structured_text') {
    const structuredTextValue = value as PossibleStructuredTextValue;

    if (!structuredTextValue) {
      return null;
    }

    const filteredDocument = filterNodes(
      structuredTextValue.document,
      (node, _parent, path) => {
        if (node.type === 'block' || node.type === 'inlineBlock') {
          return predicate(node.item, path);
        }
        return true;
      },
    );

    return filteredDocument
      ? {
          schema: 'dast',
          document: filteredDocument,
        }
      : null;
  }

  return value;
}

/**
 * Filter blocks in a field value, removing those that don't match the predicate.
 * Creates a new field value containing only blocks that pass the predicate test.
 * Preserves the original field value structure and hierarchy.
 *
 * @param field - The DatoCMS field definition that determines how blocks are processed
 * @param value - The field value containing blocks to filter
 * @param predicate - Asynchronous function that tests each block. Blocks returning false are removed
 * @returns Promise that resolves to the new field value with filtered blocks
 */
export async function nonRecursiveFilterBlocksInFieldValueAsync(
  field: SchemaTypes.Field | SimpleSchemaTypes.Field,
  value: unknown,
  predicate: (item: BlockItemInARequest, path: TreePath) => Promise<boolean>,
): Promise<unknown> {
  const fieldType = getFieldType(field);

  if (fieldType === 'rich_text') {
    const filteredItems: BlockItemInARequest[] = [];

    for await (const { item, path } of iterateBlocksAsync(field, value)) {
      if (await predicate(item, path)) {
        filteredItems.push(item);
      }
    }

    return value ? filteredItems : value;
  }

  if (fieldType === 'single_block') {
    for await (const { item, path } of iterateBlocksAsync(field, value)) {
      if (await predicate(item, path)) {
        return item;
      }
    }
    return null;
  }

  if (fieldType === 'structured_text') {
    const structuredTextValue = value as PossibleStructuredTextValue;

    if (!structuredTextValue) {
      return null;
    }

    const filteredDocument = await filterNodesAsync(
      structuredTextValue.document,
      async (node, _parent, path) => {
        if (node.type === 'block' || node.type === 'inlineBlock') {
          return await predicate(node.item, path);
        }
        return true;
      },
    );

    return filteredDocument
      ? {
          schema: 'dast',
          document: filteredDocument,
        }
      : null;
  }

  return value;
}

/**
 * Reduce all blocks in a field value to a single value by applying a reducer function.
 * Processes each block in the field value and accumulates the results into a single value.
 *
 * @template R - The type of the accumulated result
 * @param field - The DatoCMS field definition that determines how blocks are processed
 * @param value - The field value containing blocks to reduce
 * @param reducer - Synchronous function that processes each block and updates the accumulator
 * @param initialValue - The initial value for the accumulator
 * @returns The final accumulated value
 */
export function nonRecursiveReduceBlocksInFieldValue<R>(
  field: SchemaTypes.Field | SimpleSchemaTypes.Field,
  value: unknown,
  reducer: (accumulator: R, item: BlockItemInARequest, path: TreePath) => R,
  initialValue: R,
): R {
  let accumulator = initialValue;

  for (const { item, path } of iterateBlocks(field, value)) {
    accumulator = reducer(accumulator, item, path);
  }

  return accumulator;
}

/**
 * Reduce all blocks in a field value to a single value by applying a reducer function.
 * Processes each block in the field value and accumulates the results into a single value.
 *
 * @template R - The type of the accumulated result
 * @param field - The DatoCMS field definition that determines how blocks are processed
 * @param value - The field value containing blocks to reduce
 * @param reducer - Asynchronous function that processes each block and updates the accumulator
 * @param initialValue - The initial value for the accumulator
 * @returns Promise that resolves to the final accumulated value
 */
export async function nonRecursiveReduceBlocksInFieldValueAsync<R>(
  field: SchemaTypes.Field | SimpleSchemaTypes.Field,
  value: unknown,
  reducer: (
    accumulator: R,
    item: BlockItemInARequest,
    path: TreePath,
  ) => Promise<R>,
  initialValue: R,
): Promise<R> {
  let accumulator = initialValue;

  for await (const { item, path } of iterateBlocksAsync(field, value)) {
    accumulator = await reducer(accumulator, item, path);
  }

  return accumulator;
}

/**
 * Check if any block in the field value matches the predicate function.
 * Returns true as soon as the first matching block is found (short-circuit evaluation).
 *
 * @param field - The DatoCMS field definition that determines how blocks are processed
 * @param value - The field value containing blocks to test
 * @param predicate - Synchronous function that tests each block. Should return true for matching blocks
 * @returns True if any block matches, false otherwise
 */
export function nonRecursiveSomeBlocksInFieldValue(
  field: SchemaTypes.Field | SimpleSchemaTypes.Field,
  value: unknown,
  predicate: (item: BlockItemInARequest, path: TreePath) => boolean,
): boolean {
  for (const { item, path } of iterateBlocks(field, value)) {
    if (predicate(item, path)) {
      return true;
    }
  }

  return false;
}

/**
 * Check if any block in the field value matches the predicate function.
 * Returns true as soon as the first matching block is found (short-circuit evaluation).
 *
 * @param field - The DatoCMS field definition that determines how blocks are processed
 * @param value - The field value containing blocks to test
 * @param predicate - Asynchronous function that tests each block. Should return true for matching blocks
 * @returns Promise that resolves to true if any block matches, false otherwise
 */
export async function nonRecursiveSomeBlocksInFieldValueAsync(
  field: SchemaTypes.Field | SimpleSchemaTypes.Field,
  value: unknown,
  predicate: (item: BlockItemInARequest, path: TreePath) => Promise<boolean>,
): Promise<boolean> {
  for await (const { item, path } of iterateBlocksAsync(field, value)) {
    if (await predicate(item, path)) {
      return true;
    }
  }

  return false;
}

/**
 * Check if every block in the field value matches the predicate function.
 * Returns false as soon as the first non-matching block is found (short-circuit evaluation).
 *
 * @param field - The DatoCMS field definition that determines how blocks are processed
 * @param value - The field value containing blocks to test
 * @param predicate - Synchronous function that tests each block. Should return true for valid blocks
 * @returns True if all blocks match, false otherwise
 */
export function nonRecursiveEveryBlockInFieldValue(
  field: SchemaTypes.Field | SimpleSchemaTypes.Field,
  value: unknown,
  predicate: (item: BlockItemInARequest, path: TreePath) => boolean,
): boolean {
  return !nonRecursiveSomeBlocksInFieldValue(field, value, (item, path) => {
    return !predicate(item, path);
  });
}

/**
 * Check if every block in the field value matches the predicate function.
 * Returns false as soon as the first non-matching block is found (short-circuit evaluation).
 *
 * @param field - The DatoCMS field definition that determines how blocks are processed
 * @param value - The field value containing blocks to test
 * @param predicate - Asynchronous function that tests each block. Should return true for valid blocks
 * @returns Promise that resolves to true if all blocks match, false otherwise
 */
export async function nonRecursiveEveryBlockInFieldValueAsync(
  field: SchemaTypes.Field | SimpleSchemaTypes.Field,
  value: unknown,
  predicate: (item: BlockItemInARequest, path: TreePath) => Promise<boolean>,
): Promise<boolean> {
  return !(await nonRecursiveSomeBlocksInFieldValueAsync(
    field,
    value,
    async (item, path) => {
      return !(await predicate(item, path));
    },
  ));
}
