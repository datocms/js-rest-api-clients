import type { LocalizedFieldValue } from '../utilities/fieldValue';
import type { FileEditorConfiguration } from './appearance/file';
import type { ExtensionValidator } from './validators/extension';
import type { FileSizeValidator } from './validators/file_size';
import type { ImageAspectRatioValidator } from './validators/image_aspect_ratio';
import type { ImageDimensionsValidator } from './validators/image_dimensions';
import type { RequiredValidator } from './validators/required';
import type { RequiredAltTitleValidator } from './validators/required_alt_title';

export type FileFieldValue = {
  upload_id: string;
  alt?: string | null;
  title?: string | null;
  custom_data?: Record<string, unknown>;
  focal_point?: {
    x: number;
    y: number;
  } | null;
} | null;

export function isFileFieldValue(value: unknown): value is FileFieldValue {
  if (value === null) return true;
  return typeof value === 'object' && value !== null && 'upload_id' in value;
}

export function isLocalizedFileFieldValue(
  value: unknown,
): value is LocalizedFieldValue<FileFieldValue> {
  return (
    typeof value === 'object' &&
    value !== null &&
    Object.values(value).every(isFileFieldValue)
  );
}

export type FileFieldValidators = {
  /** Value must be specified or it won't be valid */
  required?: RequiredValidator;
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

export type FileFieldAppearance =
  | { editor: 'file'; parameters: FileEditorConfiguration }
  | {
      /** Plugin ID */
      editor: string;
      /** Plugin configuration */
      parameters: Record<string, unknown>;
    };
