import { generateNewCmaClient } from '../../../jest-helpers/generateNewCmaClient';
import { generateId } from '../../cma-client/src';

describe('plugins', () => {
  it.concurrent('create, find, all, duplicate, update, destroy', async () => {
    const client = await generateNewCmaClient();
    const plugin = await client.plugins.create({
      package_name: 'datocms-plugin-tag-editor',
    });

    await client.plugins.fields(plugin.id);

    await client.plugins.update(plugin.id, {
      parameters: { development_mode: true },
    });

    await client.plugins.destroy(plugin.id);
  });

  it.concurrent('create with explicit ID', async () => {
    const client = await generateNewCmaClient();

    const newId = generateId();

    const plugin = await client.plugins.create({
      id: newId,
      package_name: 'datocms-plugin-tag-editor',
    });

    expect(plugin.id).toEqual(newId);
  });
});
