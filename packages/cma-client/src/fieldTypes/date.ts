import {
  type LocalizedFieldValue,
  isLocalizedFieldValue,
} from '../utilities/normalizedFieldValues';
import type { DatePickerEditorConfiguration } from './appearance/date_picker';
import type { DateRangeValidator } from './validators/date_range';
import type { RequiredValidator } from './validators/required';

export type DateFieldValue = string | null;

export function isDateFieldValue(value: unknown): value is DateFieldValue {
  if (value === null) return true;
  return typeof value === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(value);
}

export function isLocalizedDateFieldValue(
  value: unknown,
): value is LocalizedFieldValue<DateFieldValue> {
  return (
    isLocalizedFieldValue(value) && Object.values(value).every(isDateFieldValue)
  );
}

export type DateFieldValidators = {
  /** Value must be specified or it won't be valid */
  required?: RequiredValidator;
  /** Accept dates only inside a specified date range */
  date_range?: DateRangeValidator;
};

export type DateFieldAppearance =
  | { editor: 'date_picker'; parameters: DatePickerEditorConfiguration }
  | {
      /** Plugin ID */
      editor: string;
      /** Plugin configuration */
      parameters: Record<string, unknown>;
    };
