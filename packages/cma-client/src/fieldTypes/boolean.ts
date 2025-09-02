import type { BooleanEditorConfiguration } from './appearance/boolean';
import type { BooleanRadioGroupEditorConfiguration } from './appearance/boolean_radio_group';

export type BooleanFieldValue = boolean | null;

export function isBooleanFieldValue(
  value: unknown,
): value is BooleanFieldValue {
  return typeof value === 'boolean' || value === null;
}

export type BooleanFieldValidators = Record<string, never>;

export type BooleanFieldAppearance =
  | { editor: 'boolean'; parameters: BooleanEditorConfiguration }
  | {
      editor: 'boolean_radio_group';
      parameters: BooleanRadioGroupEditorConfiguration;
    }
  | {
      /** Plugin ID */
      editor: string;
      /** Plugin configuration */
      parameters: Record<string, unknown>;
    };
