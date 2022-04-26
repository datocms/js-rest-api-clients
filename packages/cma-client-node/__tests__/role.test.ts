import { generateNewCmaClient } from './helpers/generateClients';

describe('role', () => {
  test('create, find, list, update, destroy', async () => {
    const client = await generateNewCmaClient();

    const role = await client.roles.create({
      name: 'Translator',
    });
    expect(role.name).toEqual('Translator');

    const foundRole = await client.roles.find(role);
    expect(foundRole.id).toEqual(role.id);

    const allRoles = await client.roles.list();
    expect(allRoles).toHaveLength(3);

    const updatedroles = await client.roles.update(role, {
      ...role,
      name: 'Updated',
    });
    expect(updatedroles.name).toEqual('Updated');

    await client.roles.destroy(role);
    expect(await client.roles.list()).toHaveLength(2);
  });
});
