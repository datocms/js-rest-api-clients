import { generateNewCmaClient } from '../../../jest-helpers/generateNewCmaClient';

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

    const renamedSandbox = await client.environments.rename(forkedEnvironment, {
      id: 'renamed-sandbox',
    });

    await client.environments.promote(renamedSandbox);

    await client.environments.promote(primaryEnvironment.id);

    await client.environments.destroy(renamedSandbox);

    const environments = await client.environments.list();
    expect(environments.length).toEqual(1);
  });
});
