/**
 * Only accept assets with specific file extensions.
 */
export type ExtensionValidator =
  | {
      /** Set of allowed file extensions */
      extensions: string[];
      predefined_list?: never;
    }
  | {
      extensions?: never;
      /** Allowed file type */
      predefined_list: 'image' | 'transformable_image' | 'video' | 'document';
    };
