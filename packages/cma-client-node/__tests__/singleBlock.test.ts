import { generateNewCmaClient } from '../../../jest-helpers/generateNewCmaClient';
import { buildBlockRecord, SchemaTypes } from '@datocms/cma-client';

describe('single block', () => {
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
      field_type: 'single_block',
      api_key: 'content',
      validators: {
        single_block_blocks: { item_types: [contentItemType.id] },
        required: {},
      },
    });

    const item = await client.items.create({
      item_type: articleItemType,
      content: buildBlockRecord({
        text: 'Foo',
        item_type: contentItemType,
      }),
    });

    expect(typeof item.content).toBe('string');

    const itemWithNestedBlocks = await client.items.find(item.id, {
      nested: true,
    });

    const block = itemWithNestedBlocks.content as SchemaTypes.Item;

    await client.items.update(item.id, {
      content: buildBlockRecord({
        id: block.id,
        text: `Updated ${block.attributes.text}`,
        item_type: block.relationships.item_type.data,
      }),
    });

    const updatedItemWithNestedBlocks = await client.items.find(item.id, {
      nested: true,
    });

    const updatedBlock =
      updatedItemWithNestedBlocks.content as SchemaTypes.Item;

    expect(updatedBlock.attributes.text).toEqual('Updated Foo');
  });
});
