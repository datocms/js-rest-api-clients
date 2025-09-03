import {
  type Block,
  type Document,
  type InlineBlock,
  type Root,
  isBlock,
  isInlineBlock,
  isNode,
} from 'datocms-structured-text-utils';
import type * as SchemaTypes from '../generated/SchemaTypes';
import { everyNode } from '../utilities/structuredText';
import {
  type BlockItemInARequest,
  isBlockObject,
  isBlockObjectWithId,
  isBlockStringId,
} from './single_block';

/**
 * STRUCTURED TEXT TYPE SYSTEM FOR DATOCMS
 *
 * This module defines a comprehensive type system for handling DatoCMS structured text fields,
 * which are rich text documents that can contain embedded blocks and inline elements.
 *
 * The challenge we're solving:
 * - DatoCMS structured text can contain "blocks" (embedded content items) in bloth 'block'
 *   and 'inlineBlock' nodes
 * - By default, API responses contain blocks as string IDs (lightweight references)
 * - With ?nested=true parameter though, API responses contain blocks as full item objects
 *   (which in turn can contain other blocks)
 * - For API requests, blocks can be represented as:
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
export type BlockAsRequest = Omit<Block, 'item'> & {
  item: BlockItemInARequest;
};

/**
 * Variant of 'inlineBlock' structured text node for API requests
 */
export type InlineBlockAsRequest = Omit<InlineBlock, 'item'> & {
  item: BlockItemInARequest;
};

/**
 * Generic type to transform a node that might be containing a 'block' or 'inlineBlock' as a (deeply nested) children to its variant for API requests
 */
export type NodeAsRequest<T> = WithMappedChildren<
  T,
  DeepMapVariants<
    T extends { children: infer C } ? C : never,
    BlockAsRequest,
    InlineBlockAsRequest
  >
>;

/**
 * Variant of Structured Text document for API requests
 */
export type DocumentAsRequest = {
  schema: 'dast';
  document: NodeAsRequest<Root>;
};

/**
 * =============================================================================
 * NESTED VARIANTS - Types for API responses with ?nested=true parameter
 * =============================================================================
 *
 * When using the GET /items?nested=true, the API returns Structured Text documents
 * with embedded blocks fully populated as complete SchemaTypes.Item objects instead
 * of just string IDs.
 */

/**
 * Variant of 'block' structured text node for ?nested=true API responses
 */
export type BlockWithNestedBlocks = Omit<Block, 'item'> & {
  item: SchemaTypes.Item;
};

/**
 * Variant of 'inlineBlock' structured text node for ?nested=true API responses
 */
export type InlineBlockWithNestedBlocks = Omit<InlineBlock, 'item'> & {
  item: SchemaTypes.Item;
};

/**
 * Generic type to transform a node that might be containing a 'block' or 'inlineBlock' as a (deeply nested) children to it's variant for ?nested=true API responses
 */
export type NodeWithNestedBlocks<T> = WithMappedChildren<
  T,
  DeepMapVariants<
    T extends { children: infer C } ? C : never,
    BlockWithNestedBlocks,
    InlineBlockWithNestedBlocks
  >
>;

/**
 * Variant of Structured Text document for ?nested=true API responses
 */
export type DocumentWithNestedBlocks = {
  schema: 'dast';
  document: NodeWithNestedBlocks<Root>;
};

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
 * Helper function to validate if a value has the expected structured text document structure.
 * Checks for the presence of 'schema' and 'document' properties on a non-null object.
 */
function isValidDocumentStructure(
  value: unknown,
): value is { schema: unknown; document: unknown } {
  return (
    typeof value === 'object' &&
    value !== null &&
    'schema' in value &&
    'document' in value
  );
}

/**
 * Utility function to validate all block/inlineBlock nodes in a structured text document tree.
 * Calls the provided callback for each block/inlineBlock node found and returns true only if all pass.
 */
function validateAllBlockNodes(
  node: unknown,
  callback: (
    node:
      | Block
      | BlockAsRequest
      | BlockWithNestedBlocks
      | InlineBlock
      | InlineBlockAsRequest
      | InlineBlockWithNestedBlocks,
  ) => boolean,
): boolean {
  return everyNode(node, (currentNode) => {
    // If this is a block or inlineBlock node, validate it with the callback
    if (
      isNode(currentNode) &&
      (isBlock(currentNode) || isInlineBlock(currentNode))
    ) {
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

  if (!isValidDocumentStructure(value)) {
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

  if (!isValidDocumentStructure(value)) {
    return false;
  }

  // Check that all block/inlineBlock nodes have valid request format items
  return validateAllBlockNodes(value.document, (node) => {
    const item = node.item;

    // String ID
    if (isBlockStringId(item)) return true;

    // Object (either with or without ID)
    return isBlockObject(item);
  });
}

/**
 * Type guard for structured text field values with nested blocks (?nested=true format).
 * Ensures all block/inlineBlock nodes have full SchemaTypes.Item objects.
 */
export function isStructuredTextFieldValueWithNestedBlocks(
  value: unknown,
): value is StructuredTextFieldValueWithNestedBlocks {
  if (value === null) return true;

  if (!isValidDocumentStructure(value)) {
    return false;
  }

  // Check that all block/inlineBlock nodes have full item objects
  return validateAllBlockNodes(value.document, (node) => {
    const item = node.item;

    // Must be a full object with ID (nested format always includes full items)
    return isBlockObjectWithId(item);
  });
}

/**
 * =============================================================================
 * SHARED TRANSFORMATION UTILITIES
 * =============================================================================
 *
 * These utility types provide the machinery for automatically transforming
 * structured text types between their different variants. The goal is to
 * recursively walk through complex nested structures and apply the appropriate
 * transformations to Block and InlineBlock nodes while preserving all other types.
 */

/**
 * Utility type that preserves the structure of T but replaces its children with ChildrenType.
 * If T doesn't have children, it returns T unchanged.
 */
type WithMappedChildren<T, ChildrenType> = T extends { children: any }
  ? Omit<T, 'children'> & { children: ChildrenType }
  : T;

/**
 * Generic transformation type that replace 'block' and 'inlineBlock' node types to their variants.
 */
type MapVariants<T, BlockVariant, InlineBlockVariant> = T extends Block
  ? BlockVariant
  : T extends InlineBlock
    ? InlineBlockVariant
    : T;

/**
 * Recursively transform a Structured Text node type using the provided variants for 'block' and 'inlineBlock' nodes.
 *
 * This handles three cases:
 * _ Arrays: Transform each array element recursively
 * _ Objects with children: Transform the object itself AND recursively transform its children
 * _ Leaf nodes: Apply the variant mapping
 */
type DeepMapVariants<T, BlockVariant, InlineBlockVariant> =
  T extends (infer U)[]
    ? DeepMapVariants<U, BlockVariant, InlineBlockVariant>[]
    : T extends { children: infer Children }
      ? T extends { children: any }
        ? Omit<T, 'children'> & {
            children: DeepMapVariants<
              Children,
              BlockVariant,
              InlineBlockVariant
            >;
          }
        : MapVariants<T, BlockVariant, InlineBlockVariant>
      : MapVariants<T, BlockVariant, InlineBlockVariant>;

import type { StructuredTextEditorConfiguration } from './appearance/structured_text';
import type { LengthValidator } from './validators/length';
import type { StructuredTextBlocksValidator } from './validators/structured_text_blocks';
import type { StructuredTextInlineBlocksValidator } from './validators/structured_text_inline_blocks';
import type { StructuredTextLinksValidator } from './validators/structured_text_links';

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
