import type * as ApiTypes from '../generated/ApiTypes.js';
import type * as RawApiTypes from '../generated/RawApiTypes.js';
import type { ToItemAttributesInRequest } from '../utilities/itemDefinition.js';

type ItemTypeDefinitionOf<T> = T extends ApiTypes.Item<infer D>
  ? D
  : T extends ApiTypes.ItemInNestedResponse<infer D>
    ? D
    : T extends RawApiTypes.Item<infer D>
      ? D
      : T extends RawApiTypes.ItemInNestedResponse<infer D>
        ? D
        : never;

/**
 * Given a record or block you've read from the CMA and one of its field keys,
 * resolves to the type you'd send back when writing that field — for example,
 * inside the payload of `client.items.update`.
 *
 * Reach for it when you're rebuilding a field value piece-by-piece (typically
 * an array of blocks or links) and want a type for the variable you're
 * collecting into, without restating the field's shape by hand.
 *
 * The first parameter accepts any item-shaped value the CMA produces:
 * top-level records as well as nested blocks inside a parent record's
 * modular-content / structured-text / single-block field.
 *
 * The resulting type preserves `null`. Every CMA field can be cleared by
 * sending `null`, so the type reflects that.
 *
 * @example
 * // Read a record with nested blocks, edit one block, write the whole field
 * // back to the CMA.
 * const page = await client.items.find<LandingPage>(id, { nested: true });
 *
 * const sections: NonNullable<FieldValueInRequest<typeof page, 'sections'>> = [];
 *
 * for (const block of page.sections) {
 *   if (isBlockOfType(HeroBlock.ID, block)) {
 *     sections.push(buildBlockRecord<HeroBlock>({ id: block.id, title: 'New' }));
 *   } else {
 *     sections.push(block.id);
 *   }
 * }
 *
 * await client.items.update<LandingPage>(page.id, { sections });
 */
export type FieldValueInRequest<
  T,
  K extends keyof ToItemAttributesInRequest<ItemTypeDefinitionOf<T>>,
> = K extends keyof ToItemAttributesInRequest<ItemTypeDefinitionOf<T>>
  ? Required<ToItemAttributesInRequest<ItemTypeDefinitionOf<T>>>[K]
  : never;

export * from './appearance/index.js';
export * from './boolean.js';
export * from './color.js';
export * from './date.js';
export * from './date_time.js';
export * from './file.js';
export * from './float.js';
export * from './gallery.js';
export * from './integer.js';
export * from './json.js';
export * from './lat_lon.js';
export * from './link.js';
export * from './links.js';
export * from './rich_text.js';
export * from './seo.js';
export * from './single_block.js';
export * from './slug.js';
export * from './string.js';
export * from './structured_text.js';
export * from './text.js';
export * from './validators/index.js';
export * from './video.js';
