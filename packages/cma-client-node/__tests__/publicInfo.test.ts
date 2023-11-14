import { generateNewCmaClient } from '../../../jest-helpers/generateNewCmaClient';

describe('Public info', () => {
  it.concurrent('find', async () => {
    const client = await generateNewCmaClient();

    const publicInfo = await client.publicInfo.find();
    expect(publicInfo.name).toEqual('Project');
  });
});
