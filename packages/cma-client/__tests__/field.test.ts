import { generateNewCmaClient } from './helpers/generateClients';

describe('field', () => {
  test('create, find, all, update, destroy', async () => {
    const client = await generateNewCmaClient();

    const itemType = await client.itemTypes.create({
      name: 'Article',
      api_key: 'item_type',
      singleton: true,
      modular_block: false,
      tree: false,
      draft_mode_active: false,
      sortable: false,
      ordering_direction: null,
      all_locales_required: true,
    });

    const field = await client.fields.create(itemType.id, {
      label: 'Image',
      field_type: 'file',
      localized: false,
      api_key: 'image',
      validators: { required: {} },
    });
    expect(field.label).toEqual('Image');

    const foundField = await client.fields.find(field.id);
    expect(foundField.id).toEqual(field.id);

    const allFields = await client.fields.list(itemType.id);
    expect(allFields).toHaveLength(1);

    const updatedField = await client.fields.update(field.id, {
      label: 'Updated',
    });
    expect(updatedField.label).toEqual('Updated');

    const duplicated = await client.fields.duplicate(field.id);
    expect(duplicated.label).toEqual('Updated (copy #1)');

    await client.fields.destroy(field.id);
  });
});
