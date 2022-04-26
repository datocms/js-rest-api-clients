import { generateNewCmaClient } from './helpers/generateClients';
import { u } from 'unist-builder';
import { map } from 'unist-util-map';
import { isBlock } from 'datocms-structured-text-utils';

describe('structured text', () => {
  test('create, update', async () => {
    const client = await generateNewCmaClient();

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

    const blockContent = {
      type: 'item',
      attributes: { text: 'Foo' },
      relationships: {
        item_type: {
          data: {
            id: contentItemType.id,
            type: 'item_type',
          },
        },
      },
    };

    const content = {
      schema: 'dast',
      document: u('root', [
        u('heading', { level: 1 }, [u('span', 'This is the title!')]),
        u('paragraph', [
          u('span', 'And '),
          u('span', { marks: ['strong'] }, 'this'),
          u('span', ' is a paragraph!'),
        ]),
        u('block', blockContent),
      ]),
    };

    // TODO vedi items.test
    const item = await client.items.create({
      item_type: { type: 'item_type', id: articleItemType.id },
      content,
    });

    expect(item.content.document.children.length).toEqual(3);

    const itemWithNestedBlocks = await client.items.find(item.id, {
      nested: true,
    });

    const newContent = {
      ...itemWithNestedBlocks.content,
      document: map(itemWithNestedBlocks.content.document, (node) => {
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
    };

    await client.items.update(item.id, {
      content: newContent,
    });

    const updatedItemWithNestedBlocks = await client.items.find(item.id, {
      nested: true,
    });

    expect(
      updatedItemWithNestedBlocks.content.document.children[2].item.attributes
        .text,
    ).toEqual('Updated Foo');
  });
});
