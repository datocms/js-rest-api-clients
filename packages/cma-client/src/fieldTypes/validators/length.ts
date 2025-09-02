/**
 * Accept strings only with a specified number of characters.
 */
export type LengthValidator =
  | {
      /** Minimum length */
      min: number /** Expected length */;
      eq?: number /** Maximum length */;
      max?: number;
    }
  | {
      /** Minimum length */
      min?: number /** Expected length */;
      eq: number /** Maximum length */;
      max?: number;
    }
  | {
      /** Minimum length */
      min?: number /** Expected length */;
      eq?: number /** Maximum length */;
      max: number;
    };
