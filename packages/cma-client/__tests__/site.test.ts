import { generateNewCmaClient } from './helpers/generateClients';

describe('site', () => {
  test('find, update', async () => {
    const client = await generateNewCmaClient();
    const fetchedSite = await client.site.find();
    expect(fetchedSite.name).toEqual('Blog');

    const updatedSite = await client.site.update({ name: 'New blog' });
    expect(updatedSite.name).toEqual('New blog');

    const events = await client.buildEvents.list();
    expect(events).toHaveLength(0);
  });
});
