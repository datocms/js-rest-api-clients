import {
  type LocalizedFieldValue,
  isLocalizedFieldValue,
} from '../utilities/normalizedFieldValues';
import type { GalleryEditorConfiguration } from './appearance/gallery';
import {
  type FileFieldValue,
  type FileFieldValueInRequest,
  isFileFieldValue,
  isFileFieldValueInRequest,
} from './file';
import type { ExtensionValidator } from './validators/extension';
import type { FileSizeValidator } from './validators/file_size';
import type { ImageAspectRatioValidator } from './validators/image_aspect_ratio';
import type { ImageDimensionsValidator } from './validators/image_dimensions';
import type { RequiredAltTitleValidator } from './validators/required_alt_title';
import type { SizeValidator } from './validators/size';

/**
 * Gallery field type system - similar to File field but for arrays.
 * See file.ts for detailed explanation of request/response duality.
 */

/**
 * Individual gallery item types - extracted from File field types
 */
export type GalleryItem = NonNullable<FileFieldValue>;
export type GalleryItemInRequest = NonNullable<FileFieldValueInRequest>;

/**
 * Gallery field value - response format with all metadata fields present
 */
export type GalleryFieldValue = Array<GalleryItem>;

/**
 * Gallery field value for API requests - metadata fields are optional
 */
export type GalleryFieldValueInRequest = Array<GalleryItemInRequest>;

/**
 * Type guard for Gallery field values - validates each item using File field validation
 */
export function isGalleryFieldValue(
  value: unknown,
): value is GalleryFieldValue {
  return Array.isArray(value) && value.every(isFileFieldValue);
}

/**
 * Type guard for Gallery field values in API request format
 */
export function isGalleryFieldValueInRequest(
  value: unknown,
): value is GalleryFieldValueInRequest {
  return Array.isArray(value) && value.every(isFileFieldValueInRequest);
}

export function isLocalizedGalleryFieldValue(
  value: unknown,
): value is LocalizedFieldValue<GalleryFieldValue> {
  return (
    isLocalizedFieldValue(value) &&
    Object.values(value).every(isGalleryFieldValue)
  );
}

export function isLocalizedGalleryFieldValueInRequest(
  value: unknown,
): value is LocalizedFieldValue<GalleryFieldValueInRequest> {
  return (
    isLocalizedFieldValue(value) &&
    Object.values(value).every(isGalleryFieldValueInRequest)
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
