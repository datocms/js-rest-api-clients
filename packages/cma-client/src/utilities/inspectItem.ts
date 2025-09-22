import {
  type TreeNode,
  formatAsTree,
  inspectionTreeNodes,
} from 'datocms-structured-text-utils';
import {
  type BlockItemInARequest,
  type BooleanFieldValue,
  type ColorFieldValue,
  type DateFieldValue,
  type DateTimeFieldValue,
  type FileFieldValue,
  type FileFieldValueAsRequest,
  type FloatFieldValue,
  type GalleryFieldValue,
  type GalleryFieldValueAsRequest,
  type IntegerFieldValue,
  type JsonFieldValue,
  type LatLonFieldValue,
  type LinkFieldValue,
  type LinksFieldValue,
  type NewBlockInARequest,
  type RichTextFieldValue,
  type RichTextFieldValueAsRequest,
  type RichTextFieldValueWithNestedBlocks,
  type SeoFieldValue,
  type SingleBlockFieldValue,
  type SingleBlockFieldValueAsRequest,
  type SingleBlockFieldValueWithNestedBlocks,
  type SlugFieldValue,
  type StringFieldValue,
  type StructuredTextFieldValue,
  type StructuredTextFieldValueAsRequest,
  type StructuredTextFieldValueWithNestedBlocks,
  type TextFieldValue,
  type UpdatedBlockInARequest,
  type VideoFieldValue,
  isBooleanFieldValue,
  isColorFieldValue,
  isDateFieldValue,
  isDateTimeFieldValue,
  isFileFieldValue,
  isFileFieldValueAsRequest,
  isFloatFieldValue,
  isGalleryFieldValue,
  isGalleryFieldValueAsRequest,
  isIntegerFieldValue,
  isJsonFieldValue,
  isLatLonFieldValue,
  isLinkFieldValue,
  isLinksFieldValue,
  isRichTextFieldValue,
  isRichTextFieldValueAsRequest,
  isRichTextFieldValueWithNestedBlocks,
  isSeoFieldValue,
  isSingleBlockFieldValue,
  isSingleBlockFieldValueAsRequest,
  isSingleBlockFieldValueWithNestedBlocks,
  isSlugFieldValue,
  isStringFieldValue,
  isStructuredTextFieldValue,
  isStructuredTextFieldValueAsRequest,
  isStructuredTextFieldValueWithNestedBlocks,
  isTextFieldValue,
  isVideoFieldValue,
} from '../fieldTypes';

import { type ApiTypes, type RawApiTypes, buildBlockRecord } from '../index';
import type { LocalizedFieldValue } from './normalizedFieldValues';
import { isLocalizedFieldValue } from './normalizedFieldValues';

type Item =
  | ApiTypes.Item
  | RawApiTypes.Item
  | NewBlockInARequest
  | UpdatedBlockInARequest
  | RawApiTypes.ItemCreateSchema
  | RawApiTypes.ItemUpdateSchema
  | ApiTypes.ItemCreateSchema
  | ApiTypes.ItemUpdateSchema;

interface FieldTypeHandler {
  guard: (value: unknown) => boolean;
  inspect: (
    value: any,
    options?: InspectItemOptions,
  ) => string | TreeNode | TreeNode[];
}

