import { expect } from 'chai';
/* global generateNewAccountClient:true */

import u from 'updeep';
import b from 'unist-builder';
import unistMap from 'unist-util-map';
import { isBlock } from 'datocms-structured-text-utils';
import { SiteClient, buildModularBlock, ApiException } from '../../src/index';

describe('Site API', () => {
  describe('item', () => {
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
        itemType: itemType.id,
      });

      await client.items.batchDestroy({ filter: { ids: item.id } });

      const allItems = await client.items.all();
      expect(allItems).toHaveLength(0);
    });

    it('batch publish/unpublish works', async () => {
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
        itemType: itemType.id,
      });

      await client.items.batchPublish({ 'filter[ids]': item.id });

      const item1 = await client.items.find(item.id);
      expect(item1.meta.status).toEqual('published');

      await client.items.batchUnpublish({ filter: { ids: item.id } });

      const item2 = await client.items.find(item.id);
      expect(item2.meta.status).toEqual('draft');
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
        itemType: itemType.id,
      });

      await client.items.bulkPublish({ items: [item.id] });

      const item1 = await client.items.find(item.id);
      expect(item1.meta.status).toEqual('published');

      await client.items.bulkUnpublish({ items: [item.id] });

      const item2 = await client.items.find(item.id);
      expect(item2.meta.status).toEqual('draft');

      await client.items.bulkDestroy({ items: [item.id] });

      const allItems = await client.items.all();
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
        itemType: itemType.id,
        attachment: await client.uploadFile(
          'test/fixtures/newTextFileHttps.txt',
        ),
        meta: {
          createdAt: date,
          firstPublishedAt: date,
          // updatedAt and publishedAt cannot be edited
          updatedAt: date,
          publishedAt: date,
        },
      });

      expect(item.title).toEqual('My first blog post');
      expect(item.itemType).to.not.be.undefined();
      expect(item.meta.createdAt).toEqual('2018-11-24T10:00:00.000+00:00');
      expect(item.meta.firstPublishedAt).toEqual(
        '2018-11-24T10:00:00.000+00:00',
      );
      expect(item.meta.updatedAt).not.toEqual('2018-11-24T10:00:00.000+00:00');
      expect(item.meta.publishedAt).not.toEqual(
        '2018-11-24T10:00:00.000+00:00',
      );

      const foundItem = await client.items.find(item.id);
      expect(foundItem.id).toEqual(item.id);
      expect(foundItem.itemType).to.not.be.undefined();

      const allItems = await client.items.all({
        filter: {
          type: itemType.id,
        },
        page: {
          offset: 0,
          limit: 10,
        },
        orderBy: 'title_ASC',
        version: 'current',
        locale: 'en',
        nested: true,
      });

      expect(allItems).toHaveLength(1);
      expect(allItems[0].itemType).to.not.be.undefined();

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
        itemType: itemType.id,
      });

      const updatedItem = await client.items.update(item.id, {
        title: 'Updated title',
      });

      expect(item.meta.currentVersion).not.toEqual(
        updatedItem.meta.currentVersion,
      );

      return expect(
        client.items.update(item.id, {
          title: 'Stale update title',
          meta: { currentVersion: item.meta.currentVersion },
        }),
      ).to.be.rejectedWith(
        ApiException,
        '422 STALE_ITEM_VERSION (details: {})',
      );
    });

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
        item_type: itemType.id,
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

      const item = await client.items.create({
        itemType: articleItemType.id,
        content: [
          buildModularBlock({ itemType: contentItemType.id, text: 'Foo' }),
          buildModularBlock({ itemType: contentItemType.id, text: 'Bar' }),
        ],
      });

      expect(item.content.length).toEqual(2);

      const itemWithNestedBlocks = await client.items.find(item.id, {
        nested: true,
      });

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
        nested: true,
      });

      expect(updatedItemWithNestedBlocks.content[0].attributes.text).toEqual(
        'Updated Foo',
      );
      expect(updatedItemWithNestedBlocks.content[1].attributes.text).toEqual(
        'Updated Bar',
      );
    });
  });

  it('structured text', async () => {
    const articleItemType = await client.itemTypes.create({
      name: 'Article',
      api_key: 'article',
    });

    const contentItemType = await client.itemTypes.create({
      name: 'Block',
      api_key: 'block',
      modular_block: true,
    });

    await client.fields.create(contentItemType.id, {
      label: 'Text',
      field_type: 'text',
      api_key: 'text',
    });

    await client.fields.create(articleItemType.id, {
      label: 'Content',
      field_type: 'structured_text',
      api_key: 'content',
      validators: {
        structuredTextBlocks: { itemTypes: [contentItemType.id] },
        structuredTextLinks: { itemTypes: [] },
      },
    });

    const item = await client.items.create({
      itemType: articleItemType.id,
      content: {
        schema: 'dast',
        document: b('root', [
          b('heading', { level: 1 }, [b('span', 'This is the title!')]),
          b('paragraph', [
            b('span', 'And '),
            b('span', { marks: ['strong'] }, 'this'),
            b('span', ' is a paragraph!'),
          ]),
          b('block', {
            item: buildModularBlock({
              itemType: contentItemType.id,
              text: 'Foo',
            }),
          }),
        ]),
      },
    });

    expect(item.content.document.children.length).toEqual(3);

    const itemWithNestedBlocks = await client.items.find(item.id, {
      nested: true,
    });

    await client.items.update(item.id, {
      content: {
        ...itemWithNestedBlocks.content,
        document: unistMap(itemWithNestedBlocks.content.document, (node) => {
          return isBlock(node)
            ? {
                ...node,
                item: {
                  ...node.item,
                  attributes: {
                    ...node.item.attributes,
                    text: `Updated ${node.item.attributes.text}`,
                  },
                },
              }
            : node;
        }),
      },
    });

    const updatedItemWithNestedBlocks = await client.items.find(item.id, {
      nested: true,
    });

    expect(
      updatedItemWithNestedBlocks.content.document.children[2].item.attributes
        .text,
    ).toEqual('Updated Foo');
  });

  describe('plugins', () => {
    it('create, find, all, update, destroy', async () => {
      const plugin = await client.plugins.create({
        packageName: 'datocms-plugin-tag-editor',
      });

      await client.plugins.update(plugin.id, {
        parameters: { developmentMode: true },
      });

      await client.plugins.destroy(plugin.id);
    });
  });

  describe('environments', () => {
    it('all, find, fork, promote, destroy', async () => {
      const primaryEnvironment = await client.environments.find('main');

      const forkedEnvironment = await client.environments.fork(
        primaryEnvironment.id,
        {
          id: 'sandbox-test',
        },
      );

      await client.environments.promote(forkedEnvironment.id);

      await client.environments.promote(primaryEnvironment.id);

      await client.environments.destroy(forkedEnvironment.id);

      const environments = await client.environments.all();
      expect(environments.length).toEqual(1);
    });
  });
});
