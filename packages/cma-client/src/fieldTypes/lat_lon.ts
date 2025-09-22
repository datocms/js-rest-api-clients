import {
  type LocalizedFieldValue,
  isLocalizedFieldValue,
} from '../utilities/normalizedFieldValues';
import type { MapEditorConfiguration } from './appearance/map';
import type { RequiredValidator } from './validators/required';

export type LatLonFieldValue = {
  latitude: number;
  longitude: number;
} | null;

export function isLatLonFieldValue(value: unknown): value is LatLonFieldValue {
  if (value === null) return true;
  return (
    typeof value === 'object' &&
    value !== null &&
    'latitude' in value &&
    'longitude' in value
  );
}

export function isLocalizedLatLonFieldValue(
  value: unknown,
): value is LocalizedFieldValue<LatLonFieldValue> {
  return (
    isLocalizedFieldValue(value) &&
    Object.values(value).every(isLatLonFieldValue)
  );
}

export type LatLonFieldValidators = {
  /** Value must be specified or it won't be valid */
  required?: RequiredValidator;
};

export type LatLonFieldAppearance =
  | { editor: 'map'; parameters: MapEditorConfiguration }
  | {
      /** Plugin ID */
      editor: string;
      /** Plugin configuration */
      parameters: Record<string, unknown>;
    };
