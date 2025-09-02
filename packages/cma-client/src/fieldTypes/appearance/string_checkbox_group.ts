/**
 * Multiple checkboxes input for JSON fields, to edit an array of strings.
 */
export type StringCheckboxGroupEditorConfigurationOption = {
  /** The text shown to the user for this option */
  label: string;
  /** The value that will be stored when this option is selected */
  value: string;
  /** Optional help text shown alongside the option */
  hint?: string;
};

export type StringCheckboxGroupEditorConfiguration = {
  /** The different checkbox options */
  options: Array<StringCheckboxGroupEditorConfigurationOption>;
};
