/**
 * Accept numbers only inside a specified range.
 */
export type NumberRangeValidator =
  | {
      /** Minimum value */ min: number /** Maximum value */;
      max?: number;
    }
  | {
      /** Minimum value */ min?: number /** Maximum value */;
      max: number;
    };
