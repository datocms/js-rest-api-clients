import type { LocalizedFieldValue } from '../utilities/fieldValue';
import type { GalleryEditorConfiguration } from './appearance/gallery';
import type { ExtensionValidator } from './validators/extension';
import type { FileSizeValidator } from './validators/file_size';
import type { ImageAspectRatioValidator } from './validators/image_aspect_ratio';
import type { ImageDimensionsValidator } from './validators/image_dimensions';
import type { RequiredAltTitleValidator } from './validators/required_alt_title';
import type { SizeValidator } from './validators/size';

export type GalleryFieldValue = Array<{
  upload_id: string;
  alt?: string | null;
  title?: string | null;
  custom_data?: Record<string, unknown>;
  focal_point?: {
    x: number;
    y: number;
  } | null;
}>;

export function isGalleryFieldValue(
  value: unknown,
): value is GalleryFieldValue {
  return (
    Array.isArray(value) &&
    value.every(
      (item) =>
        typeof item === 'object' && item !== null && 'upload_id' in item,
    )
  );
}

export function isLocalizedGalleryFieldValue(
  value: unknown,
): value is LocalizedFieldValue<GalleryFieldValue> {
  return (
    typeof value === 'object' &&
    value !== null &&
    Object.values(value).every(isGalleryFieldValue)
  );
}

export type GalleryFieldValidators = {
  /** Only accept a number of items within the specified range */
  size?: SizeValidator;
  /** Accept assets only within a specified file size range */
  file_size?: FileSizeValidator;
  /** Accept assets only within a specified height and width range */
  image_dimensions?: ImageDimensionsValidator;
  /** Accept assets only within a specified aspect ratio range */
  image_aspect_ratio?: ImageAspectRatioValidator;
  /** Only accept assets with specific file extensions */
  extension?: ExtensionValidator;
  /** Assets contained in the field are required to specify custom title or alternate text */
  required_alt_title?: RequiredAltTitleValidator;
};

export type GalleryFieldAppearance =
  | { editor: 'gallery'; parameters: GalleryEditorConfiguration }
  | {
      /** Plugin ID */
      editor: string;
      /** Plugin configuration */
      parameters: Record<string, unknown>;
    };
