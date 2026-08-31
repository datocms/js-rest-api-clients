import type * as ApiTypes from '../generated/ApiTypes.js';
import type { Client } from '../generated/Client.js';

/**
 * Every boolean an environment reports about itself in `site.meta`: the
 * product-update opt-ins (`improved_items_listing`, `milliseconds_in_datetime`,
 * `non_localized_focal_points`, …) plus the plain state flags.
 *
 * Derived from the generated type rather than listed, so a flag added to the
 * schema is usable here as soon as the types are regenerated, with nothing to
 * keep in sync.
 */
export type EnvironmentFlag = {
  [K in keyof ApiTypes.SiteMeta]-?: boolean extends ApiTypes.SiteMeta[K]
    ? K
    : never;
}[keyof ApiTypes.SiteMeta];

/** How long a fetched `site` is reused before we ask again. */
const TTL_MS = 20 * 60 * 1000;

type Cache = { promise: Promise<ApiTypes.Site>; expiresAt: number };

/**
 * Keyed by client, so the cache covers every resource that asks and dies with
 * the client that owns it.
 */
const caches = new WeakMap<Client, Cache>();

/**
 * `site.find()`, memoized per client for {@link TTL_MS}.
 *
 * The promise is cached rather than its result, so concurrent callers share one
 * request instead of firing one each — the difference between one lookup and
 * ten thousand when a batch job starts. A failed lookup is not cached.
 *
 * Everything expires on the same clock, including flags that in practice never
 * change back: re-reading `site` every twenty minutes costs nothing next to the
 * work these clients are doing, and it means a client stays correct across an
 * activation that happens while it runs.
 */
export function fetchEnvironmentSettings(
  client: Client,
): Promise<ApiTypes.Site> {
  const cached = caches.get(client);
  const now = Date.now();

  if (cached && cached.expiresAt > now) {
    return cached.promise;
  }

  const promise = client.site.find();

  // A failed lookup must not be cached, or every later caller inherits it
  promise.catch(() => {
    if (caches.get(client)?.promise === promise) {
      caches.delete(client);
    }
  });

  caches.set(client, { promise, expiresAt: now + TTL_MS });

  return promise;
}

/**
 * Whether a `site.meta` flag is on for the environment this client talks to.
 *
 * An API predating a flag omits it from the meta entirely, which the types
 * don't admit but runtime does — so anything short of an explicit `true` reads
 * as off.
 */
export async function isEnvironmentFlagActive(
  client: Client,
  flag: EnvironmentFlag,
): Promise<boolean> {
  const site = await fetchEnvironmentSettings(client);

  return (site.meta as Partial<ApiTypes.SiteMeta> | undefined)?.[flag] === true;
}
