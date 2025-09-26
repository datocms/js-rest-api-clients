import { isValidId } from '../utilities/id';
import type { ItemTypeDefinition } from '../utilities/itemDefinition';
import {
  type LocalizedFieldValue,
  isLocalizedFieldValue,
} from '../utilities/normalizedFieldValues';
import type { RichTextEditorConfiguration } from './appearance/rich_text';
import {
  type BlockInNestedResponse,
  type BlockInRequest,
  isItemId,
  isItemWithOptionalIdAndMeta,
  isItemWithOptionalMeta,
} from './single_block';
import type { RichTextBlocksValidator } from './validators/rich_text_blocks';
import type { SizeValidator } from './validators/size';

/**
 * MODULAR CONTENT FIELD TYPE SYSTEM FOR DATOCMS
 *
 * This module defines a comprehensive type system for handling DatoCMS Modular Content fields,
 * which are arrays of embedded content blocks.
 *
 * The challenge we're solving:
 * - DatoCMS Modular Content fields contain arrays of "blocks" (embedded content items)
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
 * BASIC MODULAR CONTENT TYPE - Default API response format
 * =============================================================================
 *
 * The standard Modular Content field value containing block references as string IDs.
 * This is what you get from regular API responses without ?nested=true.
 */

/**
 * Basic Modular Content field value - array of string block IDs (lightweight references)
 */
export type RichTextFieldValue = string[];

/**
 * =============================================================================
 * REQUEST VARIANT - Type for sending data TO the DatoCMS API
 * =============================================================================
 *
 * When making API requests, we need flexibility in how we represent embedded blocks:
 * - Use string IDs to reference existing blocks that do not need to change
 * - Include full block objects for updates
 * - Omit IDs for new blocks being created
 */

/**
 * Modular Content field value for API requests - allows flexible block representations:
 * - string: Just the block ID (most common case)
 * - RawApiTypes.Item: Full block object with ID (for updates)
 * - Omit<RawApiTypes.Item, 'id'>: Block object without ID (for creation)
 */
export type RichTextFieldValueInRequest<
  D extends ItemTypeDefinition = ItemTypeDefinition,
> = BlockInRequest<D>[] | null;

/**
 * =============================================================================
 * NESTED VARIANT - Type for API responses with ?nested=true parameter
 * =============================================================================
 *
 * When using the ?nested=true query parameter, the API returns Modular Content data
 * with embedded blocks fully populated as complete RawApiTypes.Item objects instead
 * of just string IDs. This provides type safety for working with fully resolved data.
 */

/**
 * Modular Content field value with nested blocks - array of fully populated block objects
 */
export type RichTextFieldValueInNestedResponse<
  D extends ItemTypeDefinition = ItemTypeDefinition,
> = BlockInNestedResponse<D>[];

/**
 * =============================================================================
 * TYPE GUARDS - Runtime validation functions
 * =============================================================================
 */

/**
 * Type guard for basic Modular Content field values (blocks as string IDs only).
 * Checks for array structure and ensures all blocks are string references.
 */
export function isRichTextFieldValue(
  value: unknown,
): value is RichTextFieldValue {
  return (
    Array.isArray(value) &&
    value.every((block) => typeof block === 'string' && isValidId(block))
  );
}

export function isLocalizedRichTextFieldValue(
  value: unknown,
): value is LocalizedFieldValue<RichTextFieldValue> {
  return (
    isLocalizedFieldValue(value) &&
    Object.values(value).every(isRichTextFieldValue)
  );
}

/**
 * Type guard for Modular Content field values in API request format.
 * Allows blocks as string IDs, full objects with IDs, or objects without IDs.
 */
export function isRichTextFieldValueInRequest<
  D extends ItemTypeDefinition = ItemTypeDefinition,
>(value: unknown): value is RichTextFieldValueInRequest<D> {
  if (value === null) return true;

  if (!Array.isArray(value)) return false;

  return value.every((block) => {
    // String ID - referencing existing block
    if (isItemId(block)) return true;

    // Object (either with or without ID for updates/creation)
    return isItemWithOptionalIdAndMeta(block);
  });
}

export function isLocalizedRichTextFieldValueInRequest<
  D extends ItemTypeDefinition = ItemTypeDefinition,
>(
  value: unknown,
): value is LocalizedFieldValue<RichTextFieldValueInRequest<D>> {
  return (
    isLocalizedFieldValue(value) &&
    Object.values(value).every(isRichTextFieldValueInRequest)
  );
}

/**
 * Type guard for Modular Content field values with nested blocks (?nested=true format).
 * Ensures all blocks are full RawApiTypes.Item objects with complete data.
 */
export function isRichTextFieldValueInNestedResponse<
  D extends ItemTypeDefinition = ItemTypeDefinition,
>(value: unknown): value is RichTextFieldValueInNestedResponse<D> {
  if (!Array.isArray(value)) return false;

  return value.every((block) => {
    // Must be a full object with ID (nested format always includes complete block objects)
    return isItemWithOptionalMeta(block);
  });
}

export function isLocalizedRichTextFieldValueInNestedResponse<
  D extends ItemTypeDefinition = ItemTypeDefinition,
>(
  value: unknown,
): value is LocalizedFieldValue<RichTextFieldValueInNestedResponse<D>> {
  return (
    isLocalizedFieldValue(value) &&
    Object.values(value).every(isRichTextFieldValueInNestedResponse)
  );
}

export type RichTextFieldValidators = {
  /** Only accept references to block records of the specified block models */
  rich_text_blocks: RichTextBlocksValidator;
  /** Only accept a number of items within the specified range */
  size?: SizeValidator;
};

export type RichTextFieldAppearance =
  | { editor: 'rich_text'; parameters: RichTextEditorConfiguration }
  | {
      /** Plugin ID */
      editor: string;
      /** Plugin configuration */
      parameters: Record<string, unknown>;
    };
