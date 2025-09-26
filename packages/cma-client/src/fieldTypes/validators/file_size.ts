/**
 * Accept assets only within a specified file size range.
 */
export type FileSizeValidator =
  | {
      /** Numeric value for minimum filesize */
      min_value: number /** Unit for minimum filesize */;
      min_unit: 'B' | 'KB' | 'MB' /** Numeric value for maximum filesize */;
      max_value?: number /** Unit for maximum filesize */;
      max_unit?: 'B' | 'KB' | 'MB';
    }
  | {
      /** Numeric value for minimum filesize */
      min_value?: number /** Unit for minimum filesize */;
      min_unit?: 'B' | 'KB' | 'MB' /** Numeric value for maximum filesize */;
      max_value: number /** Unit for maximum filesize */;
      max_unit: 'B' | 'KB' | 'MB';
    };
