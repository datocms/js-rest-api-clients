/**
 * Select input for JSON fields, to edit an array of strings.
 */
export type StringMultiSelectEditorConfigurationOption = {
  /** The text shown to the user for this option */
  label: string;
  /** The value that will be stored when this option is selected */
  value: string;
  /** Optional help text shown alongside the option */
  hint?: string;
};

export type StringMultiSelectEditorConfiguration = {
  /** The different select options */
  options: Array<StringMultiSelectEditorConfigurationOption>;
};
