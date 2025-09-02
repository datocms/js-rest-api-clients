/**
 * Assets contained in the field are required to specify custom title or alternate text, or they won't be valid.
 */
export type RequiredAltTitleValidator =
  | {
      /** Whether the title for the asset must be specified */
      title: boolean /** Whether the alternate text for the asset must be specified */;
      alt?: boolean;
    }
  | {
      /** Whether the title for the asset must be specified */
      title?: boolean /** Whether the alternate text for the asset must be specified */;
      alt: boolean;
    };
