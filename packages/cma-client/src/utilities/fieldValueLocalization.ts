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
 *
 * Example usage:
 * ```typescript
 * // Instead of manually checking localization:
 * if (isLocalized(field)) {
 *   const result = {};
 *   for (const [locale, value] of Object.entries(fieldValue)) {
 *     result[locale] = processValue(value);
 *   }
 *   return result;
 * } else {
 *   return processValue(fieldValue);
 * }
 *
 * // Use the utility:
 * return mapLocalizedFieldValues(field, fieldValue, (locale, value) => processValue(value));
 * ```
 */

/**
 * Represents a localized field value in DatoCMS.
 *
 * In DatoCMS, fields can be localized. In this scenario, their value contains values
 * for various locales structured as an object, such as
 * `{ "en": "Hello", "it": "Ciao" }`
 */
export type LocalizedFieldValue = Record<string, unknown>;

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
export type PossiblyLocalizedEntry = {
  locale: string | undefined;
  value: unknown;
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
export function fieldValueToPossiblyLocalizedEntries(
  field: RawApiTypes.Field | ApiTypes.Field,
  value: unknown,
) {
  if (isLocalized(field)) {
    const localizedValue = value as LocalizedFieldValue;

    return Object.entries(localizedValue).map<PossiblyLocalizedEntry>(
      ([locale, value]) => ({ locale, value }),
    );
  }

  return [{ locale: undefined, value }];
}

/**
 * Converts an array of possibly localized entries back into the appropriate field value format.
 *
 * This function is the inverse of `fieldValueToPossiblyLocalizedEntries`. It takes a uniform
 * array of entries and converts them back to either a localized object or a direct value,
 * depending on the field's localization setting.
 *
 * @param field - The DatoCMS field definition that determines the output format
 * @param possiblyLocalizedEntries - Array of entries to convert back to field value format
 * @returns Either a localized object (for localized fields) or the direct value (for non-localized fields)
 */
export function possiblyLocalizedEntriesToFieldValue(
  field: RawApiTypes.Field | ApiTypes.Field,
  possiblyLocalizedEntries: PossiblyLocalizedEntry[],
) {
  if (isLocalized(field)) {
    return Object.fromEntries(
      possiblyLocalizedEntries.map(({ locale, value }) => [locale, value]),
    );
  }

  return possiblyLocalizedEntries[0]?.value;
}

/**
 * Maps localized field values using a provided mapping function.
 * For localized fields, applies the mapping function to each locale value.
 * For non-localized fields, applies the mapping function directly to the only non-localizeed value.
 *
 * @template T - The type that the mapping function returns
 * @param field - The DatoCMS field definition
 * @param value - The field value (either localized object or direct value)
 * @param mapFn - The function to apply to each locale value or the direct value
 * @returns The mapped value with the same structure as the input
 */
export function mapLocalizedFieldValues<T>(
  field: RawApiTypes.Field | ApiTypes.Field,
  value: unknown,
  mapFn: (locale: string | undefined, localeValue: unknown) => T,
) {
  const entries = fieldValueToPossiblyLocalizedEntries(field, value);
  const mappedEntries = entries.map(({ locale, value }) => ({
    locale,
    value: mapFn(locale, value),
  }));
  return possiblyLocalizedEntriesToFieldValue(field, mappedEntries);
}

/**
 * Maps localized field values using a provided mapping function (async version).
 * For localized fields, applies the mapping function to each locale value.
 * For non-localized fields, applies the mapping function directly to the only non-localizeed value.
 *
 * @template T - The type that the mapping function returns
 * @param field - The DatoCMS field definition
 * @param value - The field value (either localized object or direct value)
 * @param mapFn - The function to apply to each locale value or the direct value
 * @returns The mapped value with the same structure as the input
 */
export async function mapLocalizedFieldValuesAsync<T>(
  field: RawApiTypes.Field | ApiTypes.Field,
  value: unknown,
  mapFn: (locale: string | undefined, localeValue: unknown) => Promise<T>,
) {
  const entries = fieldValueToPossiblyLocalizedEntries(field, value);
  const mappedEntries = await Promise.all(
    entries.map(async ({ locale, value }) => ({
      locale,
      value: await mapFn(locale, value),
    })),
  );
  return possiblyLocalizedEntriesToFieldValue(field, mappedEntries);
}

/**
 * Filters localized field values using a provided filter function.
 * For localized fields, filters each locale value.
 * For non-localized fields, returns the value if the filter passes, otherwise undefined.
 *
 * @param field - The DatoCMS field definition
 * @param value - The field value (either localized object or direct value)
 * @param filterFn - The function to test each locale value or the direct value
 * @returns The filtered value with the same structure as the input
 */
export function filterLocalizedFieldValues(
  field: RawApiTypes.Field | ApiTypes.Field,
  value: unknown,
  filterFn: (locale: string | undefined, localeValue: unknown) => boolean,
) {
  const entries = fieldValueToPossiblyLocalizedEntries(field, value);
  const filteredEntries = entries.filter(({ locale, value }) =>
    filterFn(locale, value),
  );

  if (isLocalized(field)) {
    return possiblyLocalizedEntriesToFieldValue(field, filteredEntries);
  }

  return filteredEntries.length > 0 ? filteredEntries[0]?.value : undefined;
}

/**
 * Filters localized field values using a provided filter function (async version).
 * For localized fields, filters each locale value.
 * For non-localized fields, returns the value if the filter passes, otherwise undefined.
 *
 * @param field - The DatoCMS field definition
 * @param value - The field value (either localized object or direct value)
 * @param filterFn - The function to test each locale value or the direct value
 * @returns The filtered value with the same structure as the input
 */
export async function filterLocalizedFieldValuesAsync(
  field: RawApiTypes.Field | ApiTypes.Field,
  value: unknown,
  filterFn: (
    locale: string | undefined,
    localeValue: unknown,
  ) => Promise<boolean>,
) {
  const entries = fieldValueToPossiblyLocalizedEntries(field, value);
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
    return possiblyLocalizedEntriesToFieldValue(field, filteredEntries);
  }

  return filteredEntries.length > 0 ? filteredEntries[0]?.value : undefined;
}

