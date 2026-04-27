/**
 * Narrows a union of block shapes to the member whose model (`item_type`)
 * matches `Id`.
 *
 * Any object carrying `relationships.item_type.data.id` is narrowable —
 * that covers blocks returned from `nested: true` responses as well as the
 * object variants of request payloads (updated / newly-created blocks). The
 * bare string IDs that may appear inside request payloads (to reference
 * existing, unchanged blocks) are filtered out of the result.
 */
export type NarrowBlockByItemType<T, Id extends string> = Extract<
  T,
  { relationships: { item_type: { data: { type: 'item_type'; id: Id } } } }
>;

/**
 * Type guard that narrows a block to a specific model.
 *
 * Two call styles, same narrowing behavior:
 *
 * - Curried: `isBlockOfType(itemTypeId)` returns a predicate, ideal for
 *   `Array#filter` / `Array#find`.
 * - Direct: `isBlockOfType(itemTypeId, block)` checks a single value inline,
 *   handy inside `if` statements when you already have the block in hand.
 *
 * The ID generic is inferred from the first argument, so no explicit type
 * parameter is needed. Given any input type `T`, the result narrows to
 * `Extract<T, { relationships: { item_type: { data: { id: Id } } } }>`,
 * which covers:
 *
 * - `ItemInNestedResponse<D>` (responses with `nested: true`)
 * - `ItemCreateSchema<D>` / `ItemUpdateSchema<D>` (request payloads, object
 *   variants; plain string IDs are filtered out — there's no way to narrow
 *   them without an external lookup)
 *
 * The default (non-nested) response shape, where block fields are arrays of
 * plain string IDs, is deliberately not supported — the type information is
 * not recoverable from an ID alone.
 *
 * For the literal `Id` to be preserved (and narrowing to work), the argument
 * must be typed as a literal — use `as const` on pre-set ID constants.
 *
 * @example
 * ```ts
 * const SESSION_BLOCK_ID = 'abc123' as const;
 *
 * const record = await client.items.find<Schema.ConferenceDay>(id, { nested: true });
 *
 * // Curried — predicate for filter/find
 * const sessions = record.agenda.filter(isBlockOfType(SESSION_BLOCK_ID));
 * sessions[0].attributes.signup_url; // OK — narrowed
 *
 * // Direct — inline check on a single block
 * if (isBlockOfType(SESSION_BLOCK_ID, record.agenda[0])) {
 *   record.agenda[0].attributes.signup_url; // OK — narrowed
 * }
 * ```
 */
export function isBlockOfType<Id extends string>(
  itemTypeId: Id,
): <T>(block: T) => block is NarrowBlockByItemType<T, Id>;
export function isBlockOfType<T, Id extends string>(
  itemTypeId: Id,
  block: T,
): block is NarrowBlockByItemType<T, Id>;
export function isBlockOfType<Id extends string>(
  itemTypeId: Id,
  ...rest: [block: unknown] | []
): boolean | (<T>(block: T) => block is NarrowBlockByItemType<T, Id>) {
  const check = (block: unknown): boolean => {
    if (typeof block !== 'object' || block === null) return false;
    const relationships = (block as { relationships?: unknown }).relationships;
    if (typeof relationships !== 'object' || relationships === null)
      return false;
    const itemType = (relationships as { item_type?: unknown }).item_type;
    if (typeof itemType !== 'object' || itemType === null) return false;
    const data = (itemType as { data?: unknown }).data;
    if (typeof data !== 'object' || data === null) return false;
    return (data as { id?: unknown }).id === itemTypeId;
  };
  if (rest.length > 0) return check(rest[0]);
  return <T>(block: T): block is NarrowBlockByItemType<T, Id> => check(block);
}
