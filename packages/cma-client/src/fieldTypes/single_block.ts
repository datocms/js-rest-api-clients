import type * as SchemaTypes from '../generated/SchemaTypes';

/**
 * SINGLE BLOCK FIELD TYPE SYSTEM FOR DATOCMS
 *
 * This module defines a comprehensive type system for handling DatoCMS Single Block fields,
 * which contain a single embedded content block.
 *
 * The challenge we're solving:
 * - DatoCMS Single Block fields contain a single "block" (embedded content item)
 * - By default, API responses contain blocks as string IDs (lightweight references)
 * - With ?nested=true parameter, API responses contain blocks as full block objects
 *   (which in turn can contain other blocks)
 * - For API requests, blocks can be represented as:
 *   1. String IDs (referencing existing blocks)
 *   2. Full block objects with IDs (for updates)
 *   3. Block objects without IDs (for creation)
 *
 * This creates a need for different type variants for the same conceptual data structure.
 */

/**
 * =============================================================================
 * BASIC SINGLE BLOCK TYPE - Default API response format
 * =============================================================================
 *
 * The standard Single Block field value containing a block reference as string ID.
 * This is what you get from regular API responses without ?nested=true.
 */

/**
 * Basic Single Block field value - string block ID (lightweight reference)
 */
export type SingleBlockFieldValue = string | null;

/**
 * =============================================================================
 * REQUEST VARIANT - Type for sending data TO the DatoCMS API
 * =============================================================================
 *
 * When making API requests, we need flexibility in how we represent embedded blocks:
 * - Use string ID to reference existing block that does not need to change
 * - Include full block object for updates
 * - Omit ID for new blocks being created
 */

/**
 * Union type representing the different ways a block can be specified in API requests:
 * - string: Just the block ID (most common case)
 * - Full block object with ID (for updates)
 * - Block object without ID (for creation)
 *
 * Also, 'meta' can always be omitted
 */
export type BlockItemInARequest =
  | string
  | OptionalFields<SchemaTypes.Item, 'id' | 'meta'>;

/**
 * Single Block field value for API requests - allows flexible block representations:
 * - string: Just the block ID (most common case)
 * - SchemaTypes.Item: Full block object with ID (for updates)
 * - Omit<SchemaTypes.Item, 'id'>: Block object without ID (for creation)
 */
export type SingleBlockFieldValueAsRequest = BlockItemInARequest | null;

/**
 * =============================================================================
 * NESTED VARIANT - Type for API responses with ?nested=true parameter
 * =============================================================================
 *
 * When using the ?nested=true query parameter, the API returns Single Block data
 * with embedded block fully populated as complete SchemaTypes.Item object instead
 * of just string ID. This provides type safety for working with fully resolved data.
 */

/**
 * Single Block field value with nested block - fully populated block object
 */
export type SingleBlockFieldValueWithNestedBlocks = SchemaTypes.Item | null;

/**
 * =============================================================================
 * SHARED UTILITY FUNCTIONS
 * =============================================================================
 * These functions are used internally and can be imported by other modules
 */

/**
 * Validates if a single block item is a string ID
 */
export function isBlockStringId(block: unknown): block is string {
  return typeof block === 'string';
}

export type ItemWithOptionalIdAndMeta = OptionalFields<
  SchemaTypes.Item,
  'id' | 'meta'
>;

/**
 * Validates if a single block item is a SchemaTypes.Item object (with or without ID)
 */
export function isBlockObject(
  block: unknown,
): block is ItemWithOptionalIdAndMeta {
  return (
    typeof block === 'object' &&
    block !== null &&
    'type' in block &&
    'attributes' in block
  );
}

export type ItemWithOptionalMeta = OptionalFields<SchemaTypes.Item, 'meta'>;

/**
 * Validates if a single block item is a complete SchemaTypes.Item object with ID
 */
export function isBlockObjectWithId(
  block: unknown,
): block is ItemWithOptionalMeta {
  return isBlockObject(block) && 'id' in block && typeof block.id === 'string';
}

/**
 * =============================================================================
 * TYPE GUARDS - Runtime validation functions
 * =============================================================================
 */

/**
 * Type guard for basic Single Block field values (block as string ID only).
 * Checks for string structure and ensures block is a string reference.
 */
export function isSingleBlockFieldValue(
  value: unknown,
): value is SingleBlockFieldValue {
  return typeof value === 'string' || value === null;
}

/**
 * Type guard for Single Block field values in API request format.
 * Allows block as string ID, full object with ID, or object without ID.
 */
export function isSingleBlockFieldValueAsRequest(
  value: unknown,
): value is SingleBlockFieldValueAsRequest {
  if (value === null) return true;

  // String ID _ referencing existing block
  if (isBlockStringId(value)) return true;

  // Object (either with or without ID for updates/creation)
  return isBlockObject(value);
}

/**
 * Type guard for Single Block field values with nested blocks (?nested=true format).
 * Ensures block is a full SchemaTypes.Item object with complete data.
 */
export function isSingleBlockFieldValueWithNestedBlocks(
  value: unknown,
): value is SingleBlockFieldValueWithNestedBlocks {
  if (value === null) return true;

  // Must be a full object with ID (nested format always includes complete block objects)
  return isBlockObjectWithId(value);
}

import type { FramedSingleBlockEditorConfiguration } from './appearance/framed_single_block';
import type { FramelessSingleBlockEditorConfiguration } from './appearance/frameless_single_block';
import type { RequiredValidator } from './validators/required';
import type { SingleBlockBlocksValidator } from './validators/single_block_blocks';

export type SingleBlockFieldValidators = {
  /** Only accept references to block records of the specified block models */
  single_block_blocks: SingleBlockBlocksValidator;
  /** Value must be specified or it won't be valid */
  required?: RequiredValidator;
};

export type SingleBlockFieldAppearance =
  | {
      editor: 'framed_single_block';
      parameters: FramedSingleBlockEditorConfiguration;
    }
  | {
      editor: 'frameless_single_block';
      parameters: FramelessSingleBlockEditorConfiguration;
    }
  | {
      /** Plugin ID */
      editor: string;
      /** Plugin configuration */
      parameters: Record<string, unknown>;
    };

// UTILITIES

type OptionalFields<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;
