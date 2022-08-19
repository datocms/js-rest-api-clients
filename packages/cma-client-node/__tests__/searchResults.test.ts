import { generateNewCmaClient } from './helpers/generateClients';

describe('Search Results', () => {
  test('list', async () => {
    const client = await generateNewCmaClient();

    const trigger = await client.buildTriggers.create({
      autotrigger_on_scheduled_publications: false,
      adapter: 'custom',
      adapter_settings: {
        trigger_url: 'https://www.google.com',
        headers: {},
        payload: {},
      },
      frontend_url: 'http://www.google.com/',
      name: 'Foo',
      indexing_enabled: true,
    });

    const results = await client.searchResults.list({
      filter: {
        query: 'project',
        build_trigger_id: trigger.id,
      },
    });

    expect(results).toHaveLength(0);
  });
});
