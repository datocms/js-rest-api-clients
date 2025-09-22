import {
  type LocalizedFieldValue,
  isLocalizedFieldValue,
} from '../utilities/normalizedFieldValues';
import type { JsonEditorConfiguration } from './appearance/json';
import type { StringCheckboxGroupEditorConfiguration } from './appearance/string_checkbox_group';
import type { StringMultiSelectEditorConfiguration } from './appearance/string_multi_select';
import type { RequiredValidator } from './validators/required';

export type JsonFieldValue = string | null;

export function isJsonFieldValue(value: unknown): value is JsonFieldValue {
  if (value === null) return true;
  if (typeof value !== 'string') return false;
  try {
    JSON.parse(value);
    return true;
  } catch {
    return false;
  }
}

export function isLocalizedJsonFieldValue(
  value: unknown,
): value is LocalizedFieldValue<JsonFieldValue> {
  return (
    isLocalizedFieldValue(value) && Object.values(value).every(isJsonFieldValue)
  );
}

export type JsonFieldValidators = {
  /** Value must be specified or it won't be valid */
  required?: RequiredValidator;
};

export type JsonFieldAppearance =
  | { editor: 'json'; parameters: JsonEditorConfiguration }
  | {
      editor: 'string_multi_select';
      parameters: StringMultiSelectEditorConfiguration;
    }
  | {
      editor: 'string_checkbox_group';
      parameters: StringCheckboxGroupEditorConfiguration;
    }
  | {
      /** Plugin ID */
      editor: string;
      /** Plugin configuration */
      parameters: Record<string, unknown>;
    };
