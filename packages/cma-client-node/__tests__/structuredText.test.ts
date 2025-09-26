import { type RawApiTypes, buildBlockRecord } from '@datocms/cma-client';
import {
  type Block,
  type Document,
  type Node,
  isBlock,
} from 'datocms-structured-text-utils';
import u from 'unist-builder';
import map from 'unist-util-map';
import { generateNewCmaClient } from '../../../jest-helpers/generateNewCmaClient';

function isDastNode(node: unknown): node is Node {
  return !!(
    typeof node === 'object' &&
    node &&
    'type' in node &&
    typeof (node as any).type === 'string'
  );
}

describe('structured text', () => {
  it.concurrent('create, update', async () => {
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
        structured_text_blocks: { item_types: [contentItemType.id] },
        structured_text_links: { item_types: [] },
      },
    });

    const item = await client.items.create({
      item_type: articleItemType,
      content: {
        schema: 'dast',
        document: u('root', [
          u('heading', { level: 1 }, [u('span', 'This is the title!')]),
          u('paragraph', [
            u('span', 'And '),
            u('span', { marks: ['strong'] }, 'this'),
            u('span', ' is a paragraph!'),
          ]),
          u('block', {
            item: buildBlockRecord({
              text: 'Foo',
              item_type: contentItemType,
            }),
          }),
        ]),
      },
    });

    const content = item.content as Document;

    expect(content.document.children.length).toEqual(3);

    const itemInNestedResponse = await client.items.find(item.id, {
      nested: true,
    });

    const nestedContent = itemInNestedResponse.content as Document;

    const newContent = {
      ...nestedContent,
      document: map(nestedContent.document, (node) => {
        if (!(isDastNode(node) && isBlock(node))) {
          return node;
        }
        const item = node.item as any as RawApiTypes.Item;
        return {
          ...node,
          item: {
            ...item,
            attributes: {
              ...item.attributes,
              text: `Updated ${item.attributes.text}`,
            },
          },
        };
      }),
    };

    await client.items.update(item.id, {
      content: newContent,
    });

    const updatedItemInNestedResponse = await client.items.find(item.id, {
      nested: true,
    });

    const updatedNestedContent =
      updatedItemInNestedResponse.content as Document;

    const secondBlock = updatedNestedContent.document.children[2] as Block;

    expect(
      (secondBlock.item as any as RawApiTypes.Item).attributes.text,
    ).toEqual('Updated Foo');
  });
});
