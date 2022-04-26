import { generateNewCmaClient } from './helpers/generateClients';
import { ApiError } from '../src';

describe('item versions', () => {
  test('find, list, restore', async () => {
    const client = await generateNewCmaClient();

    const itemType = await client.itemTypes.create({
      name: 'Article',
      api_key: 'blog_post',
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

    const date = '2018-11-24T10:00';

    const item = await client.items.create({
      title: 'My first blog post',
      item_type: itemType,
      meta: {
        created_at: date,
        first_published_at: date,
        // updated_at and published_at cannot be edited
        updated_at: date,
        published_at: date,
      },
    });

    const version = await client.itemVersions.find(item.meta.current_version);
    expect(version.title).toEqual('My first blog post');
    expect(version.item_type.id).toEqual(itemType.id);

    const updatedItem = await client.items.update(item.id, {
      title: 'Updated',
    });
    expect(updatedItem.meta.current_version).not.toEqual(version.id);
    expect(updatedItem.title).toEqual('Updated');

    const allVersions = await client.itemVersions.list(item);
    expect(allVersions).toHaveLength(2);

    await client.itemVersions.restore(version.id);
    expect(allVersions).toHaveLength(2);

    const restoredItem = await client.items.find(item);
    expect(restoredItem.title).toEqual('My first blog post');

    // TODO: listpagediterator non ritorna quello che dice la docs
    const listed = await client.itemVersions.listPagedIterator(item.id, {
      page: { limit: 1, offset: 1 },
    });
    expect(listed[0].title).toEqual('My first blog post');
  });
});
