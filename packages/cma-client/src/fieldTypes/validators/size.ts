/**
 * Only accept a number of items within the specified range.
 */
export type SizeValidator =
  | {
      /** Minimum length */
      min: number /** Expected length */;
      eq?: number /** Maximum length */;
      max?: number /** The number of items must be multiple of this value */;
      multiple_of?: number;
    }
  | {
      /** Minimum length */
      min?: number /** Expected length */;
      eq: number /** Maximum length */;
      max?: number /** The number of items must be multiple of this value */;
      multiple_of?: number;
    }
  | {
      /** Minimum length */
      min?: number /** Expected length */;
      eq?: number /** Maximum length */;
      max: number /** The number of items must be multiple of this value */;
      multiple_of?: number;
    }
  | {
      /** Minimum length */
      min?: number /** Expected length */;
      eq?: number /** Maximum length */;
      max?: number /** The number of items must be multiple of this value */;
      multiple_of: number;
    };