/**
 * Tests whether at least one localized field value passes the test implemented by the provided function.
 * For localized fields, tests each locale value.
 * For non-localized fields, tests the direct value.
 *
 * @param field - The DatoCMS field definition
 * @param value - The field value (either localized object or direct value)
 * @param testFn - The function to test each locale value or the direct value
 * @returns true if at least one value passes the test, false otherwise
 */
export function someLocalizedFieldValues(
  field: RawApiTypes.Field | ApiTypes.Field,
  value: unknown,
  testFn: (locale: string | undefined, localeValue: unknown) => boolean,
): boolean {
  const entries = fieldValueToPossiblyLocalizedEntries(field, value);
  return entries.some(({ locale, value }) => testFn(locale, value));
}

/**
 * Tests whether at least one localized field value passes the test implemented by the provided function (async version).
 * For localized fields, tests each locale value.
 * For non-localized fields, tests the direct value.
 *
 * @param field - The DatoCMS field definition
 * @param value - The field value (either localized object or direct value)
 * @param testFn - The function to test each locale value or the direct value
 * @returns true if at least one value passes the test, false otherwise
 */
export async function someLocalizedFieldValuesAsync(
  field: RawApiTypes.Field | ApiTypes.Field,
  value: unknown,
  testFn: (
    locale: string | undefined,
    localeValue: unknown,
  ) => Promise<boolean>,
): Promise<boolean> {
  const entries = fieldValueToPossiblyLocalizedEntries(field, value);
  const results = await Promise.all(
    entries.map(({ locale, value }) => testFn(locale, value)),
  );
  return results.some((result) => result);
}

/**
 * Tests whether all localized field values pass the test implemented by the provided function.
 * For localized fields, tests each locale value.
 * For non-localized fields, tests the direct value.
 *
 * @param field - The DatoCMS field definition
 * @param value - The field value (either localized object or direct value)
 * @param testFn - The function to test each locale value or the direct value
 * @returns true if all values pass the test, false otherwise
 */
export function everyLocalizedFieldValues(
  field: RawApiTypes.Field | ApiTypes.Field,
  value: unknown,
  testFn: (locale: string | undefined, localeValue: unknown) => boolean,
): boolean {
  return !someLocalizedFieldValues(
    field,
    value,
    (locale, localeValue) => !testFn(locale, localeValue),
  );
}

/**
 * Tests whether all localized field values pass the test implemented by the provided function (async version).
 * For localized fields, tests each locale value.
 * For non-localized fields, tests the direct value.
 *
 * @param field - The DatoCMS field definition
 * @param value - The field value (either localized object or direct value)
 * @param testFn - The function to test each locale value or the direct value
 * @returns true if all values pass the test, false otherwise
 */
export async function everyLocalizedFieldValuesAsync(
  field: RawApiTypes.Field | ApiTypes.Field,
  value: unknown,
  testFn: (
    locale: string | undefined,
    localeValue: unknown,
  ) => Promise<boolean>,
): Promise<boolean> {
  return !(await someLocalizedFieldValuesAsync(
    field,
    value,
    async (locale, localeValue) => !(await testFn(locale, localeValue)),
  ));
}

/**
 * Visits each localized field value with the provided function.
 * For localized fields, visits each locale value.
 * For non-localized fields, visits the direct value.
 *
 * @param field - The DatoCMS field definition
 * @param value - The field value (either localized object or direct value)
 * @param visitFn - The function to call for each locale value or the direct value
 */
export function visitLocalizedFieldValues(
  field: RawApiTypes.Field | ApiTypes.Field,
  value: unknown,
  visitFn: (locale: string | undefined, localeValue: unknown) => void,
): void {
  const entries = fieldValueToPossiblyLocalizedEntries(field, value);
  for (const { locale, value } of entries) {
    visitFn(locale, value);
  }
}

/**
 * Visits each localized field value with the provided function (async version).
 * For localized fields, visits each locale value.
 * For non-localized fields, visits the direct value.
 *
 * @param field - The DatoCMS field definition
 * @param value - The field value (either localized object or direct value)
 * @param visitFn - The function to call for each locale value or the direct value
 */
export async function visitLocalizedFieldValuesAsync(
  field: RawApiTypes.Field | ApiTypes.Field,
  value: unknown,
  visitFn: (locale: string | undefined, localeValue: unknown) => Promise<void>,
): Promise<void> {
  const entries = fieldValueToPossiblyLocalizedEntries(field, value);
  await Promise.all(entries.map(({ locale, value }) => visitFn(locale, value)));
}
