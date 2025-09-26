/**
 * Accept assets only within a specified aspect ratio range.
 */
export type ImageAspectRatioValidator =
  | {
      /** Numerator part of the minimum aspect ratio */
      min_ar_numerator: number /** Denominator part of the minimum aspect ratio */;
      min_ar_denominator: number /** Numerator part for the required aspect ratio */;
      eq_ar_numerator?: number /** Denominator part for the required aspect ratio */;
      eq_ar_denominator?: number /** Numerator part of the maximum aspect ratio */;
      max_ar_numerator?: number /** Denominator part of the maximum aspect ratio */;
      max_ar_denominator?: number;
    }
  | {
      /** Numerator part of the minimum aspect ratio */
      min_ar_numerator?: number /** Denominator part of the minimum aspect ratio */;
      min_ar_denominator?: number /** Numerator part for the required aspect ratio */;
      eq_ar_numerator: number /** Denominator part for the required aspect ratio */;
      eq_ar_denominator: number /** Numerator part of the maximum aspect ratio */;
      max_ar_numerator?: number /** Denominator part of the maximum aspect ratio */;
      max_ar_denominator?: number;
    }
  | {
      /** Numerator part of the minimum aspect ratio */
      min_ar_numerator?: number /** Denominator part of the minimum aspect ratio */;
      min_ar_denominator?: number /** Numerator part for the required aspect ratio */;
      eq_ar_numerator?: number /** Denominator part for the required aspect ratio */;
      eq_ar_denominator?: number /** Numerator part of the maximum aspect ratio */;
      max_ar_numerator: number /** Denominator part of the maximum aspect ratio */;
      max_ar_denominator: number;
    };
