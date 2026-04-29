import {
  generateSchemaTypes,
  generateSchemaTypesForMigration,
} from '../src';
import { fakeClient, field, itemType } from './helpers/fakeClient';

describe('generateSchemaTypes', () => {
  it('emits the ItemTypeDefinition import and EnvironmentSettings with the locales union', async () => {
    const client = fakeClient({
      locales: ['en', 'it'],
      itemTypes: [itemType({ id: '1', api_key: 'blog_post' })],
      fields: [
        field({
          id: '101',
          api_key: 'title',
          field_type: 'string',
          item_type_id: '1',
        }),
      ],
    });

    const code = await generateSchemaTypes(client);

    expect(code).toContain(
      "import type { ItemTypeDefinition } from '@datocms/cma-client';",
    );
    expect(code).toMatch(
      /type EnvironmentSettings = \{\s*locales: 'en' \| 'it';\s*\}/,
    );
  });

  it('PascalCases item type api_keys (snake_case and kebab-case)', async () => {
    const client = fakeClient({
      locales: ['en'],
      itemTypes: [
        itemType({ id: '1', api_key: 'blog_post' }),
        itemType({ id: '2', api_key: 'press-release' }),
      ],
      fields: [],
    });

    const code = await generateSchemaTypes(client);

    expect(code).toContain('export type BlogPost =');
    expect(code).toContain('export type PressRelease =');
  });

  it('exports each item type as ItemTypeDefinition<EnvironmentSettings, id, fields>', async () => {
    const client = fakeClient({
      locales: ['en'],
      itemTypes: [itemType({ id: '42', api_key: 'article' })],
      fields: [
        field({
          id: '201',
          api_key: 'title',
          field_type: 'string',
          item_type_id: '42',
        }),
      ],
    });

    const code = await generateSchemaTypes(client);

    expect(code).toMatch(
      /export type Article = ItemTypeDefinition<\s*EnvironmentSettings,\s*'42',/,
    );
  });

  it('marks localized fields with `localized: true`', async () => {
    const client = fakeClient({
      locales: ['en', 'it'],
      itemTypes: [itemType({ id: '1', api_key: 'post' })],
      fields: [
        field({
          id: '1',
          api_key: 'title',
          field_type: 'string',
          item_type_id: '1',
          localized: true,
        }),
        field({
          id: '2',
          api_key: 'slug',
          field_type: 'string',
          item_type_id: '1',
          localized: false,
        }),
      ],
    });

    const code = await generateSchemaTypes(client);

    expect(code).toMatch(
      /title:\s*\{\s*type:\s*'string';\s*localized:\s*true;\s*\}/,
    );
    expect(code).toMatch(/slug:\s*\{\s*type:\s*'string';\s*\}/);
  });

  describe('rich_text fields', () => {
    it('emits a `blocks` union when item types match', async () => {
      const client = fakeClient({
        locales: ['en'],
        itemTypes: [
          itemType({ id: '1', api_key: 'page' }),
          itemType({ id: '2', api_key: 'hero', modular_block: true }),
          itemType({
            id: '3',
            api_key: 'call_to_action',
            modular_block: true,
          }),
        ],
        fields: [
          field({
            id: '1',
            api_key: 'body',
            field_type: 'rich_text',
            item_type_id: '1',
            validators: { rich_text_blocks: { item_types: ['2', '3'] } },
          }),
        ],
      });

      const code = await generateSchemaTypes(client);

      expect(code).toMatch(
        /body:\s*\{\s*type:\s*'rich_text';\s*blocks:\s*Hero \| CallToAction;\s*\}/,
      );
    });

    it('emits `never` when no blocks are allowed', async () => {
      const client = fakeClient({
        locales: ['en'],
        itemTypes: [itemType({ id: '1', api_key: 'page' })],
        fields: [
          field({
            id: '1',
            api_key: 'body',
            field_type: 'rich_text',
            item_type_id: '1',
            validators: { rich_text_blocks: { item_types: [] } },
          }),
        ],
      });

      const code = await generateSchemaTypes(client);

      expect(code).toMatch(
        /body:\s*\{\s*type:\s*'rich_text';\s*blocks:\s*never;\s*\}/,
      );
    });
  });

  describe('structured_text fields', () => {
    it('emits both `blocks` and `inline_blocks` when present', async () => {
      const client = fakeClient({
        locales: ['en'],
        itemTypes: [
          itemType({ id: '1', api_key: 'page' }),
          itemType({ id: '2', api_key: 'hero', modular_block: true }),
          itemType({
            id: '3',
            api_key: 'mention',
            modular_block: true,
          }),
        ],
        fields: [
          field({
            id: '1',
            api_key: 'body',
            field_type: 'structured_text',
            item_type_id: '1',
            validators: {
              structured_text_blocks: { item_types: ['2'] },
              structured_text_inline_blocks: { item_types: ['3'] },
            },
          }),
        ],
      });

      const code = await generateSchemaTypes(client);

      expect(code).toMatch(/blocks:\s*Hero;/);
      expect(code).toMatch(/inline_blocks:\s*Mention;/);
    });

    it('omits `blocks` and `inline_blocks` when both are empty', async () => {
      const client = fakeClient({
        locales: ['en'],
        itemTypes: [itemType({ id: '1', api_key: 'page' })],
        fields: [
          field({
            id: '1',
            api_key: 'body',
            field_type: 'structured_text',
            item_type_id: '1',
            validators: {
              structured_text_blocks: { item_types: [] },
              structured_text_inline_blocks: { item_types: [] },
            },
          }),
        ],
      });

      const code = await generateSchemaTypes(client);

      expect(code).toMatch(/body:\s*\{\s*type:\s*'structured_text';\s*\}/);
      expect(code).not.toMatch(/inline_blocks/);
    });
  });

  it('emits `blocks` union for single_block fields', async () => {
    const client = fakeClient({
      locales: ['en'],
      itemTypes: [
        itemType({ id: '1', api_key: 'page' }),
        itemType({ id: '2', api_key: 'hero', modular_block: true }),
      ],
      fields: [
        field({
          id: '1',
          api_key: 'featured',
          field_type: 'single_block',
          item_type_id: '1',
          validators: { single_block_blocks: { item_types: ['2'] } },
        }),
      ],
    });

    const code = await generateSchemaTypes(client);

    expect(code).toMatch(
      /featured:\s*\{\s*type:\s*'single_block';\s*blocks:\s*Hero;\s*\}/,
    );
  });

  describe('virtual fields', () => {
    it('adds `position` for sortable models', async () => {
      const client = fakeClient({
        locales: ['en'],
        itemTypes: [
          itemType({ id: '1', api_key: 'menu_item', sortable: true }),
        ],
        fields: [],
      });

      const code = await generateSchemaTypes(client);
      expect(code).toMatch(/position:\s*\{\s*type:\s*'integer';\s*\}/);
    });

    it('adds `position` and `parent_id` for tree models', async () => {
      const client = fakeClient({
        locales: ['en'],
        itemTypes: [itemType({ id: '1', api_key: 'category', tree: true })],
        fields: [],
      });

      const code = await generateSchemaTypes(client);
      expect(code).toMatch(/position:\s*\{\s*type:\s*'integer';\s*\}/);
      expect(code).toMatch(/parent_id:\s*\{\s*type:\s*'string';\s*\}/);
    });

    it('does not add virtual fields to plain models', async () => {
      const client = fakeClient({
        locales: ['en'],
        itemTypes: [itemType({ id: '1', api_key: 'page' })],
        fields: [],
      });

      const code = await generateSchemaTypes(client);
      expect(code).not.toMatch(/position:/);
      expect(code).not.toMatch(/parent_id:/);
    });
  });

  describe('AnyBlock / AnyModel / AnyBlockOrModel', () => {
    it('splits item types by `modular_block`', async () => {
      const client = fakeClient({
        locales: ['en'],
        itemTypes: [
          itemType({ id: '1', api_key: 'blog_post' }),
          itemType({ id: '2', api_key: 'author' }),
          itemType({ id: '3', api_key: 'hero', modular_block: true }),
          itemType({
            id: '4',
            api_key: 'call_to_action',
            modular_block: true,
          }),
        ],
        fields: [],
      });

      const code = await generateSchemaTypes(client);

      expect(code).toMatch(/export type AnyBlock = Hero \| CallToAction;/);
      expect(code).toMatch(/export type AnyModel = BlogPost \| Author;/);
      expect(code).toMatch(
        /export type AnyBlockOrModel = AnyBlock \| AnyModel;/,
      );
    });

    it('uses `never` when no blocks or no models exist', async () => {
      const client = fakeClient({
        locales: ['en'],
        itemTypes: [itemType({ id: '1', api_key: 'blog_post' })],
        fields: [],
      });

      const code = await generateSchemaTypes(client);
      expect(code).toMatch(/export type AnyBlock = never;/);
      expect(code).toMatch(/export type AnyModel = BlogPost;/);
    });
  });

  describe('itemTypesFilter', () => {
    it('keeps only the requested item types and their block dependencies', async () => {
      const client = fakeClient({
        locales: ['en'],
        itemTypes: [
          itemType({ id: '1', api_key: 'blog_post' }),
          itemType({ id: '2', api_key: 'author' }),
          itemType({ id: '3', api_key: 'hero', modular_block: true }),
        ],
        fields: [
          field({
            id: '10',
            api_key: 'body',
            field_type: 'rich_text',
            item_type_id: '1',
            validators: { rich_text_blocks: { item_types: ['3'] } },
          }),
        ],
      });

      const code = await generateSchemaTypes(client, {
        itemTypesFilter: 'blog_post',
      });

      expect(code).toContain('export type BlogPost =');
      expect(code).toContain('export type Hero =');
      expect(code).not.toContain('export type Author =');
    });

    it('resolves transitive dependencies through structured_text and single_block', async () => {
      const client = fakeClient({
        locales: ['en'],
        itemTypes: [
          itemType({ id: '1', api_key: 'page' }),
          itemType({ id: '2', api_key: 'hero', modular_block: true }),
          itemType({ id: '3', api_key: 'mention', modular_block: true }),
          itemType({ id: '4', api_key: 'card', modular_block: true }),
        ],
        fields: [
          field({
            id: '10',
            api_key: 'body',
            field_type: 'structured_text',
            item_type_id: '1',
            validators: {
              structured_text_blocks: { item_types: ['2'] },
              structured_text_inline_blocks: { item_types: ['3'] },
            },
          }),
          field({
            id: '11',
            api_key: 'featured',
            field_type: 'single_block',
            item_type_id: '1',
            validators: { single_block_blocks: { item_types: ['4'] } },
          }),
        ],
      });

      const code = await generateSchemaTypes(client, {
        itemTypesFilter: 'page',
      });

      expect(code).toContain('export type Page =');
      expect(code).toContain('export type Hero =');
      expect(code).toContain('export type Mention =');
      expect(code).toContain('export type Card =');
    });

    it('ignores unknown api_keys', async () => {
      const client = fakeClient({
        locales: ['en'],
        itemTypes: [itemType({ id: '1', api_key: 'blog_post' })],
        fields: [],
      });

      const code = await generateSchemaTypes(client, {
        itemTypesFilter: 'does_not_exist,blog_post',
      });

      expect(code).toContain('export type BlogPost =');
    });
  });

  describe('blank-line separation between top-level declarations', () => {
    it('separates import, EnvironmentSettings, each item type, and the unions block with blank lines', async () => {
      const client = fakeClient({
        locales: ['en'],
        itemTypes: [
          itemType({ id: '1', api_key: 'blog_post' }),
          itemType({ id: '2', api_key: 'hero', modular_block: true }),
        ],
        fields: [
          field({
            id: '10',
            api_key: 'title',
            field_type: 'string',
            item_type_id: '1',
          }),
        ],
      });

      const code = await generateSchemaTypes(client);

      // import → blank line → EnvironmentSettings
      expect(code).toMatch(
        /from '@datocms\/cma-client';\n\ntype EnvironmentSettings/,
      );
      // EnvironmentSettings → blank line → first item type
      expect(code).toMatch(/^\};\n\nexport type BlogPost =/m);
      // BlogPost → blank line → Hero (each item type separated)
      expect(code).toMatch(/^>;\n\nexport type Hero =/m);
      // last item type → blank line → AnyBlock
      expect(code).toMatch(/Hero = ItemTypeDefinition<[^>]*>;\n\nexport type AnyBlock =/);
    });

    it('keeps the three Any* unions grouped together (no blank lines between them)', async () => {
      const client = fakeClient({
        locales: ['en'],
        itemTypes: [
          itemType({ id: '1', api_key: 'blog_post' }),
          itemType({ id: '2', api_key: 'hero', modular_block: true }),
        ],
        fields: [],
      });

      const code = await generateSchemaTypes(client);

      expect(code).toMatch(
        /export type AnyBlock = Hero;\nexport type AnyModel = BlogPost;\nexport type AnyBlockOrModel = AnyBlock \| AnyModel;/,
      );
    });

    it('also applies to the migration variant (no import, but same body separation)', async () => {
      const client = fakeClient({
        locales: ['en'],
        itemTypes: [itemType({ id: '1', api_key: 'blog_post' })],
        fields: [],
      });

      const code = await generateSchemaTypesForMigration(client);

      // file starts directly with EnvironmentSettings (no import)
      expect(code).toMatch(/^type EnvironmentSettings/);
      // EnvironmentSettings → blank line → first item type
      expect(code).toMatch(/^\};\n\nexport type BlogPost =/m);
      // item type → blank line → AnyBlock
      expect(code).toMatch(/>;\n\nexport type AnyBlock =/);
    });

    it('separates import from the declare-global wrapper with a blank line', async () => {
      const client = fakeClient({
        locales: ['en'],
        itemTypes: [itemType({ id: '1', api_key: 'blog_post' })],
        fields: [],
      });

      const code = await generateSchemaTypes(client, {
        wrapInGlobalNamespace: true,
      });

      expect(code).toMatch(
        /from '@datocms\/cma-client';\n\ndeclare global \{/,
      );
    });
  });

  describe('wrapInGlobalNamespace', () => {
    it('wraps all declarations in `declare global { namespace Schema { … } }`', async () => {
      const client = fakeClient({
        locales: ['en'],
        itemTypes: [itemType({ id: '1', api_key: 'blog_post' })],
        fields: [],
      });

      const code = await generateSchemaTypes(client, {
        wrapInGlobalNamespace: true,
      });

      expect(code).toMatch(/declare global \{/);
      expect(code).toMatch(/namespace Schema \{/);
      expect(code).toMatch(
        /^import type \{ ItemTypeDefinition \} from '@datocms\/cma-client';/m,
      );
    });
  });
});

describe('generateSchemaTypesForMigration', () => {
  it('emits the same declarations without the import line', async () => {
    const client = fakeClient({
      locales: ['en'],
      itemTypes: [itemType({ id: '1', api_key: 'blog_post' })],
      fields: [
        field({
          id: '1',
          api_key: 'title',
          field_type: 'string',
          item_type_id: '1',
        }),
      ],
    });

    const code = await generateSchemaTypesForMigration(client);

    expect(code).not.toContain('import type');
    expect(code).toContain('export type BlogPost =');
    expect(code).toContain('type EnvironmentSettings');
  });

  it('honors itemTypesFilter', async () => {
    const client = fakeClient({
      locales: ['en'],
      itemTypes: [
        itemType({ id: '1', api_key: 'blog_post' }),
        itemType({ id: '2', api_key: 'author' }),
      ],
      fields: [],
    });

    const code = await generateSchemaTypesForMigration(client, {
      itemTypesFilter: 'blog_post',
    });

    expect(code).toContain('export type BlogPost =');
    expect(code).not.toContain('export type Author =');
  });
});
