import type * as SchemaTypes from '../generated/SchemaTypes';
import type * as SimpleSchemaTypes from '../generated/SimpleSchemaTypes';

export function modelIdsReferencedInField(
  field: SchemaTypes.Field | SimpleSchemaTypes.Field,
) {
  const attributes = 'attributes' in field ? field.attributes : field;

  switch (attributes.field_type) {
    case 'link': {
      return attributes.validators.item_item_type.item_types;
    }
    case 'links': {
      return attributes.validators.items_item_type.item_types;
    }
    case 'structured_text': {
      return attributes.validators.structured_text_links.item_types;
    }
    default: {
      return [];
    }
  }
}

export function blockModelIdsReferencedInField(
  field: SchemaTypes.Field | SimpleSchemaTypes.Field,
) {
  const attributes = 'attributes' in field ? field.attributes : field;

  switch (attributes.field_type) {
    case 'single_block': {
      return attributes.validators.single_block_blocks.item_types;
    }
    case 'rich_text': {
      return attributes.validators.rich_text_blocks.item_types;
    }
    case 'structured_text': {
      return [
        ...attributes.validators.structured_text_blocks.item_types,
        ...(attributes.validators.structured_text_inline_blocks
          ? attributes.validators.structured_text_inline_blocks.item_types
          : []),
      ];
    }
    default: {
      return [];
    }
  }
}
