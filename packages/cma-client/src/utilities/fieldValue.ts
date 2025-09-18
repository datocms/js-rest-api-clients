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
> = Record<L, T>;

/**
 * Determines whether a DatoCMS field is localized or not.
 *
 * This function handles both full Schema field objects and simplified Schema field objects
 * by checking the appropriate property based on the object structure.
 *
 * @param field - The DatoCMS field definition (either full or simple schema)
 * @returns true if the field is localized, false otherwise
 */
export function isLocalized(
  field: RawApiTypes.Field | ApiTypes.Field,
): boolean {
  return 'attributes' in field ? field.attributes.localized : field.localized;
}

/**
 * A normalized entry that represents a single value from either a localized or non-localized field.
 *
 * For localized fields, each locale produces one entry with `locale` set to the locale code (e.g., "en", "it").
 * For non-localized fields, there's one entry with `locale` set to `undefined`.
 *
 * This uniform structure allows the same processing logic to work with both field types.
 */
export type FieldValueEntry<T = unknown, L extends string = string> = {
  locale: L | undefined;
  value: T;
};

/**
 * Converts a field value (localized or non-localized) into a uniform array of entries.
 *
 * This function normalizes the handling of field values by converting them into a consistent
 * array format, regardless of whether the field is localized or not.
 *
 * @param field - The DatoCMS field definition that determines localization behavior
 * @param value - The field value to convert (either a localized object or direct value)
 * @returns Array of entries where each entry contains a locale (string for localized, undefined for non-localized) and the corresponding value
 */
