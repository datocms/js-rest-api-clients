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
 * Builds a type guard that narrows a block to a specific model.
 *
 * Call it with the block's `itemTypeId` literal — the ID generic is inferred
 * from the argument, so no explicit type parameter is needed. The returned
 * predicate is generic: given any input type `T`, it narrows to
 * `Extract<T, { relationships: { item_type: { data: { id: Id } } } }>`. It's
 * meant to plug into `Array#filter` / `Array#find` over block-bearing fields
 * in any of these contexts:
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
 * const sessions = record.agenda.filter(isBlockOfType(SESSION_BLOCK_ID));
 * sessions[0].attributes.signup_url; // OK — narrowed
 * ```
 */
export function isBlockOfType<Id extends string>(
  itemTypeId: Id,
): <T>(block: T) => block is NarrowBlockByItemType<T, Id> {
  return <T>(block: T): block is NarrowBlockByItemType<T, Id> => {
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
}
