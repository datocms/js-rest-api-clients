import {
  type LocalizedFieldValue,
  isLocalizedFieldValue,
} from '../utilities/normalizedFieldValues';
import type { ColorPickerEditorConfiguration } from './appearance/color_picker';
import type { RequiredValidator } from './validators/required';

export type ColorFieldValue = {
  red: number;
  green: number;
  blue: number;
  alpha: number;
} | null;

export function isColorFieldValue(value: unknown): value is ColorFieldValue {
  if (value === null) return true;
  return (
    typeof value === 'object' &&
    value !== null &&
    'red' in value &&
    'green' in value &&
    'blue' in value &&
    'alpha' in value
  );
}

export function isLocalizedColorFieldValue(
  value: unknown,
): value is LocalizedFieldValue<ColorFieldValue> {
  return (
    isLocalizedFieldValue(value) &&
    Object.values(value).every(isColorFieldValue)
  );
}

export type ColorFieldValidators = {
  /** Value must be specified or it won't be valid */
  required?: RequiredValidator;
};

export type ColorFieldAppearance =
  | { editor: 'color_picker'; parameters: ColorPickerEditorConfiguration }
  | {
      /** Plugin ID */
      editor: string;
      /** Plugin configuration */
      parameters: Record<string, unknown>;
    };
