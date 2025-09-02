/**
 * Select input for string fields.
 */
export type StringSelectEditorConfigurationOption = {
  /** The text shown to the user for this option */
  label: string;
  /** The value that will be stored when this option is selected */
  value: string;
  /** Optional help text shown alongside the option */
  hint?: string;
};

export type StringSelectEditorConfiguration = {
  /** The different select options */
  options: Array<StringSelectEditorConfigurationOption>;
};
