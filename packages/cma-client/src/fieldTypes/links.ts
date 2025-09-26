import { isValidId } from '../utilities/id';
import {
  type LocalizedFieldValue,
  isLocalizedFieldValue,
} from '../utilities/normalizedFieldValues';
import type { LinksEmbedEditorConfiguration } from './appearance/links_embed';
import type { LinksSelectEditorConfiguration } from './appearance/links_select';
import type { ItemsItemTypeValidator } from './validators/items_item_type';
import type { SizeValidator } from './validators/size';

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
