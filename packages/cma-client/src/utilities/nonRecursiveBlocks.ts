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

import {
  type TreePath,
  collectNodesAsync,
  filterNodesAsync,
  mapNodes,
  mapNodesAsync,
} from 'datocms-structured-text-utils';
import type {
  BlockInRequest,
  RichTextFieldValue,
  RichTextFieldValueInNestedResponse,
  RichTextFieldValueInRequest,
  SingleBlockFieldValue,
  SingleBlockFieldValueInNestedResponse,
  SingleBlockFieldValueInRequest,
  StructuredTextFieldValue,
  StructuredTextFieldValueInNestedResponse,
  StructuredTextFieldValueInRequest,
} from '../fieldTypes';
import type * as ApiTypes from '../generated/ApiTypes';

type PossibleRichTextValue =
  | RichTextFieldValue
  | RichTextFieldValueInRequest
  | RichTextFieldValueInNestedResponse;
type PossibleSingleBlockValue =
  | SingleBlockFieldValue
  | SingleBlockFieldValueInRequest
  | SingleBlockFieldValueInNestedResponse;
type PossibleStructuredTextValue =
  | StructuredTextFieldValue
  | StructuredTextFieldValueInRequest
  | StructuredTextFieldValueInNestedResponse;

async function* iterateBlocksAsync(
  fieldType: ApiTypes.Field['field_type'],
  nonLocalizedFieldValue: unknown,
): AsyncGenerator<{ item: BlockInRequest; path: TreePath }> {
  if (fieldType === 'rich_text') {
    const richTextValue = nonLocalizedFieldValue as PossibleRichTextValue;
    if (richTextValue) {
      for (let index = 0; index < richTextValue.length; index++) {
        const item = richTextValue[index]!;
        yield { item, path: [index] };
      }
    }
    return;
  }

  if (fieldType === 'single_block') {
    const singleBlockValue = nonLocalizedFieldValue as PossibleSingleBlockValue;
    if (singleBlockValue) {
      yield { item: singleBlockValue, path: [] };
    }
    return;
  }

  if (fieldType === 'structured_text') {
    const structuredTextValue =
      nonLocalizedFieldValue as PossibleStructuredTextValue;
    if (structuredTextValue) {
      const foundNodes = await collectNodesAsync(
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
 * @param fieldType - The type of DatoCMS field definition that determines how the value is processed
 * @param nonLocalizedFieldValue - The non-localized field value containing blocks to visit
 * @param visitor - Asynchronous function called for each block. Receives the block item and its path
 * @returns Promise that resolves when all blocks have been visited
 */
export async function nonRecursiveVisitBlocksInNonLocalizedFieldValueAsync(
  fieldType: ApiTypes.Field['field_type'],
  nonLocalizedFieldValue: unknown,
  visitor: (item: BlockInRequest, path: TreePath) => Promise<void>,
): Promise<void> {
  for await (const { item, path } of iterateBlocksAsync(
    fieldType,
    nonLocalizedFieldValue,
  )) {
    await visitor(item, path);
  }
}

/**
 * Transform blocks in a field value by applying a mapping function to each block.
 * Creates a new field value structure with transformed blocks while preserving the original structure.
 * Supports rich text, single block, and structured text field types.
 *
 * @param fieldType - The type of DatoCMS field definition that determines how the value is processed
 * @param nonLocalizedFieldValue - The non-localized field value containing blocks to transform
 * @param mapper - Synchronous function that transforms each block. Receives block item and path, returns new block
 * @returns The new field value with transformed blocks
 */
export function nonRecursiveMapBlocksInNonLocalizedFieldValue(
  fieldType: ApiTypes.Field['field_type'],
  nonLocalizedFieldValue: unknown,
  mapper: (item: BlockInRequest, path: TreePath) => BlockInRequest,
): unknown {
  if (fieldType === 'rich_text') {
    const richTextValue = nonLocalizedFieldValue as PossibleRichTextValue;
    return richTextValue
      ? richTextValue.map((item, index) => mapper(item, [index]))
      : richTextValue;
  }

  if (fieldType === 'single_block') {
    const singleBlockValue = nonLocalizedFieldValue as PossibleSingleBlockValue;
    return singleBlockValue ? mapper(singleBlockValue, []) : null;
  }

  if (fieldType === 'structured_text') {
    const structuredTextValue =
      nonLocalizedFieldValue as PossibleStructuredTextValue;

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

  return nonLocalizedFieldValue;
}

/**
 * Transform blocks in a field value by applying a mapping function to each block.
 * Creates a new field value structure with transformed blocks while preserving the original structure.
 * Supports rich text, single block, and structured text field types.
 *
 * @param fieldType - The type of DatoCMS field definition that determines how the value is processed
 * @param nonLocalizedFieldValue - The non-localized field value containing blocks to transform
 * @param mapper - Asynchronous function that transforms each block. Receives block item and path, returns new block
 * @returns Promise that resolves to the new field value with transformed blocks
 */
export async function nonRecursiveMapBlocksInNonLocalizedFieldValueAsync(
  fieldType: ApiTypes.Field['field_type'],
  nonLocalizedFieldValue: unknown,
  mapper: (item: BlockInRequest, path: TreePath) => Promise<BlockInRequest>,
): Promise<unknown> {
  if (fieldType === 'rich_text') {
    const richTextValue = nonLocalizedFieldValue as PossibleRichTextValue;
    return richTextValue
      ? await Promise.all(
          richTextValue.map((item, index) => mapper(item, [index])),
        )
      : richTextValue;
  }

  if (fieldType === 'single_block') {
    const singleBlockValue = nonLocalizedFieldValue as PossibleSingleBlockValue;
    return singleBlockValue ? await mapper(singleBlockValue, []) : null;
  }

  if (fieldType === 'structured_text') {
    const structuredTextValue =
      nonLocalizedFieldValue as PossibleStructuredTextValue;

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

  return nonLocalizedFieldValue;
}

/**
 * Find all blocks that match the predicate function.
 * Searches through all blocks in the non-localized field value and returns all matches.
 *
 * @param fieldType - The type of DatoCMS field definition that determines how the value is processed
 * @param nonLocalizedFieldValue - The non-localized field value containing blocks to search
 * @param predicate - Asynchronous function that tests each block. Should return true for matching blocks
 * @returns Promise that resolves to an array of objects, each containing a matching block and its path
 */
export async function nonRecursiveFindAllBlocksInNonLocalizedFieldValueAsync(
  fieldType: ApiTypes.Field['field_type'],
  nonLocalizedFieldValue: unknown,
  predicate: (item: BlockInRequest, path: TreePath) => Promise<boolean>,
): Promise<Array<{ item: BlockInRequest; path: TreePath }>> {
  const results: Array<{ item: BlockInRequest; path: TreePath }> = [];

  for await (const { item, path } of iterateBlocksAsync(
    fieldType,
    nonLocalizedFieldValue,
  )) {
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
 * @param fieldType - The type of DatoCMS field definition that determines how the value is processed
 * @param nonLocalizedFieldValue - The non-localized field value containing blocks to filter
 * @param predicate - Asynchronous function that tests each block. Blocks returning false are removed
 * @returns Promise that resolves to the new field value with filtered blocks
 */
export async function nonRecursiveFilterBlocksInNonLocalizedFieldValueAsync(
  fieldType: ApiTypes.Field['field_type'],
  nonLocalizedFieldValue: unknown,
  predicate: (item: BlockInRequest, path: TreePath) => Promise<boolean>,
): Promise<unknown> {
  if (fieldType === 'rich_text') {
    const filteredItems: BlockInRequest[] = [];

    for await (const { item, path } of iterateBlocksAsync(
      fieldType,
      nonLocalizedFieldValue,
    )) {
      if (await predicate(item, path)) {
        filteredItems.push(item);
      }
    }

    return filteredItems;
  }

  if (fieldType === 'single_block') {
    for await (const { item, path } of iterateBlocksAsync(
      fieldType,
      nonLocalizedFieldValue,
    )) {
      if (await predicate(item, path)) {
        return item;
      }
    }
    return null;
  }

  if (fieldType === 'structured_text') {
    const structuredTextValue =
      nonLocalizedFieldValue as PossibleStructuredTextValue;

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

  return nonLocalizedFieldValue;
}

/**
 * Reduce all blocks in a field value to a single value by applying a reducer function.
 * Processes each block in the non-localized field value and accumulates the results into a single value.
 *
 * @template R - The type of the accumulated result
 * @param fieldType - The type of DatoCMS field definition that determines how the value is processed
 * @param nonLocalizedFieldValue - The non-localized field value containing blocks to reduce
 * @param reducer - Asynchronous function that processes each block and updates the accumulator
 * @param initialValue - The initial value for the accumulator
 * @returns Promise that resolves to the final accumulated value
 */
export async function nonRecursiveReduceBlocksInNonLocalizedFieldValueAsync<R>(
  fieldType: ApiTypes.Field['field_type'],
  nonLocalizedFieldValue: unknown,
  reducer: (accumulator: R, item: BlockInRequest, path: TreePath) => Promise<R>,
  initialValue: R,
): Promise<R> {
  let accumulator = initialValue;

  for await (const { item, path } of iterateBlocksAsync(
    fieldType,
    nonLocalizedFieldValue,
  )) {
    accumulator = await reducer(accumulator, item, path);
  }

  return accumulator;
}

/**
 * Check if any block in the non-localized field value matches the predicate function.
 * Returns true as soon as the first matching block is found (short-circuit evaluation).
 *
 * @param fieldType - The type of DatoCMS field definition that determines how the value is processed
 * @param nonLocalizedFieldValue - The non-localized field value containing blocks to test
 * @param predicate - Asynchronous function that tests each block. Should return true for matching blocks
 * @returns Promise that resolves to true if any block matches, false otherwise
 */
export async function nonRecursiveSomeBlocksInNonLocalizedFieldValueAsync(
  fieldType: ApiTypes.Field['field_type'],
  nonLocalizedFieldValue: unknown,
  predicate: (item: BlockInRequest, path: TreePath) => Promise<boolean>,
): Promise<boolean> {
  for await (const { item, path } of iterateBlocksAsync(
    fieldType,
    nonLocalizedFieldValue,
  )) {
    if (await predicate(item, path)) {
      return true;
    }
  }

  return false;
}

/**
 * Check if every block in the non-localized field value matches the predicate function.
 * Returns false as soon as the first non-matching block is found (short-circuit evaluation).
 *
 * @param fieldType - The type of DatoCMS field definition that determines how the value is processed
 * @param nonLocalizedFieldValue - The non-localized field value containing blocks to test
 * @param predicate - Asynchronous function that tests each block. Should return true for valid blocks
 * @returns Promise that resolves to true if all blocks match, false otherwise
 */
export async function nonRecursiveEveryBlockInNonLocalizedFieldValueAsync(
  fieldType: ApiTypes.Field['field_type'],
  nonLocalizedFieldValue: unknown,
  predicate: (item: BlockInRequest, path: TreePath) => Promise<boolean>,
): Promise<boolean> {
  return !(await nonRecursiveSomeBlocksInNonLocalizedFieldValueAsync(
    fieldType,
    nonLocalizedFieldValue,
    async (item, path) => {
      return !(await predicate(item, path));
    },
  ));
}