const fieldTypeHandlers: FieldTypeHandler[] = [
  { guard: isBooleanFieldValue, inspect: booleanInspectionTreeNodes },
  { guard: isFloatFieldValue, inspect: floatInspectionTreeNodes },
  { guard: isIntegerFieldValue, inspect: integerInspectionTreeNodes },
  { guard: isColorFieldValue, inspect: colorInspectionTreeNodes },
  { guard: isDateFieldValue, inspect: dateInspectionTreeNodes },
  { guard: isDateTimeFieldValue, inspect: dateTimeInspectionTreeNodes },
  { guard: isGalleryFieldValue, inspect: galleryInspectionTreeNodes },
  { guard: isGalleryFieldValueAsRequest, inspect: galleryInspectionTreeNodes },
  { guard: isFileFieldValue, inspect: fileInspectionTreeNodes },
  { guard: isFileFieldValueAsRequest, inspect: fileInspectionTreeNodes },
  { guard: isJsonFieldValue, inspect: jsonInspectionTreeNodes },
  { guard: isSlugFieldValue, inspect: slugInspectionTreeNodes },
  { guard: isStringFieldValue, inspect: stringInspectionTreeNodes },
  { guard: isTextFieldValue, inspect: textInspectionTreeNodes },
  { guard: isLatLonFieldValue, inspect: latLonInspectionTreeNodes },
  { guard: isLinkFieldValue, inspect: linkInspectionTreeNodes },
  { guard: isLinksFieldValue, inspect: linksInspectionTreeNodes },
  { guard: isSeoFieldValue, inspect: seoFieldInspectionTreeNodes },
  { guard: isVideoFieldValue, inspect: videoFieldInspectionTreeNodes },
  {
    guard: isStructuredTextFieldValue,
    inspect: structuredTextInspectionTreeNodes,
  },
  {
    guard: isStructuredTextFieldValueAsRequest,
    inspect: structuredTextInspectionTreeNodes,
  },
  {
    guard: isStructuredTextFieldValueWithNestedBlocks,
    inspect: structuredTextInspectionTreeNodes,
  },
  { guard: isSingleBlockFieldValue, inspect: singleBlockInspectionTreeNodes },
  {
    guard: isSingleBlockFieldValueAsRequest,
    inspect: singleBlockInspectionTreeNodes,
  },
  {
    guard: isSingleBlockFieldValueWithNestedBlocks,
    inspect: singleBlockInspectionTreeNodes,
  },
  { guard: isRichTextFieldValue, inspect: richTextInspectionTreeNodes },
  {
    guard: isRichTextFieldValueAsRequest,
    inspect: richTextInspectionTreeNodes,
  },
  {
    guard: isRichTextFieldValueWithNestedBlocks,
    inspect: richTextInspectionTreeNodes,
  },
];

function createChildNode(
  attributeName: string,
  inspectResult: string | TreeNode | TreeNode[],
): TreeNode {
  if (typeof inspectResult === 'string') {
    return { label: `${attributeName}: ${inspectResult}` };
  }

  if (Array.isArray(inspectResult)) {
    return {
      label: attributeName,
      nodes: inspectResult,
    };
  }

  // Single TreeNode
  return {
    label: attributeName,
    nodes: [inspectResult],
  };
}

function inspectFieldValue(
  value: unknown,
  options?: InspectItemOptions,
): string | TreeNode | TreeNode[] {
  if (isLocalizedFieldValue(value)) {
    for (const handler of fieldTypeHandlers) {
      if (
        Object.values(value).every((localeValue) => handler.guard(localeValue))
      ) {
        const localeEntries = Object.entries(value).sort(([a], [b]) =>
          a.localeCompare(b),
        );

        return localeEntries.map(([locale, localeValue]) => {
          const inspectResult = handler.inspect(localeValue, options);

          if (typeof inspectResult === 'string') {
            return { label: `${locale}: ${inspectResult}` };
          }

          if (Array.isArray(inspectResult)) {
            return {
              label: locale,
              nodes: inspectResult,
            };
          }

          // Single TreeNode
          return {
            label: locale,
            nodes: [inspectResult],
          };
        });
      }
    }
  }

  for (const handler of fieldTypeHandlers) {
    if (handler.guard(value)) {
      return handler.inspect(value, options);
    }
  }

  // Fallback for unknown field types
  return `UNKNOWN: ${JSON.stringify(value)}`;
}

function extractAttributes(item: Item): Record<string, unknown> {
  if ('attributes' in item) {
    return item.attributes as Record<string, unknown>;
  }

  const serializedItem = buildBlockRecord(item);
  const { __itemTypeId, ...rest } = serializedItem.attributes;
  return rest;
}

export type InspectItemOptions = {
  maxWidth?: number;
};

export function inspectItem(item: Item, options?: InspectItemOptions): string {
  return formatAsTree(itemInspectionTreeNodes(item, options));
}

function itemInspectionTreeNodes(
  item: Item,
  options?: InspectItemOptions,
): TreeNode {
  let itemTypeId: string | undefined;

  if ('relationships' in item && item.relationships) {
    const relationships = item.relationships as any;
    if (relationships.item_type?.data?.id) {
      itemTypeId = relationships.item_type.data.id;
    }
  }

  const rootLabel = [
    'Item',
    'id' in item ? JSON.stringify(item.id) : null,
    itemTypeId ? `(item_type: ${JSON.stringify(itemTypeId)})` : null,
  ]
    .filter(Boolean)
    .join(' ');

  const nodes: TreeNode[] = [];

  for (const [attributeName, attributeValue] of Object.entries(
    extractAttributes(item),
  )) {
    const inspectResult = inspectFieldValue(attributeValue, options);
    nodes.push(createChildNode(attributeName, inspectResult));
  }

  return {
    label: rootLabel,
    nodes: nodes.length > 0 ? nodes : undefined,
  };
}

