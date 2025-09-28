import type * as ApiTypes from '../generated/ApiTypes';
import type * as RawApiTypes from '../generated/RawApiTypes';

/*
 * Localized Field Value Operations Utilities
 *
 * This module provides a unified interface for working with DatoCMS field values that may or may not be localized.
 *
 * Problem it solves:
 * In DatoCMS, fields can be either localized (containing values for multiple locales as an object like
 * `{ "en": "Hello", "it": "Ciao" }`) or non-localized (containing a single direct value like `"Hello"`).
 * When processing field data, developers need to handle both cases differently, leading to repetitive
 * conditional logic throughout the codebase.
 *
 * Why it's useful:
 * - Provides a consistent API for operations (map, filter, test, visit) regardless of localization status
 * - Eliminates the need for developers to manually check if a field is localized before processing
 * - Reduces code duplication and potential bugs from inconsistent handling
 * - Supports both synchronous and asynchronous operations
 * - Maintains the original data structure (localized fields remain localized, non-localized remain direct)
 */

/**
 * Represents a localized field value in DatoCMS.
 *
 * In DatoCMS, fields can be localized. In this scenario, their value contains values
 * for various locales structured as an object, such as
 * `{ "en": "Hello", "it": "Ciao" }`
 */
export type LocalizedFieldValue<
  T = unknown,
  L extends string = string,
> = Partial<Record<L, T>>;

/**
 * Determines whether a DatoCMS field is localized or not.
 *
 * This function handles both full Schema field objects and simplified Schema field objects
 * by checking the appropriate property based on the object structure.
 *
 * @returns true if the field is localized, false otherwise
 * @param field - The DatoCMS field definition (either full or simple schema)
 */
export function isLocalized(
  field: RawApiTypes.Field | ApiTypes.Field,
): boolean {
  return 'attributes' in field ? field.attributes.localized : field.localized;
}

export function isLocalizedFieldValue<T = unknown, L extends string = string>(
  value: unknown,
): value is LocalizedFieldValue<T, L> {
  if (typeof value !== 'object' || value === null || Array.isArray(value)) {
    return false;
  }

  const keys = Object.keys(value);

  if (keys.length === 0) {
    return false;
  }

  const localePattern =
    /^[A-Za-z]{2,4}(-[A-Za-z]{4})?(-([A-Za-z]{2}|[0-9]{3}))?$/;

  return keys.every((key) => localePattern.test(key));
}

/**
 * A normalized entry that represents a single value from either a localized or non-localized field.
 *
 * For localized fields, each locale produces one entry with `locale` set to the locale code (e.g., "en", "it").
 * For non-localized fields, there's one entry with `locale` set to `undefined`.
 *
 * This uniform structure allows the same processing logic to work with both field types.
 */
export type NormalizedFieldValueEntry<
  T = unknown,
  L extends string = string,
> = {
  locale: L | undefined;
  value: T;
};

/**
 * Converts a field value (localized or non-localized) into a uniform array of entries.
 *
 * This function normalizes the handling of field values by converting them into a consistent
 * array format, regardless of whether the field is localized or not.
 *
 * @param value - The field value to convert (either a localized object or direct value)
 * @param field - The DatoCMS field definition that determines localization behavior
 * @returns Array of entries where each entry contains a locale (string for localized, undefined for non-localized) and the corresponding value
 */
export function toNormalizedFieldValueEntries<
  T = unknown,
  L extends string = string,
>(
  value: T | LocalizedFieldValue<T, L>,
  field: RawApiTypes.Field | ApiTypes.Field,
): NormalizedFieldValueEntry<T, L>[] {
  if (isLocalized(field)) {
    const localizedValue = value as LocalizedFieldValue<T, L>;

    return Object.entries(localizedValue).map(([locale, value]) => ({
      locale: locale as L,
      value: value as T,
    }));
  }

  return [{ locale: undefined, value: value as T }];
}

