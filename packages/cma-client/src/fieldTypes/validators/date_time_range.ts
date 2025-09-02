/**
 * Accept date times only inside a specified date range.
 */
export type DateTimeRangeValidator =
  | {
      /** Minimum datetime (ISO 8601 datetime format) */
      min: string /** Maximum datetime (ISO 8601 datetime format) */;
      max?: string;
    }
  | {
      /** Minimum datetime (ISO 8601 datetime format) */
      min?: string /** Maximum datetime (ISO 8601 datetime format) */;
      max: string;
    };
