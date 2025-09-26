import { type RawApiTypes, buildBlockRecord } from '@datocms/cma-client';
import { generateNewCmaClient } from '../../../jest-helpers/generateNewCmaClient';

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

    const itemInNestedResponse = await client.items.find(item.id, {
      nested: true,
    });

    const block = itemInNestedResponse.content as RawApiTypes.Item;

    await client.items.update(item.id, {
      content: buildBlockRecord({
        id: block.id,
        text: `Updated ${block.attributes.text}`,
        item_type: block.relationships.item_type.data,
      }),
    });

    const updatedItemInNestedResponse = await client.items.find(item.id, {
      nested: true,
    });

    const updatedBlock =
      updatedItemInNestedResponse.content as RawApiTypes.Item;

    expect(updatedBlock.attributes.text).toEqual('Updated Foo');
  });
});
