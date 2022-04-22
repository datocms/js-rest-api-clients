import { expect } from 'chai';
/* global generateNewAccountClient:true */

import u from 'updeep';
import b from 'unist-builder';
import unistMap from 'unist-util-map';
import { isBlock } from 'datocms-structured-text-utils';
import { SiteClient, buildModularBlock, ApiException } from '../../src/index';

describe('Site API', () => {
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

      const environments = await client.environments.list();
      expect(environments.length).toEqual(1);
    });
  });
});
