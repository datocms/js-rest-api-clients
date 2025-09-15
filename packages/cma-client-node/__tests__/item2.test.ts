import { findFirstNode, isInlineBlock } from 'datocms-structured-text-utils';
import { generateNewCmaClient } from '../../../jest-helpers/generateNewCmaClient';
import { buildBlockRecord, type ItemTypeDefinition } from '../src';

describe('item (explicit typing with item definitions)', () => {
  describe('simple', () => {
    it.concurrent('item field values are correctly typed', async () => {
      const client = await generateNewCmaClient();

      type Block = ItemTypeDefinition<
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

      type LandingPage = ItemTypeDefinition<
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

      expect(item.title!.toUpperCase()).toBe('LEVEL 0');
      expect(item.__itemTypeId).toBe(landingPageModel.id);
      expect(item.rich_text).toHaveLength(1);
      expect(item.rich_text.every((id) => typeof id === 'string')).toBe(true);
      expect(item.single_block).toEqual(expect.any(String));
      expect(
        findFirstNode(item.structured_text!, isInlineBlock)?.node.item,
      ).toEqual(expect.any(String));

      const nestedItem = await client.items.find<LandingPage>(item, {
        nested: true,
      });

      expect(nestedItem.title?.toUpperCase()).toBe('LEVEL 0');
      expect(nestedItem.__itemTypeId).toBe(landingPageModel.id);
      expect(nestedItem.rich_text).toHaveLength(1);
      expect(
        nestedItem.rich_text[0]!.attributes.rich_text[0]!.attributes.title?.toUpperCase(),
      ).toBe('RICH TEXT: LEVEL 2');
      expect(
        nestedItem.rich_text[0]!.attributes.rich_text[0]!.__itemTypeId,
      ).toBe(blockModel.id);
      expect(
        nestedItem.single_block!.attributes.single_block!.attributes.title?.toUpperCase(),
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
    });
  });
});
