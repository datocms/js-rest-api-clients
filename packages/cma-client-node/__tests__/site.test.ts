import { generateNewCmaClient } from '../../../jest-helpers/generateNewCmaClient';

describe('site', () => {
  it.concurrent('find, update', async () => {
    const client = await generateNewCmaClient();

    const fetchedSite = await client.site.find();
    expect(fetchedSite.name).toEqual('Project');

    const updatedSite = await client.site.update({ name: 'New project' });
    expect(updatedSite.name).toEqual('New project');
  });
});
