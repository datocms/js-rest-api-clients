import { generateNewCmaClient } from './helpers/generateClients';

describe('item type', () => {
  test('create, find, all, duplicate, update, destroy', async () => {
    const client = await generateNewCmaClient();

    const itemType = await client.itemTypes.create({
      name: 'Article',
      api_key: 'article',
      singleton: true,
      sortable: false,
      modular_block: false,
      tree: false,
      ordering_direction: null,
      draft_mode_active: false,
      all_locales_required: true,
      ordering_field: null,
      title_field: null,
    });
    expect(itemType.name).toEqual('Article');

    const foundItemType = await client.itemTypes.find(itemType);
    expect(foundItemType.id).toEqual(itemType.id);

    const duplicated = await client.itemTypes.duplicate(itemType);
    expect(duplicated.name).toEqual('Article (copy #1)');

    const allItemTypes = await client.itemTypes.list();
    expect(allItemTypes).toHaveLength(2);

    const field = await client.fields.create(itemType, {
      label: 'Title',
      api_key: 'title',
      field_type: 'string',
    });
    expect(field.label).toEqual('Title');

    const updatedItemType = await client.itemTypes.update(itemType, {
      name: 'UpdatedArticle',
      title_field: field,
    });
    expect(updatedItemType.name).toEqual('UpdatedArticle');
    expect(updatedItemType.title_field?.id).toEqual(field.id);

    await client.itemTypes.destroy(itemType.id);
  });
});
