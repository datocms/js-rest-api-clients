/**
 * Accept dates only inside a specified date range.
 */
export type DateRangeValidator =
  | {
      /** Minimum date (ISO 8601 date format) */
      min: string;
      /** Maximum date (ISO 8601 date format) */
      max?: string;
    }
  | {
      /** Minimum date (ISO 8601 date format) */
      min?: string;
      /** Maximum date (ISO 8601 date format) */
      max: string;
    };
