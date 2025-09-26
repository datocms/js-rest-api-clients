import {
  type LocalizedFieldValue,
  isLocalizedFieldValue,
} from '../utilities/normalizedFieldValues';
import type { SingleLineEditorConfiguration } from './appearance/single_line';
import type { StringRadioGroupEditorConfiguration } from './appearance/string_radio_group';
import type { StringSelectEditorConfiguration } from './appearance/string_select';
import type { EnumValidator } from './validators/enum';
import type { FormatValidator } from './validators/format';
import type { LengthValidator } from './validators/length';
import type { RequiredValidator } from './validators/required';
import type { UniqueValidator } from './validators/unique';

export type StringFieldValue = string | null;

export function isStringFieldValue(value: unknown): value is StringFieldValue {
  return typeof value === 'string' || value === null;
}

export function isLocalizedStringFieldValue(
  value: unknown,
): value is LocalizedFieldValue<StringFieldValue> {
  return (
    isLocalizedFieldValue(value) &&
    Object.values(value).every(isStringFieldValue)
  );
}

export type StringFieldValidators = {
  /** Value must be specified or it won't be valid */
  required?: RequiredValidator;
  /** The value must be unique across the whole collection of records */
  unique?: UniqueValidator;
  /** Accept strings only with a specified number of characters */
  length?: LengthValidator;
  /** Accepts only strings that match a specified format */
  format?: FormatValidator;
  /** Only accept a specific set of values */
  enum?: EnumValidator;
};

export type StringFieldAppearance =
  | { editor: 'single_line'; parameters: SingleLineEditorConfiguration }
  | {
      editor: 'string_radio_group';
      parameters: StringRadioGroupEditorConfiguration;
    }
  | { editor: 'string_select'; parameters: StringSelectEditorConfiguration }
  | {
      /** Plugin ID */
      editor: string;
      /** Plugin configuration */
      parameters: Record<string, unknown>;
    };
