import {
  type LocalizedFieldValue,
  isLocalizedFieldValue,
} from '../utilities/normalizedFieldValues.js';
import type { MarkdownEditorConfiguration } from './appearance/markdown.js';
import type { TextareaEditorConfiguration } from './appearance/textarea.js';
import type { WysiwygEditorConfiguration } from './appearance/wysiwyg.js';
import type { FormatValidator } from './validators/format.js';
import type { SanitizedHtmlValidator } from './validators/index.js';
import type { LengthValidator } from './validators/length.js';
import type { RequiredValidator } from './validators/required.js';

export type TextFieldValue = string | null;

export function isTextFieldValue(value: unknown): value is TextFieldValue {
  return typeof value === 'string' || value === null;
}

export function isLocalizedTextFieldValue(
  value: unknown,
): value is LocalizedFieldValue<TextFieldValue> {
  return (
    isLocalizedFieldValue(value) && Object.values(value).every(isTextFieldValue)
  );
}

export type TextFieldValidators = {
  /** Value must be specified or it won't be valid */
  required?: RequiredValidator;
  /** Accept strings only with a specified number of characters */
  length?: LengthValidator;
  /** Accepts only strings that match a specified format */
  format?: FormatValidator;
  /** Checks for the presence of malicious code in HTML fields */
  sanitized_html?: SanitizedHtmlValidator;
};

export type TextFieldAppearance =
  | { editor: 'markdown'; parameters: MarkdownEditorConfiguration }
  | { editor: 'wysiwyg'; parameters: WysiwygEditorConfiguration }
  | { editor: 'textarea'; parameters: TextareaEditorConfiguration }
  | {
      /** Plugin ID */
      editor: string;
      /** Plugin configuration */
      parameters: Record<string, unknown>;
    };