export function fieldValueToEntries<T = unknown, L extends string = string>(
  field: RawApiTypes.Field | ApiTypes.Field,
  value: T | LocalizedFieldValue<T, L>,
): FieldValueEntry<T, L>[] {
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
 * This function is the inverse of `fieldValueToEntries`. It takes a uniform
 * array of entries and converts them back to either a localized object or a direct value,
 * depending on the field's localization setting.
 *
 * @param field - The DatoCMS field definition that determines the output format
 * @param entries - Array of entries to convert back to field value format
 * @returns Either a localized object (for localized fields) or the direct value (for non-localized fields)
 */
export function entriesToFieldValue<T = unknown, L extends string = string>(
  field: RawApiTypes.Field | ApiTypes.Field,
  entries: FieldValueEntry<T, L>[],
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
 * @param field - The DatoCMS field definition
 * @param value - The field value (either localized object or direct value)
 * @param mapFn - The function to apply to each locale value or the direct value
 * @returns The mapped value with the same structure as the input
 */
export function mapFieldValue<
  TInput = unknown,
  TOutput = unknown,
  L extends string = string,
>(
  field: RawApiTypes.Field | ApiTypes.Field,
  value: TInput | LocalizedFieldValue<TInput, L>,
  mapFn: (locale: L | undefined, localeValue: TInput) => TOutput,
): TOutput | LocalizedFieldValue<TOutput, L> {
  const entries = fieldValueToEntries<TInput, L>(field, value);
  const mappedEntries = entries.map(({ locale, value }) => ({
    locale,
    value: mapFn(locale, value),
  }));
  return entriesToFieldValue<TOutput, L>(field, mappedEntries);
}

/**
 * Maps field values using a provided mapping function (async version).
 * For localized fields, applies the mapping function to each locale value.
 * For non-localized fields, applies the mapping function directly to the value.
 *
 * @template T - The type that the mapping function returns
 * @param field - The DatoCMS field definition
 * @param value - The field value (either localized object or direct value)
 * @param mapFn - The function to apply to each locale value or the direct value
 * @returns The mapped value with the same structure as the input
 */
export async function mapFieldValueAsync<
  TInput = unknown,
  TOutput = unknown,
  L extends string = string,
>(
  field: RawApiTypes.Field | ApiTypes.Field,
  value: TInput | LocalizedFieldValue<TInput, L>,
  mapFn: (locale: L | undefined, localeValue: TInput) => Promise<TOutput>,
): Promise<TOutput | LocalizedFieldValue<TOutput, L>> {
  const entries = fieldValueToEntries<TInput, L>(field, value);
  const mappedEntries = await Promise.all(
    entries.map(async ({ locale, value }) => ({
      locale,
      value: await mapFn(locale, value),
    })),
  );
  return entriesToFieldValue<TOutput, L>(field, mappedEntries);
}

/**
 * Filters field values using a provided filter function.
 * For localized fields, filters each locale value.
 * For non-localized fields, returns the value if the filter passes, otherwise undefined.
 *
 * @param field - The DatoCMS field definition
 * @param value - The field value (either localized object or direct value)
 * @param filterFn - The function to test each locale value or the direct value
 * @returns The filtered value with the same structure as the input
 */
export function filterFieldValue<T = unknown, L extends string = string>(
  field: RawApiTypes.Field | ApiTypes.Field,
  value: T | LocalizedFieldValue<T, L>,
  filterFn: (locale: L | undefined, localeValue: T) => boolean,
): T | LocalizedFieldValue<T, L> | undefined {
  const entries = fieldValueToEntries<T, L>(field, value);
  const filteredEntries = entries.filter((entry) =>
    filterFn(entry.locale, entry.value),
  );

  if (isLocalized(field)) {
    return entriesToFieldValue<T, L>(field, filteredEntries);
  }

  return filteredEntries.length > 0 ? filteredEntries[0]?.value : undefined;
}

/**
 * Filters field values using a provided filter function (async version).
 * For localized fields, filters each locale value.
 * For non-localized fields, returns the value if the filter passes, otherwise undefined.
 *
 * @param field - The DatoCMS field definition
 * @param value - The field value (either localized object or direct value)
 * @param filterFn - The function to test each locale value or the direct value
 * @returns The filtered value with the same structure as the input
 */
export async function filterFieldValueAsync<
  T = unknown,
  L extends string = string,
>(
  field: RawApiTypes.Field | ApiTypes.Field,
  value: T | LocalizedFieldValue<T, L>,
  filterFn: (locale: L | undefined, localeValue: T) => Promise<boolean>,
): Promise<T | LocalizedFieldValue<T, L> | undefined> {
  const entries = fieldValueToEntries<T, L>(field, value);
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
    return entriesToFieldValue<T, L>(field, filteredEntries);
  }

  return filteredEntries.length > 0 ? filteredEntries[0]?.value : undefined;
}

/**
 * Tests whether at least one field value passes the test implemented by the provided function.
 * For localized fields, tests each locale value.
 * For non-localized fields, tests the direct value.
 *
 * @param field - The DatoCMS field definition
 * @param value - The field value (either localized object or direct value)
 * @param testFn - The function to test each locale value or the direct value
 * @returns true if at least one value passes the test, false otherwise
 */
export function someFieldValue<T = unknown, L extends string = string>(
  field: RawApiTypes.Field | ApiTypes.Field,
  value: T | LocalizedFieldValue<T, L>,
  testFn: (locale: L | undefined, localeValue: T) => boolean,
): boolean {
  const entries = fieldValueToEntries<T, L>(field, value);
  return entries.some(({ locale, value }) => testFn(locale, value));
}

/**
 * Tests whether at least one field value passes the test implemented by the provided function (async version).
 * For localized fields, tests each locale value.
 * For non-localized fields, tests the direct value.
 *
 * @param field - The DatoCMS field definition
 * @param value - The field value (either localized object or direct value)
 * @param testFn - The function to test each locale value or the direct value
 * @returns true if at least one value passes the test, false otherwise
 */
export async function someFieldValueAsync<
  T = unknown,
  L extends string = string,
>(
  field: RawApiTypes.Field | ApiTypes.Field,
  value: T | LocalizedFieldValue<T, L>,
  testFn: (locale: L | undefined, localeValue: T) => Promise<boolean>,
): Promise<boolean> {
  const entries = fieldValueToEntries<T, L>(field, value);
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
 * @param field - The DatoCMS field definition
 * @param value - The field value (either localized object or direct value)
 * @param testFn - The function to test each locale value or the direct value
 * @returns true if all values pass the test, false otherwise
 */
export function everyFieldValue<T = unknown, L extends string = string>(
  field: RawApiTypes.Field | ApiTypes.Field,
  value: T | LocalizedFieldValue<T, L>,
  testFn: (locale: L | undefined, localeValue: T) => boolean,
): boolean {
  return !someFieldValue(
    field,
    value,
    (locale, localeValue) => !testFn(locale, localeValue),
  );
}

/**
 * Tests whether all field values pass the test implemented by the provided function (async version).
 * For localized fields, tests each locale value.
 * For non-localized fields, tests the direct value.
 *
 * @param field - The DatoCMS field definition
 * @param value - The field value (either localized object or direct value)
 * @param testFn - The function to test each locale value or the direct value
 * @returns true if all values pass the test, false otherwise
 */
export async function everyFieldValueAsync<
  T = unknown,
  L extends string = string,
>(
  field: RawApiTypes.Field | ApiTypes.Field,
  value: T | LocalizedFieldValue<T, L>,
  testFn: (locale: L | undefined, localeValue: T) => Promise<boolean>,
): Promise<boolean> {
  return !(await someFieldValueAsync(
    field,
    value,
    async (locale, localeValue) => !(await testFn(locale, localeValue)),
  ));
}

/**
 * Visits each field value with the provided function.
 * For localized fields, visits each locale value.
 * For non-localized fields, visits the direct value.
 *
 * @param field - The DatoCMS field definition
 * @param value - The field value (either localized object or direct value)
 * @param visitFn - The function to call for each locale value or the direct value
 */
export function visitFieldValue<T = unknown, L extends string = string>(
  field: RawApiTypes.Field | ApiTypes.Field,
  value: T | LocalizedFieldValue<T, L>,
  visitFn: (locale: L | undefined, localeValue: T) => void,
): void {
  const entries = fieldValueToEntries<T, L>(field, value);
  for (const { locale, value } of entries) {
    visitFn(locale, value);
  }
}

/**
 * Visits each field value with the provided function (async version).
 * For localized fields, visits each locale value.
 * For non-localized fields, visits the direct value.
 *
 * @param field - The DatoCMS field definition
 * @param value - The field value (either localized object or direct value)
 * @param visitFn - The function to call for each locale value or the direct value
 */
export async function visitFieldValueAsync<
  T = unknown,
  L extends string = string,
>(
  field: RawApiTypes.Field | ApiTypes.Field,
  value: T | LocalizedFieldValue<T, L>,
  visitFn: (locale: L | undefined, localeValue: T) => Promise<void>,
): Promise<void> {
  const entries = fieldValueToEntries<T, L>(field, value);
  await Promise.all(entries.map(({ locale, value }) => visitFn(locale, value)));
}
