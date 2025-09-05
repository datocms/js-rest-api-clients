import {
  type Block,
  type Document,
  type InlineBlock,
  type Node,
  everyNode,
  isBlock,
  isDocument,
  isInlineBlock,
} from 'datocms-structured-text-utils';
import type * as RawApiTypes from '../generated/RawApiTypes';
import type { StructuredTextEditorConfiguration } from './appearance/structured_text';
import {
  type BlockItemInARequest,
  isItemId,
  isItemWithOptionalIdAndMeta,
  isItemWithOptionalMeta,
} from './single_block';
import type { LengthValidator } from './validators/length';
import type { StructuredTextBlocksValidator } from './validators/structured_text_blocks';
import type { StructuredTextInlineBlocksValidator } from './validators/structured_text_inline_blocks';
import type { StructuredTextLinksValidator } from './validators/structured_text_links';

/**
 * STRUCTURED TEXT TYPE SYSTEM FOR DATOCMS
 *
 * This module defines a comprehensive type system for handling DatoCMS structured text fields,
 * which are rich text documents that can contain embedded blocks and inline elements.
 *
 * The challenge we're solving:
 * - DatoCMS structured text can contain "blocks" (embedded content items) in bloth 'block'
 *   and 'inlineBlock' nodes
 * - By default, CMA responses contain blocks as string IDs (lightweight references)
 * - With ?nested=true parameter though, API responses contain blocks as full item objects
 *   (which in turn can contain other blocks)
 * - For CMA requests, blocks can be represented as:
 *   1. String IDs (referencing existing items)
 *   2. Full item objects with IDs (for updates)
 *   3. Item objects without IDs (for creation)
 *
 * This creates a need for different type variants for the same conceptual data structure.
 */

/**
 * =============================================================================
 * REQUEST VARIANTS - Types for sending data TO the DatoCMS API
 * =============================================================================
 *
 * When making API requests, we need flexibility in how we represent embedded blocks:
 * - Use string IDs to reference existing blocks that do not need to change
 * - Include full block objects for updates
 * - Omit IDs for new blocks being created
 */

/**
 * Variant of 'block' structured text node for API requests
 */
export type BlockAsRequest = Block<BlockItemInARequest>;

/**
 * Variant of 'inlineBlock' structured text node for API requests
 */
export type InlineBlockAsRequest = InlineBlock<BlockItemInARequest>;

/**
 * Variant of Structured Text document for API requests
 */
export type DocumentAsRequest = Document<BlockItemInARequest>;

/**
 * =============================================================================
 * NESTED VARIANTS - Types for API responses with ?nested=true parameter
 * =============================================================================
 *
 * When using the GET /items?nested=true, the CMA returns Structured Text documents
 * with embedded blocks fully populated as complete RawApiTypes.Item objects instead
 * of just string IDs.
 */

/**
 * Variant of 'block' structured text node for ?nested=true API responses
 */
export type BlockWithNestedBlocks = Block<RawApiTypes.Item>;

/**
 * Variant of 'inlineBlock' structured text node for ?nested=true API responses
 */
export type InlineBlockWithNestedBlocks = InlineBlock<RawApiTypes.Item>;

/**
 * Variant of Structured Text document for ?nested=true API responses
 */
export type DocumentWithNestedBlocks = Document<RawApiTypes.Item>;

/**
 * =============================================================================
 * MAIN APPLICATION TYPES
 * =============================================================================
 */

/**
 * The main type for structured text field values in our application.
 * Can be null (empty field) or a document with blocks as string IDs
 */
export type StructuredTextFieldValue = Document | null;
export type StructuredTextFieldValueAsRequest = DocumentAsRequest | null;
export type StructuredTextFieldValueWithNestedBlocks =
  DocumentWithNestedBlocks | null;

/**
 * Utility function to validate all block/inlineBlock nodes in a structured text document tree.
 * Calls the provided callback for each block/inlineBlock node found and returns true only if all pass.
 */
function validateAllBlockNodes<T>(
  node: Node<T>,
  callback: (node: Block<T> | InlineBlock<T>) => boolean,
): boolean {
  return everyNode(node, (currentNode) => {
    // If this is a block or inlineBlock node, validate it with the callback
    if (isBlock<T>(currentNode) || isInlineBlock<T>(currentNode)) {
      return callback(currentNode);
    }
    // For all other node types, they're valid by default
    return true;
  });
}

/**
 * Type guard for basic structured text field values (blocks as string IDs only).
 * Checks for the expected structure and ensures all block/inlineBlock nodes have string IDs.
 */
export function isStructuredTextFieldValue(
  value: unknown,
): value is StructuredTextFieldValue {
  if (value === null) return true;

  if (!isDocument<unknown>(value)) {
    return false;
  }

  // Check that all block/inlineBlock nodes have string item IDs
  return validateAllBlockNodes(value.document, (node) => {
    return typeof node.item === 'string';
  });
}

/**
 * Type guard for structured text field values in API request format.
 * Allows blocks as string IDs, full objects with IDs, or objects without IDs.
 */
export function isStructuredTextFieldValueAsRequest(
  value: unknown,
): value is StructuredTextFieldValueAsRequest {
  if (value === null) return true;

  if (!isDocument<unknown>(value)) {
    return false;
  }

  // Check that all block/inlineBlock nodes have valid request format items
  return validateAllBlockNodes(value.document, (node) => {
    const item = node.item;

    // String ID
    if (isItemId(item)) return true;

    // Object (either with or without ID)
    return isItemWithOptionalIdAndMeta(item);
  });
}

/**
 * Type guard for structured text field values with nested blocks (?nested=true format).
 * Ensures all block/inlineBlock nodes have full RawApiTypes.Item objects.
 */
export function isStructuredTextFieldValueWithNestedBlocks(
  value: unknown,
): value is StructuredTextFieldValueWithNestedBlocks {
  if (value === null) return true;

  if (!isDocument<unknown>(value)) {
    return false;
  }

  // Check that all block/inlineBlock nodes have full item objects
  return validateAllBlockNodes(value.document, (node) => {
    const item = node.item;

    // Must be a full object with ID (nested format always includes full items)
    return isItemWithOptionalMeta(item);
  });
}

export type StructuredTextFieldValidators = {
  /** Only accept references to block records of the specified block models */
  structured_text_blocks: StructuredTextBlocksValidator;
  /** Only accept itemLink to inlineItem nodes for records of the specified models */
  structured_text_links: StructuredTextLinksValidator;
  /** Accept strings only with a specified number of characters */
  length?: LengthValidator;
  /** Only accept references to block records of the specified block models for inline blocks */
  structured_text_inline_blocks?: StructuredTextInlineBlocksValidator;
};

export type StructuredTextFieldAppearance =
  | { editor: 'structured_text'; parameters: StructuredTextEditorConfiguration }
  | {
      /** Plugin ID */
      editor: string;
      /** Plugin configuration */
      parameters: Record<string, unknown>;
    };
