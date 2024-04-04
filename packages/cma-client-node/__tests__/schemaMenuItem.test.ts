import { generateNewCmaClient } from '../../../jest-helpers/generateNewCmaClient';
import { generateId } from '../../cma-client/src';

describe('menu item', () => {
  it.concurrent('create, find, list, update, destroy', async () => {
    const client = await generateNewCmaClient();

    const schemaMenuItem = await client.schemaMenuItems.create({
      kind: 'item_type',
      label: 'Editorial content',
      position: 1,
    });

    expect(schemaMenuItem.label).toEqual('Editorial content');

    const foundschemaMenuItems =
      await client.schemaMenuItems.find(schemaMenuItem);
    expect(foundschemaMenuItems.id).toEqual(schemaMenuItem.id);

    const allSchemaMenuItems = await client.schemaMenuItems.list();
    expect(allSchemaMenuItems).toHaveLength(1);

    const updatedschemaMenuItems = await client.schemaMenuItems.update(
      schemaMenuItem,
      {
        ...schemaMenuItem,
        label: 'Updated',
      },
    );
    expect(updatedschemaMenuItems.label).toEqual('Updated');

    await client.schemaMenuItems.destroy(schemaMenuItem);
    expect(await client.schemaMenuItems.list()).toHaveLength(0);
  });

  it.concurrent('create with explicit ID', async () => {
    const client = await generateNewCmaClient();

    const newId = generateId();

    const schemaMenuItem = await client.schemaMenuItems.create({
      id: newId,
      kind: 'item_type',
      label: 'Editorial content',
      position: 1,
    });

    expect(schemaMenuItem.id).toEqual(newId);
  });
});
