import {
  type LocalizedFieldValue,
  isLocalizedFieldValue,
} from '../utilities/normalizedFieldValues';
import type { DateTimePickerEditorConfiguration } from './appearance/date_time_picker';
import type { DateTimeRangeValidator } from './validators/date_time_range';
import type { RequiredValidator } from './validators/required';

export type DateTimeFieldValue = string | null;

export function isDateTimeFieldValue(
  value: unknown,
): value is DateTimeFieldValue {
  if (value === null) return true;
  return (
    typeof value === 'string' &&
    /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/.test(value)
  );
}

export function isLocalizedDateTimeFieldValue(
  value: unknown,
): value is LocalizedFieldValue<DateTimeFieldValue> {
  return (
    isLocalizedFieldValue(value) &&
    Object.values(value).every(isDateTimeFieldValue)
  );
}

export type DateTimeFieldValidators = {
  /** Value must be specified or it won't be valid */
  required?: RequiredValidator;
  /** Accept date times only inside a specified date range */
  date_time_range?: DateTimeRangeValidator;
};

export type DateTimeFieldAppearance =
  | {
      editor: 'date_time_picker';
      parameters: DateTimePickerEditorConfiguration;
    }
  | {
      /** Plugin ID */
      editor: string;
      /** Plugin configuration */
      parameters: Record<string, unknown>;
    };
