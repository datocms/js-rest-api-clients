/**
 * Limits the length of the title for a SEO field.
 * Search engines usually truncate title tags to 60 characters so it is a good practice to keep the title around this length.
 */
export type TitleLengthValidator =
  | {
      /** Minimum value */ min: number /** Maximum value */;
      max?: number;
    }
  | {
      /** Minimum value */ min?: number /** Maximum value */;
      max: number;
    };
