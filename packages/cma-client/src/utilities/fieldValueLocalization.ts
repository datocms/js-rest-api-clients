import type * as SchemaTypes from '../generated/SchemaTypes';
import type * as SimpleSchemaTypes from '../generated/SimpleSchemaTypes';

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
 * In DatoCMS, fields can be localized. In this scenario, their value contains values 
 * for various locales structured as an object, such as
 `{ "en": "Hello", "it": "Ciao" }`)
 */
export type LocalizedFieldValue = Record<string, unknown>;

export function isLocalized(
  field: SchemaTypes.Field | SimpleSchemaTypes.Field,
): boolean {
  return 'attributes' in field ? field.attributes.localized : field.localized;
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
  field: SchemaTypes.Field | SimpleSchemaTypes.Field,
  value: unknown,
  mapFn: (locale: string | undefined, localeValue: unknown) => T,
) {
  if (isLocalized(field)) {
    const localizedValue = value as LocalizedFieldValue;

    return Object.fromEntries(
      Object.entries(localizedValue).map(([locale, value]) => [
        locale,
        mapFn(locale, value),
      ]),
    );
  }

  return mapFn(undefined, value);
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
  field: SchemaTypes.Field | SimpleSchemaTypes.Field,
  value: unknown,
  mapFn: (locale: string | undefined, localeValue: unknown) => Promise<T>,
) {
  if (isLocalized(field)) {
    const localizedValue = value as LocalizedFieldValue;

    return Object.fromEntries(
      await Promise.all(
        Object.entries(localizedValue).map<Promise<[string, unknown]>>(
          async ([locale, value]) => [locale, await mapFn(locale, value)],
        ),
      ),
    );
  }

  return await mapFn(undefined, value);
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
  field: SchemaTypes.Field | SimpleSchemaTypes.Field,
  value: unknown,
  filterFn: (locale: string | undefined, localeValue: unknown) => boolean,
) {
  if (isLocalized(field)) {
    const localizedValue = value as LocalizedFieldValue;

    return Object.fromEntries(
      Object.entries(localizedValue).filter(([locale, value]) =>
        filterFn(locale, value),
      ),
    );
  }

  return filterFn(undefined, value) ? value : undefined;
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
  field: SchemaTypes.Field | SimpleSchemaTypes.Field,
  value: unknown,
  filterFn: (
    locale: string | undefined,
    localeValue: unknown,
  ) => Promise<boolean>,
) {
  if (isLocalized(field)) {
    const localizedValue = value as LocalizedFieldValue;

    const results = await Promise.all(
      Object.entries(localizedValue).map<Promise<[string, unknown, boolean]>>(
        async ([locale, value]) => [
          locale,
          value,
          await filterFn(locale, value),
        ],
      ),
    );

    return Object.fromEntries(
      results
        .filter(([, , passed]) => passed)
        .map(([locale, value]) => [locale, value]),
    );
  }

  return (await filterFn(undefined, value)) ? value : undefined;
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
  field: SchemaTypes.Field | SimpleSchemaTypes.Field,
  value: unknown,
  testFn: (locale: string | undefined, localeValue: unknown) => boolean,
): boolean {
  if (isLocalized(field)) {
    const localizedValue = value as LocalizedFieldValue;

    return Object.entries(localizedValue).some(([locale, value]) =>
      testFn(locale, value),
    );
  }

  return testFn(undefined, value);
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
  field: SchemaTypes.Field | SimpleSchemaTypes.Field,
  value: unknown,
  testFn: (
    locale: string | undefined,
    localeValue: unknown,
  ) => Promise<boolean>,
): Promise<boolean> {
  if (isLocalized(field)) {
    const localizedValue = value as LocalizedFieldValue;

    const results = await Promise.all(
      Object.entries(localizedValue).map(
        async ([locale, value]) => await testFn(locale, value),
      ),
    );

    return results.some((result) => result);
  }

  return await testFn(undefined, value);
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
  field: SchemaTypes.Field | SimpleSchemaTypes.Field,
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
  field: SchemaTypes.Field | SimpleSchemaTypes.Field,
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
  field: SchemaTypes.Field | SimpleSchemaTypes.Field,
  value: unknown,
  visitFn: (locale: string | undefined, localeValue: unknown) => void,
): void {
  if (isLocalized(field)) {
    const localizedValue = value as LocalizedFieldValue;

    for (const [locale, value] of Object.entries(localizedValue)) {
      visitFn(locale, value);
    }
  } else {
    visitFn(undefined, value);
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
  field: SchemaTypes.Field | SimpleSchemaTypes.Field,
  value: unknown,
  visitFn: (locale: string | undefined, localeValue: unknown) => Promise<void>,
): Promise<void> {
  if (isLocalized(field)) {
    const localizedValue = value as LocalizedFieldValue;

    await Promise.all(
      Object.entries(localizedValue).map(
        async ([locale, value]) => await visitFn(locale, value),
      ),
    );
  } else {
    await visitFn(undefined, value);
  }
}