/**
 * Converts an array of possibly localized entries back into the appropriate field value format.
 *
 * This function is the inverse of `toNormalizedFieldValueEntries`. It takes a uniform
 * array of entries and converts them back to either a localized object or a direct value,
 * depending on the field's localization setting.
 *
 * @param entries - Array of entries to convert back to field value format
 * @param field - The DatoCMS field definition that determines the output format
 * @returns Either a localized object (for localized fields) or the direct value (for non-localized fields)
 */
export function fromNormalizedFieldValueEntries<
  T = unknown,
  L extends string = string,
>(
  entries: NormalizedFieldValueEntry<T, L>[],
  field: RawApiTypes.Field | ApiTypes.Field,
): T | LocalizedFieldValue<T, L> {
  if (isLocalized(field)) {
    return Object.fromEntries(
      entries.map(({ locale, value }) => [locale, value]),
    ) as LocalizedFieldValue<T, L>;
  }

  if (entries.length === 0) {
    throw new Error('There must be at least one entry!');
  }

  return entries[0]!.value;
}

/**
 * Maps field values using a provided mapping function.
 * For localized fields, applies the mapping function to each locale value.
 * For non-localized fields, applies the mapping function directly to the value.
 *
 * @template T - The type that the mapping function returns
 * @param localizedOrNonLocalizedFieldValue - The field value (either localized object or direct value)
 * @param field - The DatoCMS field definition
 * @param mapFn - The function to apply to each locale value or the direct value
 * @returns The mapped value with the same structure as the input
 */
export function mapNormalizedFieldValues<
  TInput = unknown,
  TOutput = unknown,
  L extends string = string,
>(
  localizedOrNonLocalizedFieldValue: TInput | LocalizedFieldValue<TInput, L>,
  field: RawApiTypes.Field | ApiTypes.Field,
  mapFn: (locale: L | undefined, localeValue: TInput) => TOutput,
): TOutput | LocalizedFieldValue<TOutput, L> {
  const entries = toNormalizedFieldValueEntries<TInput, L>(
    localizedOrNonLocalizedFieldValue,
    field,
  );
  const mappedEntries = entries.map(({ locale, value }) => ({
    locale,
    value: mapFn(locale, value),
  }));
  return fromNormalizedFieldValueEntries<TOutput, L>(mappedEntries, field);
}

/**
 * Maps field values using a provided mapping function (async version).
 * For localized fields, applies the mapping function to each locale value.
 * For non-localized fields, applies the mapping function directly to the value.
 *
 * @template T - The type that the mapping function returns
 * @param localizedOrNonLocalizedFieldValue - The field value (either localized object or direct value)
 * @param field - The DatoCMS field definition
 * @param mapFn - The function to apply to each locale value or the direct value
 * @returns The mapped value with the same structure as the input
 */
export async function mapNormalizedFieldValuesAsync<
  TInput = unknown,
  TOutput = unknown,
  L extends string = string,
>(
  localizedOrNonLocalizedFieldValue: TInput | LocalizedFieldValue<TInput, L>,
  field: RawApiTypes.Field | ApiTypes.Field,
  mapFn: (locale: L | undefined, localeValue: TInput) => Promise<TOutput>,
): Promise<TOutput | LocalizedFieldValue<TOutput, L>> {
  const entries = toNormalizedFieldValueEntries<TInput, L>(
    localizedOrNonLocalizedFieldValue,
    field,
  );
  const mappedEntries = await Promise.all(
    entries.map(async ({ locale, value }) => ({
      locale,
      value: await mapFn(locale, value),
    })),
  );
  return fromNormalizedFieldValueEntries<TOutput, L>(mappedEntries, field);
}

/**
 * Filters field values using a provided filter function.
 * For localized fields, filters each locale value.
 * For non-localized fields, returns the value if the filter passes, otherwise undefined.
 *
 * @param localizedOrNonLocalizedFieldValue - The field value (either localized object or direct value)
 * @param field - The DatoCMS field definition
 * @param filterFn - The function to test each locale value or the direct value
 * @returns The filtered value with the same structure as the input
 */
