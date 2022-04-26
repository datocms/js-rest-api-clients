import { generateNewCmaClient } from './helpers/generateClients';

describe('Fieldsets', () => {
  test('create, find, all, update, destroy, duplicate', async () => {
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

    const fieldset = await client.fieldsets.create(itemType, {
      title: 'My fieldset',
      position: 1,
      hint: 'foo bar',
      collapsible: true,
      start_collapsed: true,
    });

    expect(fieldset.title).toEqual('My fieldset');

    const foundMenuItems = await client.fieldsets.find(fieldset);
    expect(foundMenuItems.id).toEqual(fieldset.id);

    const allMenuItems = await client.fieldsets.list(itemType);
    expect(allMenuItems).toHaveLength(1);

    const updatedMenuItems = await client.fieldsets.update(fieldset, {
      ...fieldset,
      title: 'Updated',
    });
    expect(updatedMenuItems.title).toEqual('Updated');

    await client.fieldsets.destroy(fieldset);
    expect(await client.fieldsets.list(itemType)).toHaveLength(0);
  });
});
