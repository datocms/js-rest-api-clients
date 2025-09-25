import {
  type LocalizedFieldValue,
  isLocalizedFieldValue,
} from '../utilities/normalizedFieldValues';
import type { FileEditorConfiguration } from './appearance/file';
import type { ExtensionValidator } from './validators/extension';
import type { FileSizeValidator } from './validators/file_size';
import type { ImageAspectRatioValidator } from './validators/image_aspect_ratio';
import type { ImageDimensionsValidator } from './validators/image_dimensions';
import type { RequiredValidator } from './validators/required';
import type { RequiredAltTitleValidator } from './validators/required_alt_title';

/**
 * FILE FIELD TYPE SYSTEM FOR DATOCMS
 *
 * This module defines a comprehensive type system for handling DatoCMS File fields,
 * which contain file uploads with optional metadata like alt text, title, custom data, and focal points.
 *
 * The challenge we're solving:
 * - DatoCMS File fields can have optional metadata fields (alt, title, custom_data, focal_point)
 * - For API requests, all these fields are optional and can be omitted
 * - For API responses, DatoCMS provides default values for missing fields:
 *   - alt: null
 *   - title: null
 *   - custom_data: {}
 *   - focal_point: null
 * - This creates a need for different type variants for the same conceptual data structure
 *
 * This module provides separate types for:
 * 1. API request format (optional metadata fields)
 * 2. API response format (all fields present with defaults)
 */

/**
 * =============================================================================
 * BASIC FILE TYPE - Default API response format
 * =============================================================================
 *
 * The standard File field value with all metadata fields present and default values applied.
 * This is what you get from API responses where DatoCMS has applied default values.
 */

/**
 * Basic File field value - all metadata fields present with defaults applied
 */
export type FileFieldValue = {
  upload_id: string;
  alt: string | null;
  title: string | null;
  custom_data: Record<string, unknown>;
  focal_point: {
    x: number;
    y: number;
  } | null;
} | null;

/**
 * =============================================================================
 * REQUEST VARIANT - Type for sending data TO the DatoCMS API
 * =============================================================================
 *
 * When making API requests, metadata fields are optional and can be omitted.
 * DatoCMS will apply default values for any missing fields in the response.
 */

/**
 * File field value for API requests - metadata fields are optional
 */
export type FileFieldValueInRequest = {
  upload_id: string;
  alt?: string | null;
  title?: string | null;
  custom_data?: Record<string, unknown>;
  focal_point?: {
    x: number;
    y: number;
  } | null;
} | null;

/**
 * =============================================================================
 * TYPE GUARDS - Runtime validation functions
 * =============================================================================
 */

/**
 * Type guard for basic File field values (response format with all fields present).
 * Validates that all required metadata fields are present.
 */
export function isFileFieldValue(value: unknown): value is FileFieldValue {
  if (value === null) return true;
  return (
    isLocalizedFieldValue(value) &&
    'upload_id' in value &&
    'alt' in value &&
    'title' in value &&
    'custom_data' in value &&
    'focal_point' in value
  );
}

/**
 * Type guard for File field values in API request format.
 * Allows metadata fields to be optional or omitted.
 */
export function isFileFieldValueInRequest(
  value: unknown,
): value is FileFieldValueInRequest {
  if (value === null) return true;
  return typeof value === 'object' && value !== null && 'upload_id' in value;
}

export function isLocalizedFileFieldValue(
  value: unknown,
): value is LocalizedFieldValue<FileFieldValue> {
  return (
    isLocalizedFieldValue(value) && Object.values(value).every(isFileFieldValue)
  );
}

export function isLocalizedFileFieldValueInRequest(
  value: unknown,
): value is LocalizedFieldValue<FileFieldValueInRequest> {
  return (
    isLocalizedFieldValue(value) &&
    Object.values(value).every(isFileFieldValueInRequest)
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
