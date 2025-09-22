import { isValidId } from '../utilities/id';
import {
  type LocalizedFieldValue,
  isLocalizedFieldValue,
} from '../utilities/normalizedFieldValues';
import type { LinkEmbedEditorConfiguration } from './appearance/link_embed';
import type { LinkSelectEditorConfiguration } from './appearance/link_select';
import type { ItemItemTypeValidator } from './validators/item_item_type';
import type { RequiredValidator } from './validators/required';
import type { UniqueValidator } from './validators/unique';

export type LinkFieldValue = string | null;

export function isLinkFieldValue(value: unknown): value is LinkFieldValue {
  return (typeof value === 'string' && isValidId(value)) || value === null;
}

export function isLocalizedLinkFieldValue(
  value: unknown,
): value is LocalizedFieldValue<LinkFieldValue> {
  return (
    isLocalizedFieldValue(value) && Object.values(value).every(isLinkFieldValue)
  );
}

export type LinkFieldValidators = {
  /** Only accept references to records of the specified models */
  item_item_type: ItemItemTypeValidator;
  /** Value must be specified or it won't be valid */
  required?: RequiredValidator;
  /** The value must be unique across the whole collection of records */
  unique?: UniqueValidator;
};

export type LinkFieldAppearance =
  | { editor: 'link_select'; parameters: LinkSelectEditorConfiguration }
  | { editor: 'link_embed'; parameters: LinkEmbedEditorConfiguration }
  | {
      /** Plugin ID */
      editor: string;
      /** Plugin configuration */
      parameters: Record<string, unknown>;
    };
