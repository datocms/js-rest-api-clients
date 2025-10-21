import type * as RawApiTypes from '../generated/RawApiTypes';
import { isValidId } from '../utilities/id';
import type {
  ItemTypeDefinition,
  ToItemAttributesInRequest,
} from '../utilities/itemDefinition';
import {
  type LocalizedFieldValue,
  isLocalizedFieldValue,
} from '../utilities/normalizedFieldValues';

import type { FramedSingleBlockEditorConfiguration } from './appearance/framed_single_block';
import type { FramelessSingleBlockEditorConfiguration } from './appearance/frameless_single_block';
import type { RequiredValidator } from './validators/required';
import type { SingleBlockBlocksValidator } from './validators/single_block_blocks';

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

/** Represents an existing block in a CMA request */
export type UnchangedBlockInRequest = RawApiTypes.ItemIdentity;

/** Represents a block we want to update in a CMA request */
export type UpdatedBlockInRequest<
  D extends ItemTypeDefinition = ItemTypeDefinition,
> = {
  __itemTypeId?: D['itemTypeId'];
  type: RawApiTypes.ItemType1;
  id: RawApiTypes.ItemIdentity;
  relationships: RawApiTypes.ItemRelationships<D>;
  meta?: RawApiTypes.ItemMeta;
  attributes: ToItemAttributesInRequest<D>;
};

/** Represents a new block to create in a CMA request */
export type NewBlockInRequest<
  D extends ItemTypeDefinition = ItemTypeDefinition,
> = {
  __itemTypeId?: D['itemTypeId'];
  type: RawApiTypes.ItemType1;
  relationships: RawApiTypes.ItemRelationships<D>;
  meta?: RawApiTypes.ItemMeta;
  attributes: ToItemAttributesInRequest<D>;
};

/**
 * Union type representing the different ways a block can be specified in API requests:
 * - string: Just the block ID (to keep existing blocks unchanged)
 * - Full block object with ID (to update an existing block)
 * - Block object without ID (to create a new block)
 *
 * Also, 'meta' can always be omitted
 */
export type BlockInRequest<D extends ItemTypeDefinition = ItemTypeDefinition> =
  | UnchangedBlockInRequest
  | UpdatedBlockInRequest<D>
  | NewBlockInRequest<D>;

export type BlockInNestedResponse<
  D extends ItemTypeDefinition = ItemTypeDefinition,
> = D extends unknown ? RawApiTypes.ItemInNestedResponse<D> : never;

/**
 * Single Block field value for API requests - allows flexible block representations:
 * - string: Just the block ID (to keep existing blocks unchanged)
 * - Full block object with ID (to update an existing block)
 * - Block object without ID (to create a new block)
 */
export type SingleBlockFieldValueInRequest<
  D extends ItemTypeDefinition = ItemTypeDefinition,
> = BlockInRequest<D> | null;

/**
 * =============================================================================
 * NESTED VARIANT - Type for API responses with ?nested=true parameter
 * =============================================================================
 *
 * When using the ?nested=true query parameter, the API returns Single Block data
 * with embedded block fully populated as complete RawApiTypes.Item object instead
 * of just string ID. This provides type safety for working with fully resolved data.
 */

/**
 * Single Block field value with nested block - fully populated block object
 */
export type SingleBlockFieldValueInNestedResponse<
  D extends ItemTypeDefinition = ItemTypeDefinition,
> = BlockInNestedResponse<D> | null;

/**
 * =============================================================================
 * SHARED UTILITY FUNCTIONS
 * =============================================================================
 * These functions are used internally and can be imported by other modules
 */

/**
 * Validates if the input is a valid item (either block or record) ID
 */
export function isItemId(input: unknown): input is string {
  return typeof input === 'string';
}

export type ItemWithOptionalIdAndMeta<
  D extends ItemTypeDefinition = ItemTypeDefinition,
> = D extends any ? OptionalFields<RawApiTypes.Item<D>, 'id' | 'meta'> : never;

/**
 * Validates if the input is a RawApiTypes.Item object (with optional `id` and `meta`)
 */
export function isItemWithOptionalIdAndMeta<
  D extends ItemTypeDefinition = ItemTypeDefinition,
>(block: unknown): block is ItemWithOptionalIdAndMeta<D> {
  return (
    typeof block === 'object' &&
    block !== null &&
    'type' in block &&
    block.type === 'item' &&
    'attributes' in block &&
    'relationships' in block
  );
}

export type ItemWithOptionalMeta<
  D extends ItemTypeDefinition = ItemTypeDefinition,
> = D extends any ? OptionalFields<RawApiTypes.Item<D>, 'meta'> : never;

/**
 * Validates if the input is a a complete RawApiTypes.Item object with optional `meta`
 */
export function isItemWithOptionalMeta<
  D extends ItemTypeDefinition = ItemTypeDefinition,
>(block: unknown): block is ItemWithOptionalMeta<D> {
  return (
    isItemWithOptionalIdAndMeta(block) &&
    'id' in block &&
    typeof block.id === 'string'
  );
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
  return (typeof value === 'string' && isValidId(value)) || value === null;
}

export function isLocalizedSingleBlockFieldValue(
  value: unknown,
): value is LocalizedFieldValue<SingleBlockFieldValue> {
  return (
    isLocalizedFieldValue(value) &&
    Object.values(value).every(isSingleBlockFieldValue)
  );
}

/**
 * Type guard for Single Block field values in API request format.
 * Allows block as string ID, full object with ID, or object without ID.
 */
export function isSingleBlockFieldValueInRequest<
  D extends ItemTypeDefinition = ItemTypeDefinition,
>(value: unknown): value is SingleBlockFieldValueInRequest<D> {
  if (value === null) return true;

  // String ID - referencing existing block
  if (isItemId(value)) return true;

  // Object (either with or without ID for updates/creation)
  return isItemWithOptionalIdAndMeta(value);
}

export function isLocalizedSingleBlockFieldValueInRequest<
  D extends ItemTypeDefinition = ItemTypeDefinition,
>(
  value: unknown,
): value is LocalizedFieldValue<SingleBlockFieldValueInRequest<D>> {
  return (
    isLocalizedFieldValue(value) &&
    Object.values(value).every(isSingleBlockFieldValueInRequest)
  );
}

/**
 * Type guard for Single Block field values with nested blocks (?nested=true format).
 * Ensures block is a full RawApiTypes.Item object with complete data.
 */
export function isSingleBlockFieldValueInNestedResponse<
  D extends ItemTypeDefinition = ItemTypeDefinition,
>(value: unknown): value is SingleBlockFieldValueInNestedResponse<D> {
  if (value === null) return true;

  // Must be a full object with ID (nested format always includes complete block objects)
  return isItemWithOptionalMeta(value);
}

export function isLocalizedSingleBlockFieldValueInNestedResponse<
  D extends ItemTypeDefinition = ItemTypeDefinition,
>(
  value: unknown,
): value is LocalizedFieldValue<SingleBlockFieldValueInNestedResponse<D>> {
  return (
    isLocalizedFieldValue(value) &&
    Object.values(value).every(isSingleBlockFieldValueInNestedResponse)
  );
}

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
