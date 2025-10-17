import {
  type LocalizedFieldValue,
  isLocalizedFieldValue,
} from '../utilities/normalizedFieldValues';
import type { SlugEditorConfiguration } from './appearance/slug';
import type { UniqueValidator } from './validators';
import type { LengthValidator } from './validators/length';
import type { RequiredValidator } from './validators/required';
import type { SlugFormatValidator } from './validators/slug_format';
import type { SlugTitleFieldValidator } from './validators/slug_title_field';

export type SlugFieldValue = string | null;

export function isSlugFieldValue(value: unknown): value is SlugFieldValue {
  if (value === null) return true;
  return typeof value === 'string';
}

export function isLocalizedSlugFieldValue(
  value: unknown,
): value is LocalizedFieldValue<SlugFieldValue> {
  return (
    isLocalizedFieldValue(value) && Object.values(value).every(isSlugFieldValue)
  );
}

export type SlugFieldValidators = {
  /** Value must be specified or it won't be valid */
  required?: RequiredValidator;
  /** The value must be unique across the whole collection of records */
  unique?: UniqueValidator;
  /** Accept strings only with a specified number of characters */
  length?: LengthValidator;
  /** Only accept slugs having a specific format */
  slug_format?: SlugFormatValidator;
  /** Specifies the ID of the Single_line string field that will be used to generate the slug */
  slug_title_field?: SlugTitleFieldValidator;
};

export type SlugFieldAppearance =
  | { editor: 'slug'; parameters: SlugEditorConfiguration }
  | {
      /** Plugin ID */
      editor: string;
      /** Plugin configuration */
      parameters: Record<string, unknown>;
    };
