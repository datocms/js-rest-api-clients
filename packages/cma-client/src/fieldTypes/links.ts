import { isValidId } from '../utilities/id.js';
import {
  type LocalizedFieldValue,
  isLocalizedFieldValue,
} from '../utilities/normalizedFieldValues.js';
import type { LinksEmbedEditorConfiguration } from './appearance/links_embed.js';
import type { LinksSelectEditorConfiguration } from './appearance/links_select.js';
import type { ItemsItemTypeValidator } from './validators/items_item_type.js';
import type { SizeValidator } from './validators/size.js';

export type LinksFieldValue = string[];

export function isLinksFieldValue(value: unknown): value is LinksFieldValue {
  return (
    Array.isArray(value) &&
    value.every((item) => typeof item === 'string' && isValidId(item))
  );
}

export function isLocalizedLinksFieldValue(
  value: unknown,
): value is LocalizedFieldValue<LinksFieldValue> {
  return (
    isLocalizedFieldValue(value) &&
    Object.values(value).every(isLinksFieldValue)
  );
}

export type LinksFieldValidators = {
  /** Only accept references to records of the specified models */
  items_item_type: ItemsItemTypeValidator;
  /** Only accept a number of items within the specified range */
  size?: SizeValidator;
};

export type LinksFieldAppearance =
  | { editor: 'links_select'; parameters: LinksSelectEditorConfiguration }
  | { editor: 'links_embed'; parameters: LinksEmbedEditorConfiguration }
  | {
      /** Plugin ID */
      editor: string;
      /** Plugin configuration */
      parameters: Record<string, unknown>;
    };