function structuredTextInspectionTreeNodes(
  value:
    | StructuredTextFieldValue
    | StructuredTextFieldValueAsRequest
    | StructuredTextFieldValueWithNestedBlocks,
  options?: InspectItemOptions,
) {
  if (value === null) return 'null';

  return inspectionTreeNodes<BlockItemInARequest, BlockItemInARequest>(value, {
    maxWidth: options?.maxWidth || 80,
    blockFormatter: (block, maxWidth) => {
      if (typeof block === 'string') {
        return JSON.stringify(block);
      }

      return itemInspectionTreeNodes(block, options);
    },
  });
}

function singleBlockInspectionTreeNodes(
  value:
    | SingleBlockFieldValue
    | SingleBlockFieldValueAsRequest
    | SingleBlockFieldValueWithNestedBlocks,
  options?: InspectItemOptions,
) {
  if (value === null) return 'null';
  if (typeof value === 'string') return JSON.stringify(value);
  return itemInspectionTreeNodes(value, options);
}

function richTextInspectionTreeNodes(
  value:
    | RichTextFieldValue
    | RichTextFieldValueAsRequest
    | RichTextFieldValueWithNestedBlocks,
  options?: InspectItemOptions,
): string | TreeNode[] {
  if (value === null) return 'null';

  return value.map<TreeNode>((item, index) => {
    const result = singleBlockInspectionTreeNodes(item, options);
    if (typeof result === 'string') {
      return { label: `[${index}] ${result}` };
    }
    result.label = `[${index}] ${result.label}`;
    return result;
  });
}

function booleanInspectionTreeNodes(value: BooleanFieldValue): string {
  return JSON.stringify(value);
}

function colorInspectionTreeNodes(value: ColorFieldValue): string {
  if (value === null) return 'null';

  const { red, green, blue, alpha } = value;
  const hex = `#${red.toString(16).padStart(2, '0').toUpperCase()}${green.toString(16).padStart(2, '0').toUpperCase()}${blue.toString(16).padStart(2, '0').toUpperCase()}`;

  if (alpha === 255) {
    return hex;
  }
  const alphaPercent = Math.round((alpha / 255) * 100);
  return `${hex} ${alphaPercent}%`;
}

function dateInspectionTreeNodes(value: DateFieldValue): string {
  if (value === null) return 'null';
  return value;
}

function dateTimeInspectionTreeNodes(value: DateTimeFieldValue): string {
  if (value === null) return 'null';
  return value;
}

function fileInspectionTreeNodes(
  value: FileFieldValue | FileFieldValueAsRequest,
  options?: InspectItemOptions,
): string | TreeNode[] {
  if (value === null) return 'null';

  const nodes: TreeNode[] = [];

  nodes.push({ label: `upload_id: ${JSON.stringify(value.upload_id)}` });

  if (value.alt) {
    nodes.push({
      label: `alt: ${JSON.stringify(truncate(value.alt, options?.maxWidth || 80))}`,
    });
  }

  if (value.title) {
    nodes.push({
      label: `title: ${JSON.stringify(truncate(value.title, options?.maxWidth || 80))}`,
    });
  }

  if (value.custom_data && Object.keys(value.custom_data).length > 0) {
    nodes.push({
      label: `custom_data: ${truncate(JSON.stringify(value.custom_data), options?.maxWidth || 80)}`,
    });
  }

  if (value.focal_point) {
    const x = value.focal_point.x * 100;
    const y = value.focal_point.y * 100;
    nodes.push({ label: `focal_point: x=${x}% y=${y}%` });
  }

  return nodes;
}

function floatInspectionTreeNodes(value: FloatFieldValue): string {
  if (value === null) return 'null';
  return value.toString();
}

function galleryInspectionTreeNodes(
  value: GalleryFieldValue | GalleryFieldValueAsRequest,
  options?: InspectItemOptions,
): string | TreeNode[] {
  if (!value || value.length === 0) return '[]';

  const itemNodes: TreeNode[] = value.map((item, index) => {
    const nodes: TreeNode[] = [];

    nodes.push({
      label: `upload_id: ${JSON.stringify(item.upload_id)}`,
    });

    if (item.alt) {
      nodes.push({
        label: `alt: ${JSON.stringify(truncate(item.alt, options?.maxWidth || 80))}`,
      });
    }

    if (item.title) {
      nodes.push({
        label: `title: ${JSON.stringify(truncate(item.title, options?.maxWidth || 80))}`,
      });
    }

    if (item.custom_data && Object.keys(item.custom_data).length > 0) {
      nodes.push({
        label: `custom_data: ${truncate(JSON.stringify(item.custom_data), options?.maxWidth || 80)}`,
      });
    }

    if (item.focal_point) {
      const x = item.focal_point.x * 100;
      const y = item.focal_point.y * 100;
      nodes.push({ label: `focal_point: x=${x}% y=${y}%` });
    }

    return {
      label: `[${index}]`,
      nodes: nodes,
    };
  });

  return itemNodes;
}

