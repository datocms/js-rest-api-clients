import { generateNewCmaClient } from '../../../jest-helpers/generateNewCmaClient';
import { generateId } from '../../cma-client/src';

describe('upload collection', () => {
  it.concurrent('create, find, list, update, destroy', async () => {
    const client = await generateNewCmaClient();

    const menuItem = await client.uploadCollections.create({
      label: 'Browse Articles',
      position: 1,
    });

    expect(menuItem.label).toEqual('Browse Articles');

    const foundUploadCollections =
      await client.uploadCollections.find(menuItem);
    expect(foundUploadCollections.id).toEqual(menuItem.id);

    const allUploadCollections = await client.uploadCollections.list();
    expect(allUploadCollections).toHaveLength(1);

    const updatedUploadCollections = await client.uploadCollections.update(
      menuItem,
      {
        ...menuItem,
        label: 'Updated',
      },
    );
    expect(updatedUploadCollections.label).toEqual('Updated');

    await client.uploadCollections.destroy(menuItem);
    expect(await client.uploadCollections.list()).toHaveLength(0);
  });

  it.concurrent('create with explicit ID', async () => {
    const client = await generateNewCmaClient();

    const newId = generateId();

    const menuItem = await client.uploadCollections.create({
      id: newId,
      label: 'Browse Articles',
      position: 1,
    });

    expect(menuItem.id).toEqual(newId);
  });
});
