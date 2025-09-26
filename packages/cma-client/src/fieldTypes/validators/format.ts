/**
 * Accepts only strings that match a specified format.
 * Only one of `custom_pattern` or `predefined_pattern` should be specified.
 * If `custom_pattern` is used, an additional `description` parameter can be provided
 * to serve as a hint for the user with a simple explanation of the expected pattern.
 */
export type FormatValidator = {
  /** Custom regular expression for validation */
  custom_pattern?: string;
  /** Specifies a pre-defined format (email or URL) */
  predefined_pattern?: 'email' | 'url';
  /**
   * Description that serves as a hint for the user when using custom_pattern.
   * Offers a simple explanation of the expected pattern, such as "The field must end with an 's'",
   * instead of the default message like "Field must match the pattern: /s$/".
   */
  description?: string;
};
