import type * as ApiTypes from '../generated/ApiTypes.js';
import type { Client } from '../generated/Client.js';
import {
  fetchEnvironmentSettings,
  isEnvironmentFlagActive,
} from './environmentSettings.js';

/**
 * Legacy locale-keyed shape of an upload's `default_field_metadata`, as
 * returned and accepted by environments where the `non_localized_focal_points`
 * opt-in is inactive.
 *
 * The `uploads` resource converts to and from this shape on your behalf, so you
 * only ever see the field-keyed one. The type is exported for those working at
 * the raw layer, which performs no conversion.
 */
export type UploadLocaleKeyedDefaultFieldMetadata = {
  [localeCode: string]: {
    alt: string | null;
    title: string | null;
    custom_data: { [k: string]: unknown };
    focal_point: { x: number; y: number } | null;
    poster_time: number | null;
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
    poster_time?: number | null;
  };
};

export type DefaultFieldMetadata = ApiTypes.Upload['default_field_metadata'];

export type DefaultFieldMetadataInRequest = NonNullable<
  ApiTypes.UploadUpdateSchema['default_field_metadata']
>;

/**
 * Tells the two wire shapes apart. A field-keyed payload always carries a
 * top-level `focal_point`, and a locale-keyed one never can: its keys are
 * locale codes, and no locale code is the literal string `focal_point`.
 */
export function isFieldKeyed(
  metadata: DefaultFieldMetadata | UploadLocaleKeyedDefaultFieldMetadata,
): metadata is DefaultFieldMetadata {
  return 'focal_point' in metadata;
}

/**
 * Collapses a legacy response payload into the field-keyed shape. The API
 * replicates the non-localized values into every locale entry on read, so every
 * entry carries the same value and the first one is enough.
 */
export function fromLocaleKeyed(
  byLocale: UploadLocaleKeyedDefaultFieldMetadata,
): DefaultFieldMetadata {
  const alt: Record<string, string | null> = {};
  const title: Record<string, string | null> = {};
  const customData: Record<string, { [k: string]: unknown }> = {};

  let focalPoint: { x: number; y: number } | null = null;
  let posterTime: number | null = null;
  let seenAnEntry = false;

  for (const [locale, entry] of Object.entries(byLocale)) {
    alt[locale] = entry.alt;
    title[locale] = entry.title;
    customData[locale] = entry.custom_data;

    if (!seenAnEntry) {
      seenAnEntry = true;
      focalPoint = entry.focal_point;
      posterTime = entry.poster_time;
    }
  }

  return {
    alt,
    title,
    custom_data: customData,
    focal_point: focalPoint,
    poster_time: posterTime,
  };
}

/**
 * Rewrites a field-keyed patch into the legacy locale-keyed one: the localized
 * keys are pivoted per locale, and the non-localized ones ride along on a
 * single entry. The API takes `focal_point` / `poster_time` off the first entry
 * that carries one and ignores the rest, so writing them once is enough — on
 * any locale the patch already touches, or the environment's first one when it
 * touches none.
 */
export function toLocaleKeyed(
  {
    alt,
    title,
    custom_data,
    focal_point,
    poster_time,
  }: DefaultFieldMetadataInRequest,
  environmentLocales: string[],
): UploadLocaleKeyedDefaultFieldMetadataInRequest {
  const result: UploadLocaleKeyedDefaultFieldMetadataInRequest = {};

  function entryFor(locale: string) {
    const entry = result[locale] ?? {};
    result[locale] = entry;
    return entry;
  }

  for (const [locale, value] of Object.entries(alt ?? {})) {
    entryFor(locale).alt = value;
  }

  for (const [locale, value] of Object.entries(title ?? {})) {
    entryFor(locale).title = value;
  }

  for (const [locale, value] of Object.entries(custom_data ?? {})) {
    entryFor(locale).custom_data = value;
  }

  if (focal_point !== undefined || poster_time !== undefined) {
    const locale = Object.keys(result)[0] ?? environmentLocales[0];

    if (locale) {
      if (focal_point !== undefined) entryFor(locale).focal_point = focal_point;
      if (poster_time !== undefined) entryFor(locale).poster_time = poster_time;
    }
  }

  return result;
}

/**
 * Normalizes an upload as served by the API into the field-keyed shape the
 * `Upload` type describes. Returns the entity untouched — no copy — when it is
 * already field-keyed, which is the case for every environment that has taken
 * the opt-in.
 */
export function normalizeUpload(upload: ApiTypes.Upload): ApiTypes.Upload {
  const metadata = upload.default_field_metadata;

  if (!metadata || isFieldKeyed(metadata)) {
    return upload;
  }

  return { ...upload, default_field_metadata: fromLocaleKeyed(metadata) };
}

/**
 * Encodes a `create` / `update` body into the shape the environment accepts.
 *
 * The environment is only consulted when there is metadata to encode, so a
 * client that never writes asset metadata never asks — and when it does ask,
 * the lookup is memoized and shared, so a batch of writes pays for one.
 */
export async function encodeDefaultFieldMetadata<
  T extends { default_field_metadata?: DefaultFieldMetadataInRequest },
>(client: Client, body: T): Promise<T> {
  const metadata = body.default_field_metadata;

  if (!metadata) {
    return body;
  }

  if (await isEnvironmentFlagActive(client, 'non_localized_focal_points')) {
    return body;
  }

  const { locales } = await fetchEnvironmentSettings(client);

  return {
    ...body,
    // The declared type describes the field-keyed shape, which is what callers
    // write. The legacy payload is this module's business.
    default_field_metadata: toLocaleKeyed(
      metadata,
      locales,
    ) as unknown as DefaultFieldMetadataInRequest,
  };
}
