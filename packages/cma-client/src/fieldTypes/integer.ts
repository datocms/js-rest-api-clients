import {
  type LocalizedFieldValue,
  isLocalizedFieldValue,
} from '../utilities/normalizedFieldValues';
import type { IntegerEditorConfiguration } from './appearance/integer';
import type { NumberRangeValidator } from './validators/number_range';
import type { RequiredValidator } from './validators/required';

export type IntegerFieldValue = number | null;

export function isIntegerFieldValue(
  value: unknown,
): value is IntegerFieldValue {
  return typeof value === 'number' || value === null;
}

export function isLocalizedIntegerFieldValue(
  value: unknown,
): value is LocalizedFieldValue<IntegerFieldValue> {
  return (
    isLocalizedFieldValue(value) &&
    Object.values(value).every(isIntegerFieldValue)
  );
}

export type IntegerFieldValidators = {
  /** Value must be specified or it won't be valid */
  required?: RequiredValidator;
  /** Accept numbers only inside a specified range */
  number_range?: NumberRangeValidator;
};

export type IntegerFieldAppearance =
  | { editor: 'integer'; parameters: IntegerEditorConfiguration }
  | {
      /** Plugin ID */
      editor: string;
      /** Plugin configuration */
      parameters: Record<string, unknown>;
    };