export function filterNormalizedFieldValues<
  T = unknown,
  L extends string = string,
>(
  localizedOrNonLocalizedFieldValue: T | LocalizedFieldValue<T, L>,
  field: RawApiTypes.Field | ApiTypes.Field,
  filterFn: (locale: L | undefined, localeValue: T) => boolean,
): T | LocalizedFieldValue<T, L> | undefined {
  const entries = toNormalizedFieldValueEntries<T, L>(
    localizedOrNonLocalizedFieldValue,
    field,
  );
  const filteredEntries = entries.filter((entry) =>
    filterFn(entry.locale, entry.value),
  );

  if (isLocalized(field)) {
    return fromNormalizedFieldValueEntries<T, L>(filteredEntries, field);
  }

  return filteredEntries.length > 0 ? filteredEntries[0]?.value : undefined;
}

/**
 * Filters field values using a provided filter function (async version).
 * For localized fields, filters each locale value.
 * For non-localized fields, returns the value if the filter passes, otherwise undefined.
 *
 * @param localizedOrNonLocalizedFieldValue - The field value (either localized object or direct value)
 * @param field - The DatoCMS field definition
 * @param filterFn - The function to test each locale value or the direct value
 * @returns The filtered value with the same structure as the input
 */
export async function filterNormalizedFieldValuesAsync<
  T = unknown,
  L extends string = string,
>(
  localizedOrNonLocalizedFieldValue: T | LocalizedFieldValue<T, L>,
  field: RawApiTypes.Field | ApiTypes.Field,
  filterFn: (locale: L | undefined, localeValue: T) => Promise<boolean>,
): Promise<T | LocalizedFieldValue<T, L> | undefined> {
  const entries = toNormalizedFieldValueEntries<T, L>(
    localizedOrNonLocalizedFieldValue,
    field,
  );
  const results = await Promise.all(
    entries.map(async ({ locale, value }) => ({
      locale,
      value,
      passed: await filterFn(locale, value),
    })),
  );

  const filteredEntries = results
    .filter(({ passed }) => passed)
    .map(({ locale, value }) => ({ locale, value }));

  if (isLocalized(field)) {
    return fromNormalizedFieldValueEntries<T, L>(filteredEntries, field);
  }

  return filteredEntries.length > 0 ? filteredEntries[0]?.value : undefined;
}

/**
 * Tests whether at least one field value passes the test implemented by the provided function.
 * For localized fields, tests each locale value.
 * For non-localized fields, tests the direct value.
 *
 * @param localizedOrNonLocalizedFieldValue - The field value (either localized object or direct value)
 * @param field - The DatoCMS field definition
 * @param testFn - The function to test each locale value or the direct value
 * @returns true if at least one value passes the test, false otherwise
 */
export function someNormalizedFieldValues<
  T = unknown,
  L extends string = string,
>(
  localizedOrNonLocalizedFieldValue: T | LocalizedFieldValue<T, L>,
  field: RawApiTypes.Field | ApiTypes.Field,
  testFn: (locale: L | undefined, localeValue: T) => boolean,
): boolean {
  const entries = toNormalizedFieldValueEntries<T, L>(
    localizedOrNonLocalizedFieldValue,
    field,
  );
  return entries.some(({ locale, value }) => testFn(locale, value));
}

/**
 * Tests whether at least one field value passes the test implemented by the provided function (async version).
 * For localized fields, tests each locale value.
 * For non-localized fields, tests the direct value.
 *
 * @param localizedOrNonLocalizedFieldValue - The field value (either localized object or direct value)
 * @param field - The DatoCMS field definition
 * @param testFn - The function to test each locale value or the direct value
 * @returns true if at least one value passes the test, false otherwise
 */
export async function someNormalizedFieldValuesAsync<
  T = unknown,
  L extends string = string,
