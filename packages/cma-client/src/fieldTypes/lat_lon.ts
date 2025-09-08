import type { LocalizedFieldValue } from '../utilities/fieldValue';
import type { MapEditorConfiguration } from './appearance/map';
import type { RequiredValidator } from './validators/required';

export type LocationFieldValue = {
  latitude: number;
  longitude: number;
} | null;

export function isLocationFieldValue(
  value: unknown,
): value is LocationFieldValue {
  if (value === null) return true;
  return (
    typeof value === 'object' &&
    value !== null &&
    'latitude' in value &&
    'longitude' in value
  );
}

export function isLocalizedLocationFieldValue(
  value: unknown,
): value is LocalizedFieldValue<LocationFieldValue> {
  return (
    typeof value === 'object' &&
    value !== null &&
    Object.values(value).every(isLocationFieldValue)
  );
}

export type LocationFieldValidators = {
  /** Value must be specified or it won't be valid */
  required?: RequiredValidator;
};

export type LocationFieldAppearance =
  | { editor: 'map'; parameters: MapEditorConfiguration }
  | {
      /** Plugin ID */
      editor: string;
      /** Plugin configuration */
      parameters: Record<string, unknown>;
    };
