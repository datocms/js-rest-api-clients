import BaseUpload from '../generated/resources/Upload.js';

/**
 * Legacy locale-keyed shape of an upload's `default_field_metadata`, as
 * returned and accepted by environments where the `non_localized_focal_points`
 * opt-in is inactive.
 *
 * The generated `Upload.default_field_metadata` type reflects the new
 * field-keyed shape (the path forward). This type is provided so consumers
 * targeting opted-out environments during the transition can cast the
 * response value to a structurally accurate shape.
 */
export type UploadLocaleKeyedDefaultFieldMetadata = {
  [localeCode: string]: {
    alt: string | null;
    title: string | null;
    custom_data: { [k: string]: unknown };
    focal_point: { x: number; y: number } | null;
  };
};

/**
 * Legacy locale-keyed shape accepted on `create` / `update` request bodies
 * by environments where the `non_localized_focal_points` opt-in is inactive.
 * All fields are optional, matching the partial-write contract.
 */
export type UploadLocaleKeyedDefaultFieldMetadataInRequest = {
  [localeCode: string]: {
    alt?: string | null;
    title?: string | null;
    custom_data?: { [k: string]: unknown };
    focal_point?: { x: number; y: number } | null;
  };
};

export default class UploadResource extends BaseUpload {}
