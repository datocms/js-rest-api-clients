import { generateNewCmaClient } from '../../../jest-helpers/generateNewCmaClient';
import { generateId } from '../../cma-client/src';
import { ApiError, type SchemaTypes, buildBlockRecord } from '../src';

describe('item', () => {
  it.concurrent('bulk publish/unpublish/destroy works', async () => {
    const client = await generateNewCmaClient();

    const itemType = await client.itemTypes.create({
      name: 'Article',
      api_key: 'article',
    });

    await client.fields.create(itemType.id, {
      label: 'Title',
      field_type: 'string',
      api_key: 'title',
    });

    const item = await client.items.create({
      title: 'My first blog post',
      item_type: itemType,
    });

    await client.items.bulkPublish({
      items: [item],
    });

    const item1 = await client.items.find(item.id);
    expect(item1.meta.status).toEqual('published');

    await client.items.bulkUnpublish({
      items: [item],
    });

    const item2 = await client.items.find(item.id);
    expect(item2.meta.status).toEqual('draft');

    await client.items.bulkDestroy({
      items: [item],
    });

    const allItems = await client.items.list();
    expect(allItems).toHaveLength(0);
  });

  it.concurrent('create, find, all, update, destroy, duplicate', async () => {
    const client = await generateNewCmaClient();

    const itemType = await client.itemTypes.create({
      name: 'Article',
      api_key: 'item_type',
    });

    await client.fields.create(itemType.id, {
      label: 'Title',
      field_type: 'string',
      api_key: 'title',
      validators: { required: {} },
    });

    await client.fields.create(itemType.id, {
      label: 'Attachment',
      field_type: 'file',
      api_key: 'attachment',
      validators: { required: {} },
    });

    const date = '2018-11-24T10:00';

    const item = await client.items.create({
      title: 'My first blog post',
      item_type: itemType,
      attachment: {
        upload_id: (
          await client.uploads.createFromLocalFile({
            localPath: `${__dirname}/fixtures/text.txt`,
          })
        ).id,
      },
      meta: {
        created_at: date,
        first_published_at: date,
        // updated_at and published_at cannot be edited
        updated_at: date,
        published_at: date,
      },
    });

    expect(item.title).toEqual('My first blog post');
    expect(item.item_type).not.toBeUndefined();
    expect(item.meta.created_at).toEqual('2018-11-24T10:00:00.000+00:00');
    expect(item.meta.first_published_at).toEqual(
      '2018-11-24T10:00:00.000+00:00',
    );
    expect(item.meta.updated_at).not.toEqual('2018-11-24T10:00:00.000+00:00');
    expect(item.meta.published_at).not.toEqual('2018-11-24T10:00:00.000+00:00');

    const foundItem = await client.items.find(item.id);
    expect(foundItem.id).toEqual(item.id);
    expect(foundItem.item_type).not.toBeUndefined();

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
      nested: true,
    });

    expect(allItems).toHaveLength(1);
    expect(allItems[0]!.item_type).not.toBeUndefined();

    const updatedItem = await client.items.update(item.id, {
      ...item,
      title: 'Updated',
    });

    expect(updatedItem.title).toEqual('Updated');

    const updatedItem2 = await client.items.update(item.id, {
      title: 'Updated 2',
    });
    expect(updatedItem2.title).toEqual('Updated 2');

    const duplicated = await client.items.duplicate(item.id);
    expect(duplicated.title).toEqual('Updated 2 (duplicate)');

    const list = await client.items.list({ version: 'current' });

    expect(list[0]!.title).toEqual('Updated 2 (duplicate)');

    await client.items.destroy(item.id);
  });

  it.concurrent('optimistic locking', async () => {
    const client = await generateNewCmaClient();

    const itemType = await client.itemTypes.create({
      name: 'Article',
      api_key: 'item_type',
    });

    await client.fields.create(itemType.id, {
      label: 'Title',
      field_type: 'string',
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
    ).rejects.toBeInstanceOf(ApiError);
  });

  it.concurrent('creation accepts uncamelized keys', async () => {
    const client = await generateNewCmaClient();

    const itemType = await client.itemTypes.create({
      name: 'Article',
      api_key: 'item_type',
    });

    await client.fields.create(itemType.id, {
      label: 'Title',
      field_type: 'string',
      api_key: 'title',
      validators: { required: {} },
    });

    await client.fields.create(itemType.id, {
      label: 'Main content',
      field_type: 'text',
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

    expect(item.main_content).toEqual('Foo bar');

    await client.items.destroy(item.id);
  });

  it.concurrent('modular blocks', async () => {
    const client = await generateNewCmaClient();

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
      validators: { rich_text_blocks: { item_types: [contentItemType.id] } },
    });

    const item = await client.items.create({
      item_type: articleItemType,
      content: [
        buildBlockRecord({
          text: 'Foo',
          item_type: contentItemType,
        }),
        buildBlockRecord({
          text: 'Bar',
          item_type: contentItemType,
        }),
      ],
    });

    expect((item.content as string[]).length).toEqual(2);

    const itemWithNestedBlocks = await client.items.find(item.id, {
      nested: true,
    });

    await client.items.update(item.id, {
      content: (itemWithNestedBlocks.content as SchemaTypes.Item[]).map(
        (block) =>
          buildBlockRecord({
            id: block.id,
            text: `Updated ${block.attributes.text}`,
            item_type: block.relationships.item_type.data,
          }),
      ),
    });

    const updatedItemWithNestedBlocks = await client.items.find(item.id, {
      nested: true,
    });

    const updatedContent =
      updatedItemWithNestedBlocks.content as SchemaTypes.Item[];

    expect(updatedContent[0]!.attributes.text).toEqual('Updated Foo');
    expect(updatedContent[1]!.attributes.text).toEqual('Updated Bar');
  });

  it.concurrent('create with explicit ID', async () => {
    const client = await generateNewCmaClient();

    const newId = generateId();

    const itemType = await client.itemTypes.create({
      name: 'Article',
      api_key: 'article',
    });

    await client.fields.create(itemType.id, {
      label: 'Title',
      field_type: 'string',
      api_key: 'title',
    });

    const item = await client.items.create({
      id: newId,
      title: 'My first blog post',
      item_type: itemType,
    });

    expect(item.id).toEqual(newId);
  });
});
