import { generateNewCmaClient } from '../../../jest-helpers/generateNewCmaClient';
import { generateId } from '../../cma-client/src';

describe('itemTypeFilters', () => {
  it.concurrent('create, find, all, update, destroy', async () => {
    const client = await generateNewCmaClient();

    const itemType = await client.itemTypes.create({
      name: 'Article',
      api_key: 'item_type',
      singleton: true,
    });

    const filter = await client.itemTypeFilters.create({
      name: 'My filter',
      shared: true,
      item_type: itemType,
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

  it.concurrent('create with explicit ID', async () => {
    const client = await generateNewCmaClient();

    const newId = generateId();

    const itemType = await client.itemTypes.create({
      name: 'Article',
      api_key: 'item_type',
      singleton: true,
    });

    const filter = await client.itemTypeFilters.create({
      id: newId,
      name: 'My filter',
      shared: true,
      item_type: itemType,
      filter: {
        status: {
          eq: 'draft',
        },
      },
    });
    expect(filter.id).toEqual(newId);
  });
});
