/**
 * Accept assets only within a specified height and width range.
 */
export type ImageDimensionsValidator =
  | {
      /** Numeric value for minimum width */
      width_min_value: number /** Numeric value for maximum width */;
      width_max_value?: number /** Numeric value for minimum height */;
      height_min_value?: number /** Numeric value for maximum height */;
      height_max_value?: number;
    }
  | {
      /** Numeric value for minimum width */
      width_min_value?: number /** Numeric value for maximum width */;
      width_max_value: number /** Numeric value for minimum height */;
      height_min_value?: number /** Numeric value for maximum height */;
      height_max_value?: number;
    }
  | {
      /** Numeric value for minimum width */
      width_min_value?: number /** Numeric value for maximum width */;
      width_max_value?: number /** Numeric value for minimum height */;
      height_min_value: number /** Numeric value for maximum height */;
      height_max_value?: number;
    }
  | {
      /** Numeric value for minimum width */
      width_min_value?: number /** Numeric value for maximum width */;
      width_max_value?: number /** Numeric value for minimum height */;
      height_min_value?: number /** Numeric value for maximum height */;
      height_max_value: number;
    };
