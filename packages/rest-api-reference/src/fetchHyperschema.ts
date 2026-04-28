import $RefParser from '@apidevtools/json-schema-ref-parser';
import type { Hyperschema } from './types.js';

const KNOWN_URLS: Record<string, string> = {
  cma: 'https://site-api.datocms.com/docs/site-api-hyperschema.json',
  dashboard: 'https://site-api.datocms.com/docs/account-api-hyperschema.json',
};

/**
 * Fetches and dereferences a DatoCMS REST API hyperschema.
 *
 * Pass `"cma"` or `"dashboard"` as a shorthand, or a full URL.
 * All `$ref` pointers are resolved in-place so the returned object is fully
 * self-contained.
 */
export async function fetchHyperschema(
  apiOrUrl: 'cma' | 'dashboard' | (string & {}),
): Promise<Hyperschema> {
  const url = KNOWN_URLS[apiOrUrl] || apiOrUrl;

  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(
      `Failed to fetch hyperschema from ${url}: ${response.status} ${response.statusText}`,
    );
  }

  const raw = await response.json();
  const schema = await $RefParser.dereference(raw);

  return schema as Hyperschema;
}
