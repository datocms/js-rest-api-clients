import { generateNewCmaClient } from './helpers/generateClients';

describe('environments', () => {
  it.concurrent('all, find, fork, promote, destroy', async () => {
    const client = await generateNewCmaClient();
    const primaryEnvironment = await client.environments.find('main');

    const forkedEnvironment = await client.environments.fork(
      primaryEnvironment.id,
      {
        id: 'sandbox-test',
      },
    );

    await client.environments.promote(forkedEnvironment.id);

    await client.environments.promote(primaryEnvironment.id);

    await client.environments.destroy(forkedEnvironment.id);

    const environments = await client.environments.list();
    expect(environments.length).toEqual(1);
  });
});
