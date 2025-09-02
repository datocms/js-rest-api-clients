/**
 * Limits the length of the description for a SEO field.
 * Search engines usually truncate description tags to 160 characters so it is a good practice to keep the description around this length.
 */
export type DescriptionLengthValidator =
  | {
      /** Minimum value */ min: number /** Maximum value */;
      max?: number;
    }
  | {
      /** Minimum value */ min?: number /** Maximum value */;
      max: number;
    };
