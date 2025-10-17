/**
 * Checks for the presence of malicious code in HTML fields: content is valid if no dangerous code is present.
 */
export type SanitizedHtmlValidator = {
  /** Content is actively sanitized before applying the validation */
  sanitize_before_validation: boolean;
};
