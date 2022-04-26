import { generateNewCmaClient } from './helpers/generateClients';

describe('Access tokens', () => {
  test('create, find, list, update, destroy', async () => {
    const client = await generateNewCmaClient();

    const role = await client.roles.create({
      name: 'Translator',
    });

    const token = await client.accessTokens.create({
      name: 'Translator token',
      can_access_cda: true,
      can_access_cda_preview: false,
      can_access_cma: false,
      role: {
        id: role.id,
        type: 'role',
      },
    });

    // TODO qui mi dice che find vuole un tipo UserData ???
    const foundAccessToken = await client.accessTokens.find(token);
    expect(foundAccessToken.id).toEqual(token.id);

    const allAccessToken = await client.accessTokens.list();
    expect(allAccessToken).toHaveLength(1);

    const updatedToken = await client.accessTokens.update(token, {
      name: 'Updated',
    });
    expect(updatedToken.name).toEqual('Updated');

    await client.accessTokens.destroy(token);
    expect(await client.accessTokens.list()).toHaveLength(0);
  });
});
