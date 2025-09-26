/**
 * Only accept slugs having a specific format.
 */
export type SlugFormatValidator =
  | {
      /** Regular expression to be validated */
      custom_pattern: string;
      predefined_pattern?: never;
    }
  | {
      custom_pattern?: never;
      /** Allowed format */
      predefined_pattern: 'webpage_slug';
    };
