import { generateNewCmaClient } from '../../../jest-helpers/generateNewCmaClient';
import { generateId } from '../../cma-client/src';

describe('uploadFilters', () => {
  test('create, find, all, update, destroy', async () => {
    const client = await generateNewCmaClient();

    const filter = await client.uploadFilters.create({
      name: 'My filter',
      shared: true,
      filter: {
        in_use: {
          eq: false,
        },
      },
    });
    expect(filter.name).toEqual('My filter');

    const foundFilters = await client.uploadFilters.find(filter);
    expect(foundFilters.id).toEqual(filter.id);

    const allFilters = await client.uploadFilters.list();
    expect(allFilters).toHaveLength(1);

    const updatedFilters = await client.uploadFilters.update(filter, {
      ...filter,
      name: 'Updated',
    });
    expect(updatedFilters.name).toEqual('Updated');

    await client.uploadFilters.destroy(filter);
    expect(await client.uploadFilters.list()).toHaveLength(0);
  });

  it.concurrent('create with explicit ID', async () => {
    const client = await generateNewCmaClient();

    const newId = generateId();

    const filter = await client.uploadFilters.create({
      id: newId,
      name: 'My filter',
      shared: true,
      filter: {
        in_use: {
          eq: false,
        },
      },
    });
    expect(filter.id).toEqual(newId);
  });
});