>(
  localizedOrNonLocalizedFieldValue: T | LocalizedFieldValue<T, L>,
  field: RawApiTypes.Field | ApiTypes.Field,
  testFn: (locale: L | undefined, localeValue: T) => Promise<boolean>,
): Promise<boolean> {
  const entries = toNormalizedFieldValueEntries<T, L>(
    localizedOrNonLocalizedFieldValue,
    field,
  );
  const results = await Promise.all(
    entries.map(({ locale, value }) => testFn(locale, value)),
  );
  return results.some((result) => result);
}

/**
 * Tests whether all field values pass the test implemented by the provided function.
 * For localized fields, tests each locale value.
 * For non-localized fields, tests the direct value.
 *
 * @param localizedOrNonLocalizedFieldValue - The field value (either localized object or direct value)
 * @param field - The DatoCMS field definition
 * @param testFn - The function to test each locale value or the direct value
 * @returns true if all values pass the test, false otherwise
 */
export function everyNormalizedFieldValue<
  T = unknown,
  L extends string = string,
>(
  localizedOrNonLocalizedFieldValue: T | LocalizedFieldValue<T, L>,
  field: RawApiTypes.Field | ApiTypes.Field,
  testFn: (locale: L | undefined, localeValue: T) => boolean,
): boolean {
  return !someNormalizedFieldValues(
    localizedOrNonLocalizedFieldValue,
    field,
    (locale, localeValue) => !testFn(locale, localeValue),
  );
}

/**
 * Tests whether all field values pass the test implemented by the provided function (async version).
 * For localized fields, tests each locale value.
 * For non-localized fields, tests the direct value.
 *
 * @param localizedOrNonLocalizedFieldValue - The field value (either localized object or direct value)
 * @param field - The DatoCMS field definition
 * @param testFn - The function to test each locale value or the direct value
 * @returns true if all values pass the test, false otherwise
 */
export async function everyNormalizedFieldValueAsync<
  T = unknown,
  L extends string = string,
>(
  localizedOrNonLocalizedFieldValue: T | LocalizedFieldValue<T, L>,
  field: RawApiTypes.Field | ApiTypes.Field,
  testFn: (locale: L | undefined, localeValue: T) => Promise<boolean>,
): Promise<boolean> {
  return !(await someNormalizedFieldValuesAsync(
    localizedOrNonLocalizedFieldValue,
    field,
    async (locale, localeValue) => !(await testFn(locale, localeValue)),
  ));
}

/**
 * Visits each field value with the provided function.
 * For localized fields, visits each locale value.
 * For non-localized fields, visits the direct value.
 *
 * @param value - The field value (either localized object or direct value)
 * @param field - The DatoCMS field definition
 * @param visitFn - The function to call for each locale value or the direct value
 */
export function visitNormalizedFieldValues<
  T = unknown,
  L extends string = string,
>(
  value: T | LocalizedFieldValue<T, L>,
  field: RawApiTypes.Field | ApiTypes.Field,
  visitFn: (locale: L | undefined, localeValue: T) => void,
): void {
  const entries = toNormalizedFieldValueEntries<T, L>(value, field);
  for (const { locale, value } of entries) {
    visitFn(locale, value);
  }
}

/**
 * Visits each field value with the provided function (async version).
 * For localized fields, visits each locale value.
 * For non-localized fields, visits the direct value.
 *
 * @param localizedOrNonLocalizedFieldValue - The field value (either localized object or direct value)
 * @param field - The DatoCMS field definition
 * @param visitFn - The function to call for each locale value or the direct value
 */
export async function visitNormalizedFieldValuesAsync<
  T = unknown,
  L extends string = string,
>(
  localizedOrNonLocalizedFieldValue: T | LocalizedFieldValue<T, L>,
  field: RawApiTypes.Field | ApiTypes.Field,
  visitFn: (locale: L | undefined, localeValue: T) => Promise<void>,
): Promise<void> {
  const entries = toNormalizedFieldValueEntries<T, L>(
    localizedOrNonLocalizedFieldValue,
    field,
  );
  await Promise.all(entries.map(({ locale, value }) => visitFn(locale, value)));
}
