import { findFirstNode, isInlineBlock } from 'datocms-structured-text-utils';
import { generateNewCmaClient } from '../../../jest-helpers/generateNewCmaClient';
import { type ItemTypeDefinition, buildBlockRecord, inspectItem } from '../src';

describe('item (explicit typing with item definitions)', () => {
  describe('simple methods', () => {
    it.concurrent('field values are correctly typed', async () => {
      const client = await generateNewCmaClient();

      type EnvironmentSettings = { locales: 'en' | 'it' };

      // === Type Definitions ===
      type Block = ItemTypeDefinition<
        EnvironmentSettings,
        string,
        {
          title: { type: 'string' };
          rich_text: { type: 'rich_text'; blocks: Block };
          structured_text: {
            type: 'structured_text';
            blocks: Block;
            inline_blocks: Block;
          };
          single_block: { type: 'single_block'; blocks: Block };
        }
      >;

      // === Block Model Setup ===
      const blockModel = await client.itemTypes.create({
        name: 'Block',
        api_key: 'block',
        modular_block: true,
      });

      await client.fields.create(blockModel, {
        label: 'Title',
        field_type: 'string',
        api_key: 'title',
      });

      await client.fields.create(blockModel, {
        label: 'Modular content',
        field_type: 'rich_text',
        api_key: 'rich_text',
        validators: {
          rich_text_blocks: { item_types: [blockModel.id] },
        },
      });

      await client.fields.create(blockModel, {
        label: 'Structured Text',
        field_type: 'structured_text',
        api_key: 'structured_text',
        validators: {
          structured_text_links: { item_types: [] },
          structured_text_blocks: { item_types: [blockModel.id] },
          structured_text_inline_blocks: { item_types: [blockModel.id] },
        },
      });

      await client.fields.create(blockModel, {
        label: 'Single block',
        field_type: 'single_block',
        api_key: 'single_block',
        validators: {
          single_block_blocks: { item_types: [blockModel.id] },
        },
      });

      // === Landing Page Model Setup ===
      type LandingPage = ItemTypeDefinition<
        EnvironmentSettings,
        'WTyssHtyTzu9_EbszSVhPw',
        {
          title: { type: 'string' };
          rich_text: { type: 'rich_text'; blocks: Block };
          structured_text: {
            type: 'structured_text';
            blocks: Block;
            inline_blocks: Block;
          };
          single_block: { type: 'single_block'; blocks: Block };
        }
      >;

      const landingPageModel = await client.itemTypes.create({
        id: 'WTyssHtyTzu9_EbszSVhPw',
        name: 'Landing Page',
        api_key: 'landing_page',
        draft_mode_active: true,
      });

      await client.fields.create(landingPageModel.id, {
        label: 'Title',
        field_type: 'string',
        api_key: 'title',
      });

      await client.fields.create(landingPageModel.id, {
        label: 'Modular content',
        field_type: 'rich_text',
        api_key: 'rich_text',
        validators: {
          rich_text_blocks: { item_types: [blockModel.id] },
        },
      });

      await client.fields.create(landingPageModel.id, {
        label: 'Structured Text',
        field_type: 'structured_text',
        api_key: 'structured_text',
        validators: {
          structured_text_links: { item_types: [landingPageModel.id] },
          structured_text_blocks: { item_types: [blockModel.id] },
          structured_text_inline_blocks: { item_types: [blockModel.id] },
        },
      });

      await client.fields.create(landingPageModel.id, {
        label: 'Single block',
        field_type: 'single_block',
        api_key: 'single_block',
        validators: {
          single_block_blocks: { item_types: [blockModel.id] },
        },
      });

      // === Item Creation with Nested Data ===
      const item = await client.items.create<LandingPage>({
        title: 'Level 0',
        rich_text: [
          {
            type: 'item',
            attributes: {
              title: 'Rich Text: Level 1',
              rich_text: [
                buildBlockRecord<Block>({
                  title: 'Rich Text: Level 2',
                  item_type: blockModel,
                }),
              ],
            },
            relationships: {
              item_type: { data: { id: blockModel.id, type: 'item_type' } },
            },
          },
        ],
        single_block: buildBlockRecord<Block>({
          title: 'Single Block: Level 1',
          single_block: buildBlockRecord<Block>({
            title: 'Single Block: Level 2',
            item_type: blockModel,
          }),
          item_type: blockModel,
        }),
        structured_text: {
          schema: 'dast',
          document: {
            type: 'root',
            children: [
              {
                type: 'paragraph',
                children: [
                  {
                    type: 'inlineBlock',
                    item: buildBlockRecord<Block>({
                      title: 'Structured Text: Level 1',
                      structured_text: {
                        schema: 'dast',
                        document: {
                          type: 'root',
                          children: [
                            {
                              type: 'block',
                              item: buildBlockRecord<Block>({
                                title: 'Structured Text: Level 2',
                                item_type: blockModel,
                              }),
                            },
                          ],
                        },
                      },
                      item_type: blockModel,
                    }),
                  },
                ],
              },
            ],
          },
        },
        item_type: { id: 'WTyssHtyTzu9_EbszSVhPw', type: 'item_type' },
      });

      // === Test Item Creation (Basic) ===
      expect(item.title!.toUpperCase()).toBe('LEVEL 0');
      expect(item.__itemTypeId).toBe(landingPageModel.id);
      expect(item.rich_text).toHaveLength(1);
      expect(item.rich_text.every((id) => typeof id === 'string')).toBe(true);
      expect(item.single_block).toEqual(expect.any(String));
      expect(
        findFirstNode(item.structured_text!, isInlineBlock)?.node.item,
      ).toEqual(expect.any(String));

      // === Test .find() with nested: true ===
      const nestedItem = await client.items.find<LandingPage>(item, {
        nested: true,
      });

      console.log(inspectItem(nestedItem));

      expect(nestedItem.title!.toUpperCase()).toBe('LEVEL 0');
      expect(nestedItem.__itemTypeId).toBe(landingPageModel.id);
      expect(nestedItem.rich_text).toHaveLength(1);
      expect(
        nestedItem.rich_text[0]!.attributes.rich_text[0]!.attributes.title!.toUpperCase(),
      ).toBe('RICH TEXT: LEVEL 2');
      expect(
        nestedItem.rich_text[0]!.attributes.rich_text[0]!.__itemTypeId,
      ).toBe(blockModel.id);
      expect(
        nestedItem.single_block!.attributes.single_block!.attributes.title!.toUpperCase(),
      ).toBe('SINGLE BLOCK: LEVEL 2');
      expect(
        nestedItem.single_block!.attributes.single_block!.__itemTypeId,
      ).toBe(blockModel.id);
      expect(
        findFirstNode(
          nestedItem.structured_text!,
          isInlineBlock,
        )?.node.item.attributes.title!.toUpperCase(),
      ).toBe('STRUCTURED TEXT: LEVEL 1');
      expect(
        findFirstNode(nestedItem.structured_text!, isInlineBlock)?.node.item
          .__itemTypeId,
      ).toBe(blockModel.id);

      // === Test .list() without nested ===
      const listedItems = await client.items.list<LandingPage>({
        filter: { type: landingPageModel.id },
        version: 'current',
      });
      expect(listedItems).toHaveLength(1);
      expect(listedItems[0]!.title!.toUpperCase()).toBe('LEVEL 0');
      expect(listedItems[0]!.__itemTypeId).toBe(landingPageModel.id);

      // === Test .list() with nested: true ===
      const nestedListedItems = await client.items.list<LandingPage>({
        filter: { type: landingPageModel.id },
        version: 'current',
        nested: true,
      });
      expect(nestedListedItems).toHaveLength(1);
      expect(nestedListedItems[0]!.title!.toUpperCase()).toBe('LEVEL 0');
      expect(nestedListedItems[0]!.__itemTypeId).toBe(landingPageModel.id);
      expect(nestedListedItems[0]!.rich_text).toHaveLength(1);
      expect(
        nestedListedItems[0]!.rich_text[0]!.attributes.rich_text[0]!.attributes.title!.toUpperCase(),
      ).toBe('RICH TEXT: LEVEL 2');
      expect(
        nestedListedItems[0]!.rich_text[0]!.attributes.rich_text[0]!
          .__itemTypeId,
      ).toBe(blockModel.id);
      expect(
        nestedListedItems[0]!.single_block!.attributes.single_block!.attributes.title!.toUpperCase(),
      ).toBe('SINGLE BLOCK: LEVEL 2');
      expect(
        nestedListedItems[0]!.single_block!.attributes.single_block!
          .__itemTypeId,
      ).toBe(blockModel.id);
      expect(
        findFirstNode(
          nestedListedItems[0]!.structured_text!,
          isInlineBlock,
        )?.node.item.attributes.title!.toUpperCase(),
      ).toBe('STRUCTURED TEXT: LEVEL 1');
      expect(
        findFirstNode(nestedListedItems[0]!.structured_text!, isInlineBlock)
          ?.node.item.__itemTypeId,
      ).toBe(blockModel.id);

      // === Test .listPagedIterator() without nested ===
      let paginatedCount = 0;
      for await (const paginatedItem of client.items.listPagedIterator<LandingPage>(
        { filter: { type: landingPageModel.id }, version: 'current' },
      )) {
        expect(paginatedItem.title!.toUpperCase()).toBe('LEVEL 0');
        expect(paginatedItem.__itemTypeId).toBe(landingPageModel.id);
        paginatedCount++;
      }
      expect(paginatedCount).toBe(1);

      // === Test .listPagedIterator() with nested: true ===
      let nestedPaginatedCount = 0;
      for await (const nestedPaginatedItem of client.items.listPagedIterator<LandingPage>(
        {
          filter: { type: landingPageModel.id },
          version: 'current',
          nested: true,
        },
      )) {
        expect(nestedPaginatedItem.title!.toUpperCase()).toBe('LEVEL 0');
        expect(nestedPaginatedItem.__itemTypeId).toBe(landingPageModel.id);
        expect(nestedPaginatedItem.rich_text).toHaveLength(1);
        expect(
          nestedPaginatedItem.rich_text[0]!.attributes.rich_text[0]!.attributes.title!.toUpperCase(),
        ).toBe('RICH TEXT: LEVEL 2');
        expect(
          nestedPaginatedItem.rich_text[0]!.attributes.rich_text[0]!
            .__itemTypeId,
        ).toBe(blockModel.id);
        expect(
          nestedPaginatedItem.single_block!.attributes.single_block!.attributes.title!.toUpperCase(),
        ).toBe('SINGLE BLOCK: LEVEL 2');
        expect(
          nestedPaginatedItem.single_block!.attributes.single_block!
            .__itemTypeId,
        ).toBe(blockModel.id);
        expect(
          findFirstNode(
            nestedPaginatedItem.structured_text!,
            isInlineBlock,
          )?.node.item.attributes.title!.toUpperCase(),
        ).toBe('STRUCTURED TEXT: LEVEL 1');
        expect(
          findFirstNode(nestedPaginatedItem.structured_text!, isInlineBlock)
            ?.node.item.__itemTypeId,
        ).toBe(blockModel.id);
        nestedPaginatedCount++;
      }
      expect(nestedPaginatedCount).toBe(1);

      // === Test Item Operations (publish, unpublish, update, destroy) ===
      const publishResult = await client.items.publish<LandingPage>(item.id);
      expect(publishResult.title!.toUpperCase()).toBe('LEVEL 0');
      expect(publishResult.__itemTypeId).toBe(landingPageModel.id);

      const unpublishResult = await client.items.unpublish<LandingPage>(
        item.id,
      );
      expect(unpublishResult.title!.toUpperCase()).toBe('LEVEL 0');
      expect(unpublishResult.__itemTypeId).toBe(landingPageModel.id);

      const updateResult = await client.items.update<LandingPage>(item.id, {
        title: 'Updated Level 0',
      });
      expect(updateResult.title!.toUpperCase()).toBe('UPDATED LEVEL 0');
      expect(updateResult.__itemTypeId).toBe(landingPageModel.id);

      const destroyResult = await client.items.destroy<LandingPage>(item.id);
      expect(destroyResult.title!.toUpperCase()).toBe('UPDATED LEVEL 0');
      expect(destroyResult.__itemTypeId).toBe(landingPageModel.id);
    });
  });

  describe('raw methods', () => {
    it.concurrent('field values are correctly typed', async () => {
      const client = await generateNewCmaClient();

      // === Type Definitions ===

      type EnvironmentSettings = { locales: 'en' | 'it' };

      type Block = ItemTypeDefinition<
        EnvironmentSettings,
        'WTyssHtyTzu9_EbszSVhPw',
        {
          title: { type: 'string' };
          rich_text: { type: 'rich_text'; blocks: Block };
          structured_text: {
            type: 'structured_text';
            blocks: Block;
            inline_blocks: Block;
          };
          single_block: { type: 'single_block'; blocks: Block };
        }
      >;

      // === Block Model Setup ===
      const blockModel = await client.itemTypes.create({
        id: 'WTyssHtyTzu9_EbszSVhPw',
        name: 'Block',
        api_key: 'block',
        modular_block: true,
      });

      await client.fields.create(blockModel, {
        label: 'Title',
        field_type: 'string',
        api_key: 'title',
      });

      await client.fields.create(blockModel, {
        label: 'Modular content',
        field_type: 'rich_text',
        api_key: 'rich_text',
        validators: {
          rich_text_blocks: { item_types: [blockModel.id] },
        },
      });

      await client.fields.create(blockModel, {
        label: 'Structured Text',
        field_type: 'structured_text',
        api_key: 'structured_text',
        validators: {
          structured_text_links: { item_types: [] },
          structured_text_blocks: { item_types: [blockModel.id] },
          structured_text_inline_blocks: { item_types: [blockModel.id] },
        },
      });

      await client.fields.create(blockModel, {
        label: 'Single block',
        field_type: 'single_block',
        api_key: 'single_block',
        validators: {
          single_block_blocks: { item_types: [blockModel.id] },
        },
      });

      // === Landing Page Model Setup ===
      type LandingPage = ItemTypeDefinition<
        EnvironmentSettings,
        string,
        {
          title: { type: 'string' };
          rich_text: { type: 'rich_text'; blocks: Block };
          structured_text: {
            type: 'structured_text';
            blocks: Block;
            inline_blocks: Block;
          };
          single_block: { type: 'single_block'; blocks: Block };
        }
      >;

      const landingPageModel = await client.itemTypes.create({
        name: 'Landing Page',
        api_key: 'landing_page',
        draft_mode_active: true,
      });

      await client.fields.create(landingPageModel.id, {
        label: 'Title',
        field_type: 'string',
        api_key: 'title',
      });

      await client.fields.create(landingPageModel.id, {
        label: 'Modular content',
        field_type: 'rich_text',
        api_key: 'rich_text',
        validators: {
          rich_text_blocks: { item_types: [blockModel.id] },
        },
      });

      await client.fields.create(landingPageModel.id, {
        label: 'Structured Text',
        field_type: 'structured_text',
        api_key: 'structured_text',
        validators: {
          structured_text_links: { item_types: [landingPageModel.id] },
          structured_text_blocks: { item_types: [blockModel.id] },
          structured_text_inline_blocks: { item_types: [blockModel.id] },
        },
      });

      await client.fields.create(landingPageModel.id, {
        label: 'Single block',
        field_type: 'single_block',
        api_key: 'single_block',
        validators: {
          single_block_blocks: { item_types: [blockModel.id] },
        },
      });

      // === Item Creation with Nested Data (Raw) ===
      const { data: item } = await client.items.rawCreate<LandingPage>({
        data: {
          type: 'item',
          attributes: {
            title: 'Level 0',
            rich_text: [
              {
                type: 'item',
                attributes: {
                  title: 'Rich Text: Level 1',
                  rich_text: [
                    buildBlockRecord<Block>({
                      title: 'Rich Text: Level 2',
                      item_type: {
                        type: 'item_type',
                        id: 'WTyssHtyTzu9_EbszSVhPw',
                      },
                    }),
                  ],
                },
                relationships: {
                  item_type: {
                    data: { id: 'WTyssHtyTzu9_EbszSVhPw', type: 'item_type' },
                  },
                },
              },
            ],
            single_block: buildBlockRecord<Block>({
              title: 'Single Block: Level 1',
              single_block: buildBlockRecord<Block>({
                title: 'Single Block: Level 2',
                item_type: { type: 'item_type', id: 'WTyssHtyTzu9_EbszSVhPw' },
              }),
              item_type: { type: 'item_type', id: 'WTyssHtyTzu9_EbszSVhPw' },
            }),
            structured_text: {
              schema: 'dast',
              document: {
                type: 'root',
                children: [
                  {
                    type: 'paragraph',
                    children: [
                      {
                        type: 'inlineBlock',
                        item: buildBlockRecord<Block>({
                          title: 'Structured Text: Level 1',
                          structured_text: {
                            schema: 'dast',
                            document: {
                              type: 'root',
                              children: [
                                {
                                  type: 'block',
                                  item: buildBlockRecord<Block>({
                                    title: 'Structured Text: Level 2',
                                    item_type: {
                                      type: 'item_type',
                                      id: 'WTyssHtyTzu9_EbszSVhPw',
                                    },
                                  }),
                                },
                              ],
                            },
                          },
                          item_type: {
                            type: 'item_type',
                            id: 'WTyssHtyTzu9_EbszSVhPw',
                          },
                        }),
                      },
                    ],
                  },
                ],
              },
            },
          },
          relationships: {
            item_type: {
              data: { id: landingPageModel.id, type: 'item_type' },
            },
          },
        },
      });

      // === Test .rawFind() with nested: true ===
      const { data: rawNestedItem } = await client.items.rawFind<LandingPage>(
        item.id,
        {
          nested: true,
        },
      );

      expect(rawNestedItem.attributes.title!.toUpperCase()).toBe('LEVEL 0');
      expect(rawNestedItem.relationships.item_type.data.id).toBe(
        landingPageModel.id,
      );
      expect(rawNestedItem.__itemTypeId).toBe(landingPageModel.id);
      expect(rawNestedItem.attributes.rich_text).toHaveLength(1);
      expect(
        rawNestedItem.attributes.rich_text[0]!.attributes.rich_text[0]!.attributes.title!.toUpperCase(),
      ).toBe('RICH TEXT: LEVEL 2');
      expect(
        rawNestedItem.attributes.rich_text[0]!.attributes.rich_text[0]!
          .__itemTypeId,
      ).toBe(blockModel.id);
      expect(
        rawNestedItem.attributes.single_block!.attributes.single_block!.attributes.title!.toUpperCase(),
      ).toBe('SINGLE BLOCK: LEVEL 2');
      expect(
        rawNestedItem.attributes.single_block!.attributes.single_block!
          .__itemTypeId,
      ).toBe(blockModel.id);
      expect(
        findFirstNode(
          rawNestedItem.attributes.structured_text!,
          isInlineBlock,
        )?.node.item.attributes.title!.toUpperCase(),
      ).toBe('STRUCTURED TEXT: LEVEL 1');
      expect(
        findFirstNode(rawNestedItem.attributes.structured_text!, isInlineBlock)
          ?.node.item.__itemTypeId,
      ).toBe(blockModel.id);

      // === Test .rawList() without nested ===
      const { data: rawListedItems } = await client.items.rawList<LandingPage>({
        filter: { type: landingPageModel.id },
        version: 'current',
      });
      expect(rawListedItems).toHaveLength(1);
      expect(rawListedItems[0]!.attributes.title!.toUpperCase()).toBe(
        'LEVEL 0',
      );
      expect(rawListedItems[0]!.relationships.item_type.data.id).toBe(
        landingPageModel.id,
      );
      expect(rawListedItems[0]!.__itemTypeId).toBe(landingPageModel.id);
      expect(rawListedItems[0]!.attributes.rich_text).toHaveLength(1);
      expect(
        rawListedItems[0]!.attributes.rich_text.every(
          (id) => typeof id === 'string',
        ),
      ).toBe(true);
      expect(rawListedItems[0]!.attributes.single_block).toEqual(
        expect.any(String),
      );
      expect(
        findFirstNode(
          rawListedItems[0]!.attributes.structured_text!,
          isInlineBlock,
        )?.node.item,
      ).toEqual(expect.any(String));

      // === Test .rawList() with nested: true ===
      const { data: rawNestedListedItems } =
        await client.items.rawList<LandingPage>({
          filter: { type: landingPageModel.id },
          version: 'current',
          nested: true,
        });
      expect(rawNestedListedItems).toHaveLength(1);
      expect(rawNestedListedItems[0]!.attributes.title!.toUpperCase()).toBe(
        'LEVEL 0',
      );
      expect(rawNestedListedItems[0]!.relationships.item_type.data.id).toBe(
        landingPageModel.id,
      );
      expect(rawNestedListedItems[0]!.__itemTypeId).toBe(landingPageModel.id);
      expect(rawNestedListedItems[0]!.attributes.rich_text).toHaveLength(1);
      expect(
        rawNestedListedItems[0]!.attributes.rich_text[0]!.attributes.rich_text[0]!.attributes.title!.toUpperCase(),
      ).toBe('RICH TEXT: LEVEL 2');
      expect(
        rawNestedListedItems[0]!.attributes.rich_text[0]!.attributes
          .rich_text[0]!.__itemTypeId,
      ).toBe(blockModel.id);
      expect(
        rawNestedListedItems[0]!.attributes.single_block!.attributes.single_block!.attributes.title!.toUpperCase(),
      ).toBe('SINGLE BLOCK: LEVEL 2');
      expect(
        rawNestedListedItems[0]!.attributes.single_block!.attributes
          .single_block!.__itemTypeId,
      ).toBe(blockModel.id);
      expect(
        findFirstNode(
          rawNestedListedItems[0]!.attributes.structured_text!,
          isInlineBlock,
        )?.node.item.attributes.title!.toUpperCase(),
      ).toBe('STRUCTURED TEXT: LEVEL 1');
      expect(
        findFirstNode(
          rawNestedListedItems[0]!.attributes.structured_text!,
          isInlineBlock,
        )?.node.item.__itemTypeId,
      ).toBe(blockModel.id);

      // === Test .rawListPagedIterator() without nested ===
      let rawPaginatedCount = 0;
      for await (const rawPaginatedItem of client.items.rawListPagedIterator<LandingPage>(
        { filter: { type: landingPageModel.id }, version: 'current' },
      )) {
        expect(rawPaginatedItem.attributes.title!.toUpperCase()).toBe(
          'LEVEL 0',
        );
        expect(rawPaginatedItem.relationships.item_type.data.id).toBe(
          landingPageModel.id,
        );
        expect(rawPaginatedItem.__itemTypeId).toBe(landingPageModel.id);
        expect(rawPaginatedItem.attributes.rich_text).toHaveLength(1);
        expect(
          rawPaginatedItem.attributes.rich_text.every(
            (id) => typeof id === 'string',
          ),
        ).toBe(true);
        expect(rawPaginatedItem.attributes.single_block).toEqual(
          expect.any(String),
        );
        expect(
          findFirstNode(
            rawPaginatedItem.attributes.structured_text!,
            isInlineBlock,
          )?.node.item,
        ).toEqual(expect.any(String));
        rawPaginatedCount++;
      }
      expect(rawPaginatedCount).toBe(1);

      // === Test .rawListPagedIterator() with nested: true ===
      let rawNestedPaginatedCount = 0;
      for await (const rawNestedPaginatedItem of client.items.rawListPagedIterator<LandingPage>(
        {
          filter: { type: landingPageModel.id },
          version: 'current',
          nested: true,
        },
      )) {
        expect(rawNestedPaginatedItem.attributes.title!.toUpperCase()).toBe(
          'LEVEL 0',
        );
        expect(rawNestedPaginatedItem.relationships.item_type.data.id).toBe(
          landingPageModel.id,
        );
        expect(rawNestedPaginatedItem.__itemTypeId).toBe(landingPageModel.id);
        expect(rawNestedPaginatedItem.attributes.rich_text).toHaveLength(1);
        expect(
          rawNestedPaginatedItem.attributes.rich_text[0]!.attributes.rich_text[0]!.attributes.title!.toUpperCase(),
        ).toBe('RICH TEXT: LEVEL 2');
        expect(
          rawNestedPaginatedItem.attributes.rich_text[0]!.attributes
            .rich_text[0]!.__itemTypeId,
        ).toBe(blockModel.id);
        expect(
          rawNestedPaginatedItem.attributes.single_block!.attributes.single_block!.attributes.title!.toUpperCase(),
        ).toBe('SINGLE BLOCK: LEVEL 2');
        expect(
          rawNestedPaginatedItem.attributes.single_block!.attributes
            .single_block!.__itemTypeId,
        ).toBe(blockModel.id);
        expect(
          findFirstNode(
            rawNestedPaginatedItem.attributes.structured_text!,
            isInlineBlock,
          )?.node.item.attributes.title!.toUpperCase(),
        ).toBe('STRUCTURED TEXT: LEVEL 1');
        expect(
          findFirstNode(
            rawNestedPaginatedItem.attributes.structured_text!,
            isInlineBlock,
          )?.node.item.__itemTypeId,
        ).toBe(blockModel.id);
        rawNestedPaginatedCount++;
      }
      expect(rawNestedPaginatedCount).toBe(1);
    });
  });

  describe('simple methods with localized fields', () => {
    it.concurrent('field values are correctly typed', async () => {
      const client = await generateNewCmaClient();

      type EnvironmentSettings = { locales: 'en' | 'it' };

      // === Type Definitions ===
      type Block = ItemTypeDefinition<
        EnvironmentSettings,
        string,
        {
          title: { type: 'string' };
          rich_text: { type: 'rich_text'; blocks: Block };
          structured_text: {
            type: 'structured_text';
            blocks: Block;
            inline_blocks: Block;
          };
          single_block: { type: 'single_block'; blocks: Block };
        }
      >;

      // === Block Model Setup ===
      const blockModel = await client.itemTypes.create({
        name: 'Block',
        api_key: 'block',
        modular_block: true,
      });

      await client.fields.create(blockModel, {
        label: 'Title',
        field_type: 'string',
        api_key: 'title',
      });

      await client.fields.create(blockModel, {
        label: 'Modular content',
        field_type: 'rich_text',
        api_key: 'rich_text',
        validators: {
          rich_text_blocks: { item_types: [blockModel.id] },
        },
      });

      await client.fields.create(blockModel, {
        label: 'Structured Text',
        field_type: 'structured_text',
        api_key: 'structured_text',
        validators: {
          structured_text_links: { item_types: [] },
          structured_text_blocks: { item_types: [blockModel.id] },
          structured_text_inline_blocks: { item_types: [blockModel.id] },
        },
      });

      await client.fields.create(blockModel, {
        label: 'Single block',
        field_type: 'single_block',
        api_key: 'single_block',
        validators: {
          single_block_blocks: { item_types: [blockModel.id] },
        },
      });

      // === Landing Page Model Setup ===
      type LandingPage = ItemTypeDefinition<
        EnvironmentSettings,
        'WTyssHtyTzu9_EbszSVhPw',
        {
          title: { type: 'string'; localized: true };
          rich_text: { type: 'rich_text'; localized: true; blocks: Block };
          structured_text: {
            type: 'structured_text';
            localized: true;
            blocks: Block;
            inline_blocks: Block;
          };
          single_block: {
            type: 'single_block';
            localized: true;
            blocks: Block;
          };
        }
      >;

      const landingPageModel = await client.itemTypes.create({
        id: 'WTyssHtyTzu9_EbszSVhPw',
        name: 'Landing Page',
        api_key: 'landing_page',
        draft_mode_active: true,
        all_locales_required: false,
      });

      await client.fields.create(landingPageModel.id, {
        label: 'Title',
        field_type: 'string',
        api_key: 'title',
        localized: true,
      });

      await client.fields.create(landingPageModel.id, {
        label: 'Modular content',
        field_type: 'rich_text',
        api_key: 'rich_text',
        localized: true,
        validators: {
          rich_text_blocks: { item_types: [blockModel.id] },
        },
      });

      await client.fields.create(landingPageModel.id, {
        label: 'Structured Text',
        field_type: 'structured_text',
        api_key: 'structured_text',
        localized: true,
        validators: {
          structured_text_links: { item_types: [landingPageModel.id] },
          structured_text_blocks: { item_types: [blockModel.id] },
          structured_text_inline_blocks: { item_types: [blockModel.id] },
        },
      });

      await client.fields.create(landingPageModel.id, {
        label: 'Single block',
        field_type: 'single_block',
        api_key: 'single_block',
        localized: true,
        validators: {
          single_block_blocks: { item_types: [blockModel.id] },
        },
      });

      // === Item Creation with Nested Data ===
      const item = await client.items.create<LandingPage>({
        title: { en: 'Level 0' },
        rich_text: {
          en: [
            {
              type: 'item',
              attributes: {
                title: 'Rich Text: Level 1',
                rich_text: [
                  buildBlockRecord<Block>({
                    title: 'Rich Text: Level 2',
                    item_type: blockModel,
                  }),
                ],
              },
              relationships: {
                item_type: { data: { id: blockModel.id, type: 'item_type' } },
              },
            },
          ],
        },
        single_block: {
          en: buildBlockRecord<Block>({
            title: 'Single Block: Level 1',
            single_block: buildBlockRecord<Block>({
              title: 'Single Block: Level 2',
              item_type: blockModel,
            }),
            item_type: blockModel,
          }),
        },
        structured_text: {
          en: {
            schema: 'dast',
            document: {
              type: 'root',
              children: [
                {
                  type: 'paragraph',
                  children: [
                    {
                      type: 'inlineBlock',
                      item: buildBlockRecord<Block>({
                        title: 'Structured Text: Level 1',
                        structured_text: {
                          schema: 'dast',
                          document: {
                            type: 'root',
                            children: [
                              {
                                type: 'block',
                                item: buildBlockRecord<Block>({
                                  title: 'Structured Text: Level 2',
                                  item_type: blockModel,
                                }),
                              },
                            ],
                          },
                        },
                        item_type: blockModel,
                      }),
                    },
                  ],
                },
              ],
            },
          },
        },
        item_type: { id: 'WTyssHtyTzu9_EbszSVhPw', type: 'item_type' },
      });

      // === Test Item Creation (Basic) ===
      expect(item.title.en!.toUpperCase()).toBe('LEVEL 0');
      expect(item.__itemTypeId).toBe(landingPageModel.id);
      expect(item.rich_text.en).toHaveLength(1);
      expect(item.rich_text.en!.every((id) => typeof id === 'string')).toBe(
        true,
      );
      expect(item.single_block.en).toEqual(expect.any(String));
      expect(
        findFirstNode(item.structured_text.en!, isInlineBlock)?.node.item,
      ).toEqual(expect.any(String));

      // === Test .find() with nested: true ===
      const nestedItem = await client.items.find<LandingPage>(item, {
        nested: true,
      });

      expect(nestedItem.title.en!.toUpperCase()).toBe('LEVEL 0');
      expect(nestedItem.__itemTypeId).toBe(landingPageModel.id);
      expect(nestedItem.rich_text.en).toHaveLength(1);
      expect(
        nestedItem.rich_text.en![0]!.attributes.rich_text[0]!.attributes.title!.toUpperCase(),
      ).toBe('RICH TEXT: LEVEL 2');
      expect(
        nestedItem.rich_text.en![0]!.attributes.rich_text[0]!.__itemTypeId,
      ).toBe(blockModel.id);
      expect(
        nestedItem.single_block.en!.attributes.single_block!.attributes.title!.toUpperCase(),
      ).toBe('SINGLE BLOCK: LEVEL 2');
      expect(
        nestedItem.single_block.en!.attributes.single_block!.__itemTypeId,
      ).toBe(blockModel.id);
      expect(
        findFirstNode(
          nestedItem.structured_text.en!,
          isInlineBlock,
        )?.node.item.attributes.title!.toUpperCase(),
      ).toBe('STRUCTURED TEXT: LEVEL 1');
      expect(
        findFirstNode(nestedItem.structured_text.en!, isInlineBlock)?.node.item
          .__itemTypeId,
      ).toBe(blockModel.id);

      // === Test .list() without nested ===
      const listedItems = await client.items.list<LandingPage>({
        filter: { type: landingPageModel.id },
        version: 'current',
      });
      expect(listedItems).toHaveLength(1);
      expect(listedItems[0]!.title.en!.toUpperCase()).toBe('LEVEL 0');
      expect(listedItems[0]!.__itemTypeId).toBe(landingPageModel.id);

      // === Test .list() with nested: true ===
      const nestedListedItems = await client.items.list<LandingPage>({
        filter: { type: landingPageModel.id },
        version: 'current',
        nested: true,
      });
      expect(nestedListedItems).toHaveLength(1);
      expect(nestedListedItems[0]!.title.en!.toUpperCase()).toBe('LEVEL 0');
      expect(nestedListedItems[0]!.__itemTypeId).toBe(landingPageModel.id);
      expect(nestedListedItems[0]!.rich_text.en).toHaveLength(1);
      expect(
        nestedListedItems[0]!.rich_text.en![0]!.attributes.rich_text[0]!.attributes.title!.toUpperCase(),
      ).toBe('RICH TEXT: LEVEL 2');
      expect(
        nestedListedItems[0]!.rich_text.en![0]!.attributes.rich_text[0]!
          .__itemTypeId,
      ).toBe(blockModel.id);
      expect(
        nestedListedItems[0]!.single_block.en!.attributes.single_block!.attributes.title!.toUpperCase(),
      ).toBe('SINGLE BLOCK: LEVEL 2');
      expect(
        nestedListedItems[0]!.single_block.en!.attributes.single_block!
          .__itemTypeId,
      ).toBe(blockModel.id);
      expect(
        findFirstNode(
          nestedListedItems[0]!.structured_text.en!,
          isInlineBlock,
        )?.node.item.attributes.title!.toUpperCase(),
      ).toBe('STRUCTURED TEXT: LEVEL 1');
      expect(
        findFirstNode(nestedListedItems[0]!.structured_text.en!, isInlineBlock)
          ?.node.item.__itemTypeId,
      ).toBe(blockModel.id);

      // === Test .listPagedIterator() without nested ===
      let paginatedCount = 0;
      for await (const paginatedItem of client.items.listPagedIterator<LandingPage>(
        { filter: { type: landingPageModel.id }, version: 'current' },
      )) {
        expect(paginatedItem.title.en!.toUpperCase()).toBe('LEVEL 0');
        expect(paginatedItem.__itemTypeId).toBe(landingPageModel.id);
        paginatedCount++;
      }
      expect(paginatedCount).toBe(1);

      // === Test .listPagedIterator() with nested: true ===
      let nestedPaginatedCount = 0;
      for await (const nestedPaginatedItem of client.items.listPagedIterator<LandingPage>(
        {
          filter: { type: landingPageModel.id },
          version: 'current',
          nested: true,
        },
      )) {
        expect(nestedPaginatedItem.title.en!.toUpperCase()).toBe('LEVEL 0');
        expect(nestedPaginatedItem.__itemTypeId).toBe(landingPageModel.id);
        expect(nestedPaginatedItem.rich_text.en).toHaveLength(1);
        expect(
          nestedPaginatedItem.rich_text.en![0]!.attributes.rich_text[0]!.attributes.title!.toUpperCase(),
        ).toBe('RICH TEXT: LEVEL 2');
        expect(
          nestedPaginatedItem.rich_text.en![0]!.attributes.rich_text[0]!
            .__itemTypeId,
        ).toBe(blockModel.id);
        expect(
          nestedPaginatedItem.single_block.en!.attributes.single_block!.attributes.title!.toUpperCase(),
        ).toBe('SINGLE BLOCK: LEVEL 2');
        expect(
          nestedPaginatedItem.single_block.en!.attributes.single_block!
            .__itemTypeId,
        ).toBe(blockModel.id);
        expect(
          findFirstNode(
            nestedPaginatedItem.structured_text.en!,
            isInlineBlock,
          )?.node.item.attributes.title!.toUpperCase(),
        ).toBe('STRUCTURED TEXT: LEVEL 1');
        expect(
          findFirstNode(nestedPaginatedItem.structured_text.en!, isInlineBlock)
            ?.node.item.__itemTypeId,
        ).toBe(blockModel.id);
        nestedPaginatedCount++;
      }
      expect(nestedPaginatedCount).toBe(1);

      // === Test Item Operations (publish, unpublish, update, destroy) ===
      const publishResult = await client.items.publish<LandingPage>(item.id);
      expect(publishResult.title.en!.toUpperCase()).toBe('LEVEL 0');
      expect(publishResult.__itemTypeId).toBe(landingPageModel.id);

      const unpublishResult = await client.items.unpublish<LandingPage>(
        item.id,
      );
      expect(unpublishResult.title.en!.toUpperCase()).toBe('LEVEL 0');
      expect(unpublishResult.__itemTypeId).toBe(landingPageModel.id);

      const updateResult = await client.items.update<LandingPage>(item.id, {
        title: { en: 'Updated Level 0' },
      });
      expect(updateResult.title.en!.toUpperCase()).toBe('UPDATED LEVEL 0');
      expect(updateResult.__itemTypeId).toBe(landingPageModel.id);

      const destroyResult = await client.items.destroy<LandingPage>(item.id);
      expect(destroyResult.title.en!.toUpperCase()).toBe('UPDATED LEVEL 0');
      expect(destroyResult.__itemTypeId).toBe(landingPageModel.id);
    });
  });

  describe('raw methods with localized fields', () => {
    it.concurrent('field values are correctly typed', async () => {
      const client = await generateNewCmaClient();

      // === Type Definitions ===

      type EnvironmentSettings = { locales: 'en' | 'it' };

      type Block = ItemTypeDefinition<
        EnvironmentSettings,
        string,
        {
          title: { type: 'string' };
          rich_text: { type: 'rich_text'; blocks: Block };
          structured_text: {
            type: 'structured_text';
            blocks: Block;
            inline_blocks: Block;
          };
          single_block: { type: 'single_block'; blocks: Block };
        }
      >;

      // === Block Model Setup ===
      const blockModel = await client.itemTypes.create({
        name: 'Block',
        api_key: 'block',
        modular_block: true,
      });

      await client.fields.create(blockModel, {
        label: 'Title',
        field_type: 'string',
        api_key: 'title',
      });

      await client.fields.create(blockModel, {
        label: 'Modular content',
        field_type: 'rich_text',
        api_key: 'rich_text',
        validators: {
          rich_text_blocks: { item_types: [blockModel.id] },
        },
      });

      await client.fields.create(blockModel, {
        label: 'Structured Text',
        field_type: 'structured_text',
        api_key: 'structured_text',
        validators: {
          structured_text_links: { item_types: [] },
          structured_text_blocks: { item_types: [blockModel.id] },
          structured_text_inline_blocks: { item_types: [blockModel.id] },
        },
      });

      await client.fields.create(blockModel, {
        label: 'Single block',
        field_type: 'single_block',
        api_key: 'single_block',
        validators: {
          single_block_blocks: { item_types: [blockModel.id] },
        },
      });

      // === Landing Page Model Setup ===
      type LandingPage = ItemTypeDefinition<
        EnvironmentSettings,
        'WTyssHtyTzu9_EbszSVhPw',
        {
          title: { type: 'string'; localized: true };
          rich_text: { type: 'rich_text'; localized: true; blocks: Block };
          structured_text: {
            type: 'structured_text';
            localized: true;
            blocks: Block;
            inline_blocks: Block;
          };
          single_block: {
            type: 'single_block';
            localized: true;
            blocks: Block;
          };
        }
      >;

      const landingPageModel = await client.itemTypes.create({
        id: 'WTyssHtyTzu9_EbszSVhPw',
        name: 'Landing Page',
        api_key: 'landing_page',
        draft_mode_active: true,
      });

      await client.fields.create(landingPageModel.id, {
        label: 'Title',
        field_type: 'string',
        api_key: 'title',
        localized: true,
      });

      await client.fields.create(landingPageModel.id, {
        label: 'Modular content',
        field_type: 'rich_text',
        api_key: 'rich_text',
        localized: true,
        validators: {
          rich_text_blocks: { item_types: [blockModel.id] },
        },
      });

      await client.fields.create(landingPageModel.id, {
        label: 'Structured Text',
        field_type: 'structured_text',
        api_key: 'structured_text',
        localized: true,
        validators: {
          structured_text_links: { item_types: [landingPageModel.id] },
          structured_text_blocks: { item_types: [blockModel.id] },
          structured_text_inline_blocks: { item_types: [blockModel.id] },
        },
      });

      await client.fields.create(landingPageModel.id, {
        label: 'Single block',
        field_type: 'single_block',
        api_key: 'single_block',
        localized: true,
        validators: {
          single_block_blocks: { item_types: [blockModel.id] },
        },
      });

      // === Item Creation with Nested Data (Raw) ===
      const { data: item } = await client.items.rawCreate<LandingPage>({
        data: {
          type: 'item',
          attributes: {
            title: { en: 'Level 0' },
            rich_text: {
              en: [
                {
                  type: 'item',
                  attributes: {
                    title: 'Rich Text: Level 1',
                    rich_text: [
                      buildBlockRecord<Block>({
                        title: 'Rich Text: Level 2',
                        item_type: blockModel,
                      }),
                    ],
                  },
                  relationships: {
                    item_type: {
                      data: { id: blockModel.id, type: 'item_type' },
                    },
                  },
                },
              ],
            },
            single_block: {
              en: buildBlockRecord<Block>({
                title: 'Single Block: Level 1',
                single_block: buildBlockRecord<Block>({
                  title: 'Single Block: Level 2',
                  item_type: blockModel,
                }),
                item_type: blockModel,
              }),
            },
            structured_text: {
              en: {
                schema: 'dast',
                document: {
                  type: 'root',
                  children: [
                    {
                      type: 'paragraph',
                      children: [
                        {
                          type: 'inlineBlock',
                          item: buildBlockRecord<Block>({
                            title: 'Structured Text: Level 1',
                            structured_text: {
                              schema: 'dast',
                              document: {
                                type: 'root',
                                children: [
                                  {
                                    type: 'block',
                                    item: buildBlockRecord<Block>({
                                      title: 'Structured Text: Level 2',
                                      item_type: blockModel,
                                    }),
                                  },
                                ],
                              },
                            },
                            item_type: blockModel,
                          }),
                        },
                      ],
                    },
                  ],
                },
              },
            },
          },
          relationships: {
            item_type: {
              data: { id: 'WTyssHtyTzu9_EbszSVhPw', type: 'item_type' },
            },
          },
        },
      });

      // === Test .rawFind() with nested: true ===
      const { data: rawNestedItem } = await client.items.rawFind<LandingPage>(
        item.id,
        {
          nested: true,
        },
      );

      expect(rawNestedItem.attributes.title.en!.toUpperCase()).toBe('LEVEL 0');
      expect(rawNestedItem.relationships.item_type.data.id).toBe(
        landingPageModel.id,
      );
      expect(rawNestedItem.__itemTypeId).toBe(landingPageModel.id);
      expect(rawNestedItem.attributes.rich_text.en).toHaveLength(1);
      expect(
        rawNestedItem.attributes.rich_text.en![0]!.attributes.rich_text[0]!.attributes.title!.toUpperCase(),
      ).toBe('RICH TEXT: LEVEL 2');
      expect(
        rawNestedItem.attributes.rich_text.en![0]!.attributes.rich_text[0]!
          .__itemTypeId,
      ).toBe(blockModel.id);
      expect(
        rawNestedItem.attributes.single_block.en!.attributes.single_block!.attributes.title!.toUpperCase(),
      ).toBe('SINGLE BLOCK: LEVEL 2');
      expect(
        rawNestedItem.attributes.single_block.en!.attributes.single_block!
          .__itemTypeId,
      ).toBe(blockModel.id);
      expect(
        findFirstNode(
          rawNestedItem.attributes.structured_text.en!,
          isInlineBlock,
        )?.node.item.attributes.title!.toUpperCase(),
      ).toBe('STRUCTURED TEXT: LEVEL 1');
      expect(
        findFirstNode(
          rawNestedItem.attributes.structured_text.en!,
          isInlineBlock,
        )?.node.item.__itemTypeId,
      ).toBe(blockModel.id);

      // === Test .rawList() without nested ===
      const { data: rawListedItems } = await client.items.rawList<LandingPage>({
        filter: { type: landingPageModel.id },
        version: 'current',
      });
      expect(rawListedItems).toHaveLength(1);
      expect(rawListedItems[0]!.attributes.title.en!.toUpperCase()).toBe(
        'LEVEL 0',
      );
      expect(rawListedItems[0]!.relationships.item_type.data.id).toBe(
        landingPageModel.id,
      );
      expect(rawListedItems[0]!.__itemTypeId).toBe(landingPageModel.id);
      expect(rawListedItems[0]!.attributes.rich_text.en).toHaveLength(1);
      expect(
        rawListedItems[0]!.attributes.rich_text.en!.every(
          (id) => typeof id === 'string',
        ),
      ).toBe(true);
      expect(rawListedItems[0]!.attributes.single_block.en).toEqual(
        expect.any(String),
      );
      expect(
        findFirstNode(
          rawListedItems[0]!.attributes.structured_text.en!,
          isInlineBlock,
        )?.node.item,
      ).toEqual(expect.any(String));

      // === Test .rawList() with nested: true ===
      const { data: rawNestedListedItems } =
        await client.items.rawList<LandingPage>({
          filter: { type: landingPageModel.id },
          version: 'current',
          nested: true,
        });
      expect(rawNestedListedItems).toHaveLength(1);
      expect(rawNestedListedItems[0]!.attributes.title.en!.toUpperCase()).toBe(
        'LEVEL 0',
      );
      expect(rawNestedListedItems[0]!.relationships.item_type.data.id).toBe(
        landingPageModel.id,
      );
      expect(rawNestedListedItems[0]!.__itemTypeId).toBe(landingPageModel.id);
      expect(rawNestedListedItems[0]!.attributes.rich_text.en).toHaveLength(1);
      expect(
        rawNestedListedItems[0]!.attributes.rich_text.en![0]!.attributes.rich_text[0]!.attributes.title!.toUpperCase(),
      ).toBe('RICH TEXT: LEVEL 2');
      expect(
        rawNestedListedItems[0]!.attributes.rich_text.en![0]!.attributes
          .rich_text[0]!.__itemTypeId,
      ).toBe(blockModel.id);
      expect(
        rawNestedListedItems[0]!.attributes.single_block.en!.attributes.single_block!.attributes.title!.toUpperCase(),
      ).toBe('SINGLE BLOCK: LEVEL 2');
      expect(
        rawNestedListedItems[0]!.attributes.single_block.en!.attributes
          .single_block!.__itemTypeId,
      ).toBe(blockModel.id);
      expect(
        findFirstNode(
          rawNestedListedItems[0]!.attributes.structured_text.en!,
          isInlineBlock,
        )?.node.item.attributes.title!.toUpperCase(),
      ).toBe('STRUCTURED TEXT: LEVEL 1');
      expect(
        findFirstNode(
          rawNestedListedItems[0]!.attributes.structured_text.en!,
          isInlineBlock,
        )?.node.item.__itemTypeId,
      ).toBe(blockModel.id);

      // === Test .rawListPagedIterator() without nested ===
      let rawPaginatedCount = 0;
      for await (const rawPaginatedItem of client.items.rawListPagedIterator<LandingPage>(
        { filter: { type: landingPageModel.id }, version: 'current' },
      )) {
        expect(rawPaginatedItem.attributes.title.en!.toUpperCase()).toBe(
          'LEVEL 0',
        );
        expect(rawPaginatedItem.relationships.item_type.data.id).toBe(
          landingPageModel.id,
        );
        expect(rawPaginatedItem.__itemTypeId).toBe(landingPageModel.id);
        expect(rawPaginatedItem.attributes.rich_text.en).toHaveLength(1);
        expect(
          rawPaginatedItem.attributes.rich_text.en!.every(
            (id) => typeof id === 'string',
          ),
        ).toBe(true);
        expect(rawPaginatedItem.attributes.single_block.en).toEqual(
          expect.any(String),
        );
        expect(
          findFirstNode(
            rawPaginatedItem.attributes.structured_text.en!,
            isInlineBlock,
          )?.node.item,
        ).toEqual(expect.any(String));
        rawPaginatedCount++;
      }
      expect(rawPaginatedCount).toBe(1);

      // === Test .rawListPagedIterator() with nested: true ===
      let rawNestedPaginatedCount = 0;
      for await (const rawNestedPaginatedItem of client.items.rawListPagedIterator<LandingPage>(
        {
          filter: { type: landingPageModel.id },
          version: 'current',
          nested: true,
        },
      )) {
        expect(rawNestedPaginatedItem.attributes.title.en!.toUpperCase()).toBe(
          'LEVEL 0',
        );
        expect(rawNestedPaginatedItem.relationships.item_type.data.id).toBe(
          landingPageModel.id,
        );
        expect(rawNestedPaginatedItem.__itemTypeId).toBe(landingPageModel.id);
        expect(rawNestedPaginatedItem.attributes.rich_text.en).toHaveLength(1);
        expect(
          rawNestedPaginatedItem.attributes.rich_text.en![0]!.attributes.rich_text[0]!.attributes.title!.toUpperCase(),
        ).toBe('RICH TEXT: LEVEL 2');
        expect(
          rawNestedPaginatedItem.attributes.rich_text.en![0]!.attributes
            .rich_text[0]!.__itemTypeId,
        ).toBe(blockModel.id);
        expect(
          rawNestedPaginatedItem.attributes.single_block.en!.attributes.single_block!.attributes.title!.toUpperCase(),
        ).toBe('SINGLE BLOCK: LEVEL 2');
        expect(
          rawNestedPaginatedItem.attributes.single_block.en!.attributes
            .single_block!.__itemTypeId,
        ).toBe(blockModel.id);
        expect(
          findFirstNode(
            rawNestedPaginatedItem.attributes.structured_text.en!,
            isInlineBlock,
          )?.node.item.attributes.title!.toUpperCase(),
        ).toBe('STRUCTURED TEXT: LEVEL 1');
        expect(
          findFirstNode(
            rawNestedPaginatedItem.attributes.structured_text.en!,
            isInlineBlock,
          )?.node.item.__itemTypeId,
        ).toBe(blockModel.id);
        rawNestedPaginatedCount++;
      }
      expect(rawNestedPaginatedCount).toBe(1);
    });
  });
});
