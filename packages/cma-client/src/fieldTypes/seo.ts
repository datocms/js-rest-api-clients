import {
  type LocalizedFieldValue,
  isLocalizedFieldValue,
} from '../utilities/normalizedFieldValues';
import type { SeoEditorConfiguration } from './appearance/seo';
import type { DescriptionLengthValidator } from './validators/description_length';
import type { FileSizeValidator } from './validators/file_size';
import type { ImageAspectRatioValidator } from './validators/image_aspect_ratio';
import type { ImageDimensionsValidator } from './validators/image_dimensions';
import type { RequiredSeoFieldsValidator } from './validators/required_seo_fields';
import type { TitleLengthValidator } from './validators/title_length';

export type SeoFieldValue = {
  title?: string | null;
  description?: string | null;
  image?: string | null;
  twitter_card?: 'summary' | 'summary_large_image' | null;
  no_index?: boolean;
} | null;

export function isSeoFieldValue(value: unknown): value is SeoFieldValue {
  if (value === null) return true;
  return (
    typeof value === 'object' &&
    value !== null &&
    ('title' in value ||
      'description' in value ||
      'image' in value ||
      'twitter_card' in value ||
      'no_index' in value)
  );
}

export function isLocalizedSeoFieldValue(
  value: unknown,
): value is LocalizedFieldValue<SeoFieldValue> {
  return (
    isLocalizedFieldValue(value) && Object.values(value).every(isSeoFieldValue)
  );
}

export type SeoFieldValidators = {
  /** SEO field has to specify one or more properties, or it won't be valid */
  required_seo_fields?: RequiredSeoFieldsValidator;
  /** Accept assets only within a specified file size range */
  file_size?: FileSizeValidator;
  /** Accept assets only within a specified height and width range */
  image_dimensions?: ImageDimensionsValidator;
  /** Accept assets only within a specified aspect ratio range */
  image_aspect_ratio?: ImageAspectRatioValidator;
  /** Limits the length of the title for a SEO field */
  title_length?: TitleLengthValidator;
  /** Limits the length of the description for a SEO field */
  description_length?: DescriptionLengthValidator;
};

export type SeoFieldAppearance =
  | { editor: 'seo'; parameters: SeoEditorConfiguration }
  | {
      /** Plugin ID */
      editor: string;
      /** Plugin configuration */
      parameters: Record<string, unknown>;
    };
