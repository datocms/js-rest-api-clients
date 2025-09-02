/**
 * Radio group input for string fields.
 */
export type StringRadioGroupEditorConfigurationRadio = {
  /** The text shown to the user for this radio option */
  label: string;
  /** The value that will be stored when this radio is selected */
  value: string;
  /** Optional help text shown alongside the radio option */
  hint?: string;
};

export type StringRadioGroupEditorConfiguration = {
  /** The different radio options */
  radios: Array<StringRadioGroupEditorConfigurationRadio>;
};
