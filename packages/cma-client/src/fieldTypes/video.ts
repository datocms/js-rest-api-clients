import {
  type LocalizedFieldValue,
  isLocalizedFieldValue,
} from '../utilities/normalizedFieldValues';
import type { VideoEditorConfiguration } from './appearance/video';
import type { RequiredValidator } from './validators/required';

export type VideoFieldValue = {
  provider: 'youtube' | 'vimeo' | 'facebook';
  provider_uid: string;
  url: string;
  width: number;
  height: number;
  thumbnail_url: string;
  title: string;
} | null;

export function isVideoFieldValue(value: unknown): value is VideoFieldValue {
  if (value === null) return true;
  return (
    typeof value === 'object' &&
    value !== null &&
    'provider' in value &&
    'provider_uid' in value &&
    'url' in value
  );
}

export function isLocalizedVideoFieldValue(
  value: unknown,
): value is LocalizedFieldValue<VideoFieldValue> {
  return (
    isLocalizedFieldValue(value) &&
    Object.values(value).every(isVideoFieldValue)
  );
}

export type VideoFieldValidators = {
  /** Value must be specified or it won't be valid */
  required?: RequiredValidator;
};

export type VideoFieldAppearance =
  | { editor: 'video'; parameters: VideoEditorConfiguration }
  | {
      /** Plugin ID */
      editor: string;
      /** Plugin configuration */
      parameters: Record<string, unknown>;
    };
