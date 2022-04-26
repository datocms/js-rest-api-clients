import { generateNewCmaClient } from './helpers/generateClients';

describe('itemTypeFilters', () => {
  test('create, find, all, update, destroy', async () => {
    const client = await generateNewCmaClient();

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

    // TODO: relationships non èrequired dallo ItemTypeFilterCreateSchema
    const filter = await client.itemTypeFilters.create({
      name: 'My filter',
      shared: true,
      filter: {
        status: {
          eq: 'draft',
        },
      },
    });
    expect(filter.name).toEqual('My filter');

    const foundFilters = await client.itemTypeFilters.find(filter);
    expect(foundFilters.id).toEqual(filter.id);

    const allFilters = await client.itemTypeFilters.list();
    expect(allFilters).toHaveLength(1);

    const updatedFilters = await client.itemTypeFilters.update(filter, {
      ...filter,
      name: 'Updated',
    });
    expect(updatedFilters.name).toEqual('Updated');

    await client.itemTypeFilters.destroy(filter);
    expect(await client.itemTypeFilters.list()).toHaveLength(0);
  });
});
