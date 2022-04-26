import { generateNewCmaClient } from './helpers/generateClients';
import { ApiError } from '../src';

describe('item', () => {
  test('methods', async () => {
    const client = await generateNewCmaClient();
    it('batchDestroy works', async () => {
      const itemType = await client.itemTypes.create({
        name: 'Article',
        api_key: 'article',
        singleton: true,
        modular_block: false,
        sortable: false,
        tree: false,
        draft_mode_active: false,
        ordering_direction: null,
        ordering_field: null,
        all_locales_required: true,
        title_field: null,
      });

      await client.fields.create(itemType.id, {
        label: 'Title',
        field_type: 'string',
        localized: false,
        api_key: 'title',
        validators: {},
      });

      const item = await client.items.create({
        title: 'My first blog post',
        item_type: itemType,
      });

      await client.items.bulkDestroy({
        items: {
          data: [item],
        },
      });

      const allItems = await client.items.list();
      expect(allItems).toHaveLength(0);
    });

    it('bulk publish/unpublish/destroy works', async () => {
      const itemType = await client.itemTypes.create({
        name: 'Article',
        api_key: 'article',
        singleton: true,
        modular_block: false,
        sortable: false,
        tree: false,
        draft_mode_active: true,
        ordering_direction: null,
        ordering_field: null,
        all_locales_required: true,
        title_field: null,
      });

      await client.fields.create(itemType.id, {
        label: 'Title',
        field_type: 'string',
        localized: false,
        api_key: 'title',
        validators: {},
      });

      const item = await client.items.create({
        title: 'My first blog post',
        item_type: itemType,
      });

      // qui ci dovrebbe essere data?
      await client.items.bulkPublish({
        items: {
          data: [
            {
              type: 'item',
              id: item.id,
            },
          ],
        },
      });

      const item1 = await client.items.find(item.id);
      expect(item1.meta.status).toEqual('published');

      await client.items.bulkUnpublish({
        items: {
          data: [
            {
              type: 'item',
              id: item.id,
            },
          ],
        },
      });

      const item2 = await client.items.find(item.id);
      expect(item2.meta.status).toEqual('draft');

      await client.items.bulkDestroy({
        items: {
          data: [
            {
              type: 'item',
              id: item.id,
            },
          ],
        },
      });

      const allItems = await client.items.list();
      expect(allItems).toHaveLength(0);
    });

    it('create, find, all, update, destroy', async () => {
      const itemType = await client.itemTypes.create({
        name: 'Article',
        api_key: 'item_type',
        singleton: true,
        modular_block: false,
        sortable: false,
        tree: false,
        draft_mode_active: false,
        ordering_direction: null,
        ordering_field: null,
        all_locales_required: true,
        title_field: null,
      });

      await client.fields.create(itemType.id, {
        label: 'Title',
        field_type: 'string',
        localized: false,
        api_key: 'title',
        validators: { required: {} },
      });

      await client.fields.create(itemType.id, {
        label: 'Attachment',
        field_type: 'file',
        localized: false,
        api_key: 'attachment',
        validators: { required: {} },
      });

      const date = '2018-11-24T10:00';

      const item = await client.items.create({
        title: 'My first blog post',
        item_type: itemType,
        attachment: await client.uploadFile(
          'test/fixtures/newTextFileHttps.txt',
        ),
        meta: {
          created_at: date,
          first_published_at: date,
          // updated_at and published_at cannot be edited
          updated_at: date,
          published_at: date,
        },
      });

      expect(item.title).toEqual('My first blog post');
      expect(item.itemType).not.toBeUndefined();
      expect(item.meta.created_at).toEqual('2018-11-24T10:00:00.000+00:00');
      expect(item.meta.first_published_at).toEqual(
        '2018-11-24T10:00:00.000+00:00',
      );
      expect(item.meta.updated_at).not.toEqual('2018-11-24T10:00:00.000+00:00');
      expect(item.meta.published_at).not.toEqual(
        '2018-11-24T10:00:00.000+00:00',
      );

      const foundItem = await client.items.find(item.id);
      expect(foundItem.id).toEqual(item.id);
      expect(foundItem.itemType).not.toBeUndefined();

      // TODO
      // "nested": {
      //   "description": "For Modular Content fields and Structured Text fields. If set, returns full payload for nested blocks instead of IDs",
      //   "example": "true",
      //   "type": ["string"]
      // },

      const allItems = await client.items.list({
        filter: {
          type: itemType.id,
        },
        page: {
          offset: 0,
          limit: 10,
        },
        order_by: 'title_ASC',
        version: 'current',
        locale: 'en',
        nested: 'true',
      });

      expect(allItems).toHaveLength(1);
      expect(allItems[0].itemType).not.toBeUndefined();

      const updatedItem = await client.items.update(
        item.id,
        u({ title: 'Updated' }, item),
      );
      expect(updatedItem.title).toEqual('Updated');

      const updatedItem2 = await client.items.update(item.id, {
        title: 'Updated 2',
      });
      expect(updatedItem2.title).toEqual('Updated 2');

      await client.items.destroy(item.id);
    });

    it('optimistic locking', async () => {
      const itemType = await client.itemTypes.create({
        name: 'Article',
        api_key: 'item_type',
        singleton: true,
        modular_block: false,
        sortable: false,
        tree: false,
        draft_mode_active: false,
        ordering_direction: null,
        ordering_field: null,
        all_locales_required: true,
        title_field: null,
      });

      await client.fields.create(itemType.id, {
        label: 'Title',
        field_type: 'string',
        localized: false,
        api_key: 'title',
        validators: { required: {} },
      });

      const item = await client.items.create({
        title: 'My first blog post',
        item_type: itemType,
      });

      const updatedItem = await client.items.update(item.id, {
        title: 'Updated title',
      });

      expect(item.meta.current_version).not.toEqual(
        updatedItem.meta.current_version,
      );

      return expect(
        client.items.update(item.id, {
          title: 'Stale update title',
          meta: { current_version: item.meta.current_version },
        }),
      ).rejects.toEqual(ApiError);
    });
    // '422 STALE_ITEM_VERSION (details: {})'

    it('creation accepts uncamelized keys', async () => {
      const itemType = await client.itemTypes.create({
        name: 'Article',
        api_key: 'item_type',
        singleton: true,
        modular_block: false,
        sortable: false,
        tree: false,
        draft_mode_active: false,
        ordering_direction: null,
        ordering_field: null,
        all_locales_required: true,
        title_field: null,
      });

      await client.fields.create(itemType.id, {
        label: 'Title',
        field_type: 'string',
        localized: false,
        api_key: 'title',
        validators: { required: {} },
      });

      await client.fields.create(itemType.id, {
        label: 'Main content',
        field_type: 'text',
        localized: false,
        api_key: 'main_content',
        validators: {
          required: {},
        },
      });

      const item = await client.items.create({
        title: 'My first blog post',
        item_type: itemType,
        main_content: 'Foo bar',
      });

      expect(item.mainContent).toEqual('Foo bar');

      await client.items.destroy(item.id);
    });

    it('modular blocks', async () => {
      const articleItemType = await client.itemTypes.create({
        name: 'Article',
        api_key: 'article',
      });

      const contentItemType = await client.itemTypes.create({
        name: 'Content',
        api_key: 'content',
        modular_block: true,
      });

      await client.fields.create(contentItemType.id, {
        label: 'Text',
        field_type: 'text',
        api_key: 'text',
      });

      await client.fields.create(articleItemType.id, {
        label: 'Content',
        field_type: 'rich_text',
        api_key: 'content',
        validators: { richTextBlocks: { itemTypes: [contentItemType.id] } },
      });

      const content = [
        {
          type: 'item',
          attributes: {
            text: 'Foo',
          },
          relationships: {
            item_type: {
              data: {
                id: contentItemType.id,
                type: 'item_type',
              },
            },
          },
        },
        {
          type: 'item',
          attributes: {
            text: 'Bar',
          },
          relationships: {
            item_type: {
              data: {
                id: contentItemType.id,
                type: 'item_type',
              },
            },
          },
        },
      ];

      const item = await client.items.create({
        item_type: articleItemType,
        content,
      });

      expect(item.content.length).toEqual(2);

      const itemWithNestedBlocks = await client.items.find(item.id, {
        nested: 'true',
      });

      // TODO Argument of type '{ content: any; }' is not assignable to parameter of type 'ItemUpdateSchema'.
      // Object literal may only specify known properties, and 'content' does not exist in type 'ItemUpdateSchema'.
      await client.items.update(item.id, {
        content: itemWithNestedBlocks.content.map((block) => ({
          ...block,
          attributes: {
            ...block.attributes,
            text: `Updated ${block.attributes.text}`,
          },
        })),
      });

      const updatedItemWithNestedBlocks = await client.items.find(item.id, {
        nested: 'true',
      });

      expect(updatedItemWithNestedBlocks.content[0].attributes.text).toEqual(
        'Updated Foo',
      );
      expect(updatedItemWithNestedBlocks.content[1].attributes.text).toEqual(
        'Updated Bar',
      );
    });
  });
});