function integerInspectionTreeNodes(value: IntegerFieldValue): string {
  if (value === null) return 'null';
  return value.toString();
}

function jsonInspectionTreeNodes(
  value: JsonFieldValue,
  options?: InspectItemOptions,
): string {
  if (value === null) return 'null';
  return truncate(JSON.stringify(JSON.parse(value)), options?.maxWidth || 80);
}

function latLonInspectionTreeNodes(
  value: LatLonFieldValue,
): string | TreeNode[] {
  if (value === null) return 'null';

  return [
    { label: `latitude: ${value.latitude}` },
    { label: `longitude: ${value.longitude}` },
  ];
}

function linkInspectionTreeNodes(value: LinkFieldValue): string {
  if (value === null) return 'null';
  return JSON.stringify(value);
}

function linksInspectionTreeNodes(value: LinksFieldValue): string | TreeNode[] {
  if (value === null) return 'null';

  return value.map<TreeNode>((itemId, index) => ({
    label: `[${index}]: ${JSON.stringify(itemId)}`,
  }));
}

function seoFieldInspectionTreeNodes(
  value: SeoFieldValue,
  options?: InspectItemOptions,
): string | TreeNode[] {
  if (value === null) return 'null';

  const nodes: TreeNode[] = [];

  if (value.title) {
    nodes.push({
      label: `title: ${JSON.stringify(truncate(value.title, options?.maxWidth || 80))}`,
    });
  }

  if (value.description) {
    nodes.push({
      label: `description: ${JSON.stringify(truncate(value.description, options?.maxWidth || 80))}`,
    });
  }

  if (value.image) {
    nodes.push({
      label: `image: ${value.image}`,
    });
  }

  if (value.twitter_card) {
    nodes.push({
      label: `twitter_card: ${value.twitter_card}`,
    });
  }

  if (value.no_index !== undefined) {
    nodes.push({
      label: `no_index: ${value.no_index}`,
    });
  }

  return nodes;
}

function slugInspectionTreeNodes(
  value: SlugFieldValue,
  options?: InspectItemOptions,
): string {
  if (value === null) return 'null';
  return JSON.stringify(truncate(value, options?.maxWidth || 80));
}

function stringInspectionTreeNodes(
  value: StringFieldValue,
  options?: InspectItemOptions,
): string {
  if (value === null) return 'null';
  return JSON.stringify(truncate(value, options?.maxWidth || 80));
}

function textInspectionTreeNodes(
  value: TextFieldValue,
  options?: InspectItemOptions,
): string {
  if (value === null) return 'null';
  return JSON.stringify(truncate(value, options?.maxWidth || 80));
}

function videoFieldInspectionTreeNodes(
  value: VideoFieldValue,
  options?: InspectItemOptions,
): string | TreeNode[] {
  if (value === null) return 'null';

  const nodes: TreeNode[] = [];

  nodes.push({ label: `provider: ${value.provider}` });
  nodes.push({ label: `provider_uid: ${value.provider_uid}` });
  nodes.push({ label: `url: ${value.url}` });
  nodes.push({ label: `size: ${value.width}⨯${value.height}px` });
  nodes.push({ label: `thumbnail_url: ${value.thumbnail_url}` });

  if (value.title) {
    nodes.push({
      label: `title: ${JSON.stringify(truncate(value.title, options?.maxWidth || 80))}`,
    });
  }

  return nodes;
}

function localizedFieldValueInspectionTreeNodes(
  value: LocalizedFieldValue<unknown>,
  options?: InspectItemOptions,
): TreeNode[] {
  const localeEntries = Object.entries(value).sort(([a], [b]) =>
    a.localeCompare(b),
  );

  return localeEntries.map(([locale, localeValue]) => {
    const inspectResult = inspectFieldValue(localeValue, options);

    if (typeof inspectResult === 'string') {
      return { label: `${locale}: ${inspectResult}` };
    }

    if (Array.isArray(inspectResult)) {
      return {
        label: locale,
        nodes: inspectResult,
      };
    }

    // Single TreeNode
    return {
      label: locale,
      nodes: [inspectResult],
    };
  });
}

function truncate(text: string, maxWidth: number): string {
  if (text.length <= maxWidth) return text;
  return `${text.slice(0, maxWidth - 3)}...`;
}
