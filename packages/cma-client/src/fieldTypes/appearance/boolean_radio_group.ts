/**
 * Radio group input for boolean fields.
 */
export type BooleanRadioGroupEditorConfigurationRadio = {
  /** The text shown to the user for this radio option */
  label: string;
  /** Optional help text shown alongside the radio option */
  hint?: string;
};

export type BooleanRadioGroupEditorConfiguration = {
  /** Radio input for positive choice (true) */
  positive_radio: BooleanRadioGroupEditorConfigurationRadio;
  /** Radio input for negative choice (false) */
  negative_radio: BooleanRadioGroupEditorConfigurationRadio;
};
