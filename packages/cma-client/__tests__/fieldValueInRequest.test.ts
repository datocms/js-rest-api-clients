import {
  type ApiTypes,
  type FieldValueInRequest,
  type ItemTypeDefinition,
  type RawApiTypes,
  buildBlockRecord,
} from '../src';

type Settings = { locales: 'en' };

const SESSION_BLOCK_ID = 'sessionBlockId00000001' as const;
const LANDING_PAGE_ID = 'landingPageId000000001' as const;

type SessionBlock = ItemTypeDefinition<
  Settings,
  typeof SESSION_BLOCK_ID,
  {
    label: { type: 'string' };
    signup_url: { type: 'string' };
  }
>;

type LandingPage = ItemTypeDefinition<
  Settings,
  typeof LANDING_PAGE_ID,
  {
    title: { type: 'string' };
    sections: { type: 'rich_text'; blocks: SessionBlock };
  }
>;

const sessionBlock = (label: string, signup_url: string) =>
  buildBlockRecord<SessionBlock>({
    item_type: { type: 'item_type', id: SESSION_BLOCK_ID },
    label,
    signup_url,
  });

describe('FieldValueInRequest', () => {
  describe('input shapes', () => {
    // Each item-shape the CMA produces should resolve through the same type
    // alias. If inference of the underlying ItemTypeDefinition broke for any
    // shape, the assignment below would either be `never` (compile error) or
    // fall back to `unknown` (runtime push would still work but the typed
    // .label / .signup_url accesses below would fail).

    it('works with a deserialized top-level item (ApiTypes.Item)', () => {
      type Sections = NonNullable<
        FieldValueInRequest<ApiTypes.Item<LandingPage>, 'sections'>
      >;
      const sections: Sections = [sessionBlock('Intro', 'https://x/1')];
      expect(sections).toHaveLength(1);
    });

    it('works with a deserialized nested-response item (ApiTypes.ItemInNestedResponse)', () => {
      type Sections = NonNullable<
        FieldValueInRequest<
          ApiTypes.ItemInNestedResponse<LandingPage>,
          'sections'
        >
      >;
      const sections: Sections = [sessionBlock('Intro', 'https://x/1')];
      expect(sections).toHaveLength(1);
    });

    it('works with a raw top-level item (RawApiTypes.Item)', () => {
      type Sections = NonNullable<
        FieldValueInRequest<RawApiTypes.Item<LandingPage>, 'sections'>
      >;
      const sections: Sections = [sessionBlock('Intro', 'https://x/1')];
      expect(sections).toHaveLength(1);
    });

    it('works with a raw nested-response item (RawApiTypes.ItemInNestedResponse)', () => {
      // Same shape that BlockInNestedResponse<D> resolves to — covers the
      // "iterate over nested blocks of a parent's modular-content field" path.
      type Label = FieldValueInRequest<
        RawApiTypes.ItemInNestedResponse<SessionBlock>,
        'label'
      >;
      const label: Label = 'hello';
      expect(label).toBe('hello');
    });
  });

  describe('Required wrapper', () => {
    it('strips the Partial-induced `undefined` from the field value', () => {
      // ToItemAttributesInRequest<D> is Partial<{...}> — without Required<>
      // the resolved type would be `string | undefined` and you'd be forced
      // to handle a phantom undefined that Partial introduced (not an actual
      // CMA-allowed value for a non-nullable string).
      type Title = FieldValueInRequest<ApiTypes.Item<LandingPage>, 'title'>;
      const title: Title = 'hello';
      expect(title).toBe('hello');

      // @ts-expect-error — `undefined` isn't part of the type for a
      // non-nullable field.
      const titleUndef: Title = undefined;
      expect(titleUndef).toBeUndefined();
    });
  });

  describe('null preservation', () => {
    it('keeps `null` in the resolved type', () => {
      // Every CMA field can be cleared by sending `null`, so the resolved
      // type must keep `null` in the union — never strip it.
      type Sections = FieldValueInRequest<
        ApiTypes.Item<LandingPage>,
        'sections'
      >;
      const cleared: Sections = null;
      expect(cleared).toBeNull();
    });
  });

  describe('field key constraint', () => {
    it('rejects unknown field keys at compile time and resolves the body to `never`', () => {
      // @ts-expect-error — `'nonexistent'` is not a key of LandingPage's
      // attributes-in-request shape, so the K extends … constraint fails.
      type Bad = FieldValueInRequest<ApiTypes.Item<LandingPage>, 'nonexistent'>;

      // Beyond the constraint error, the body should resolve to `never` —
      // anything else (`unknown`, the union of all field values, etc.) would
      // let downstream code silently keep type-checking past the broken site.
      // The assignment below only compiles when `Bad` is assignable to
      // `never`, and the only type assignable to `never` is `never` itself.
      const probe = undefined as unknown as Bad;
      const asNever: never = probe;
      void asNever;
      expect(true).toBe(true);
    });
  });

  describe('round trip with buildBlockRecord', () => {
    it('lets you collect mixed string IDs and built blocks into a typed array', () => {
      // The canonical use case: read a nested-mode record, rebuild the field
      // by interleaving "keep this block as-is" (string id) with "replace
      // this block" (buildBlockRecord), and write the result back.
      type Page = ApiTypes.ItemInNestedResponse<LandingPage>;
      type Sections = NonNullable<FieldValueInRequest<Page, 'sections'>>;

      const sections: Sections = [];
      sections.push(sessionBlock('Intro', 'https://x/1'));
      sections.push('existingBlockId000001X');

      expect(sections).toHaveLength(2);
    });
  });
});
