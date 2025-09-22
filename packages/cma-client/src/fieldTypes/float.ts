import {
  type LocalizedFieldValue,
  isLocalizedFieldValue,
} from '../utilities/normalizedFieldValues';
import type { FloatEditorConfiguration } from './appearance/float';
import type { NumberRangeValidator } from './validators/number_range';
import type { RequiredValidator } from './validators/required';

export type FloatFieldValue = number | null;

export function isFloatFieldValue(value: unknown): value is FloatFieldValue {
  return typeof value === 'number' || value === null;
}

export function isLocalizedFloatFieldValue(
  value: unknown,
): value is LocalizedFieldValue<FloatFieldValue> {
  return (
    isLocalizedFieldValue(value) &&
    Object.values(value).every(isFloatFieldValue)
  );
}

export type FloatFieldValidators = {
  /** Value must be specified or it won't be valid */
  required?: RequiredValidator;
  /** Accept numbers only inside a specified range */
  number_range?: NumberRangeValidator;
};

export type FloatFieldAppearance =
  | { editor: 'float'; parameters: FloatEditorConfiguration }
  | {
      /** Plugin ID */
      editor: string;
      /** Plugin configuration */
      parameters: Record<string, unknown>;
    };
