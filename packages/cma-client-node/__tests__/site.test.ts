import { generateNewCmaClient } from './helpers/generateClients';

describe('site', () => {
  test('find, update', async () => {
    const client = await generateNewCmaClient();

    const fetchedSite = await client.site.find();
    expect(fetchedSite.name).toEqual('Project');

    const updatedSite = await client.site.update({ name: 'New project' });
    expect(updatedSite.name).toEqual('New project');
  });
});
