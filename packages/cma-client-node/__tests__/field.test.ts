import { generateNewCmaClient } from '../../../jest-helpers/generateNewCmaClient';
import { generateId } from '../../cma-client/src';

describe('field', () => {
  it.concurrent('create, find, all, update, destroy', async () => {
    const client = await generateNewCmaClient();

    const itemType = await client.itemTypes.create({
      name: 'Article',
      api_key: 'article',
    });

    const field = await client.fields.create(itemType, {
      label: 'Image',
      field_type: 'file',
      localized: false,
      api_key: 'image',
      validators: { required: {} },
    });
    expect(field.label).toEqual('Image');

    const foundField = await client.fields.find(field);
    expect(foundField.id).toEqual(field.id);

    const allFields = await client.fields.list(itemType);
    expect(allFields).toHaveLength(1);

    const updatedField = await client.fields.update(field, {
      label: 'Updated',
    });
    expect(updatedField.label).toEqual('Updated');

    const duplicated = await client.fields.duplicate(field);
    expect(duplicated.label).toEqual('Updated (copy #1)');

    await client.fields.destroy(field);
  });

  it.concurrent('create with explicit ID', async () => {
    const client = await generateNewCmaClient();

    const newId = generateId();

    const itemType = await client.itemTypes.create({
      name: 'Article',
      api_key: 'article',
    });

    const field = await client.fields.create(itemType, {
      id: newId,
      label: 'Image',
      field_type: 'file',
      localized: false,
      api_key: 'image',
      validators: { required: {} },
    });
    expect(field.id).toEqual(newId);
  });
});
