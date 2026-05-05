import type { ApiTypes, ItemTypeDefinition, RawApiTypes } from '../src';

// ---------------------------------------------------------------------------
// Schema mirroring the project's `Schema.AnyModel` shape (Article, Author, …)
// ---------------------------------------------------------------------------

type Settings = { locales: 'en' };

type Article = ItemTypeDefinition<
  Settings,
  'article-uuid',
  {
    title: { type: 'string' };
    slug: { type: 'slug' };
  }
>;

type Author = ItemTypeDefinition<
  Settings,
  'author-uuid',
  {
    name: { type: 'string' };
    bio: { type: 'text' };
  }
>;

type Category = ItemTypeDefinition<
  Settings,
  'category-uuid',
  {
    label: { type: 'string' };
  }
>;

type AnyModel = Article | Author | Category;

// ---------------------------------------------------------------------------
// Type-level assertion helpers
// ---------------------------------------------------------------------------

type IsTrue<T extends true> = T;
type Equal<A, B> = (<T>() => T extends A ? 1 : 2) extends <T>() => T extends B
  ? 1
  : 2
  ? true
  : false;

// ---------------------------------------------------------------------------
// `Item<D>` and `ItemInNestedResponse<D>` are now distributive, so a union
// argument expands into a real discriminated union of per-model items.
// ---------------------------------------------------------------------------

type _RawItemDistributes = IsTrue<
  Equal<
    RawApiTypes.Item<AnyModel>,
    | RawApiTypes.Item<Article>
    | RawApiTypes.Item<Author>
    | RawApiTypes.Item<Category>
  >
>;
void (null as unknown as _RawItemDistributes);

type _RawItemInNestedDistributes = IsTrue<
  Equal<
    RawApiTypes.ItemInNestedResponse<AnyModel>,
    | RawApiTypes.ItemInNestedResponse<Article>
    | RawApiTypes.ItemInNestedResponse<Author>
    | RawApiTypes.ItemInNestedResponse<Category>
  >
>;
void (null as unknown as _RawItemInNestedDistributes);

type _ApiItemDistributes = IsTrue<
  Equal<
    ApiTypes.Item<AnyModel>,
    ApiTypes.Item<Article> | ApiTypes.Item<Author> | ApiTypes.Item<Category>
  >
>;
void (null as unknown as _ApiItemDistributes);

type _ApiItemInNestedDistributes = IsTrue<
  Equal<
    ApiTypes.ItemInNestedResponse<AnyModel>,
    | ApiTypes.ItemInNestedResponse<Article>
    | ApiTypes.ItemInNestedResponse<Author>
    | ApiTypes.ItemInNestedResponse<Category>
  >
>;
void (null as unknown as _ApiItemInNestedDistributes);

// ---------------------------------------------------------------------------
// Discriminated-union narrowing on `__itemTypeId` works on the plain
// `Item<AnyModel>` — no helper required.
// ---------------------------------------------------------------------------

function _narrowingWorksOnRawItem(item: RawApiTypes.Item<AnyModel>) {
  if (item.__itemTypeId === 'author-uuid') {
    const _name: string | null | undefined = item.attributes.name;
    void _name;
    // @ts-expect-error — Author has no `title`
    item.attributes.title;
  }

  if (item.__itemTypeId === 'article-uuid') {
    const _title: string | null | undefined = item.attributes.title;
    void _title;
    // @ts-expect-error — Article has no `name`
    item.attributes.name;
  }
}

function _narrowingWorksOnApiItem(item: ApiTypes.Item<AnyModel>) {
  if (item.__itemTypeId === 'category-uuid') {
    const _label: string | null | undefined = item.label;
    void _label;
    // @ts-expect-error — Category has no `name`
    item.name;
  }
}

function _narrowingWorksOnNestedResponse(
  item: RawApiTypes.ItemInNestedResponse<AnyModel>,
) {
  if (item.__itemTypeId === 'author-uuid') {
    const _bio: unknown = item.attributes.bio;
    void _bio;
  }
}

// ---------------------------------------------------------------------------
// Runtime placeholder so Jest doesn't complain about an empty test file.
// All real assertions above are compile-time.
// ---------------------------------------------------------------------------

describe('Item union narrowing (type-level)', () => {
  it('compiles — see type assertions in this file', () => {
    expect(true).toBe(true);
  });
});
