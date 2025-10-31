import { generateNewCmaClient } from '../../../jest-helpers/generateNewCmaClient';

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

    // Create a site search source linked to the build trigger
    const siteSearceSource = await client.siteSearchSources.create({
      name: 'Test Search Source',
      enabled: true,
      build_trigger_indexing_enabled: true,
      frontend_url: 'http://www.google.com/',
      build_triggers: [trigger],
    });

    const resultsWhenSearchingViaBuildTrigger = await client.searchResults.list(
      {
        filter: {
          query: 'project',
          build_trigger_id: trigger.id,
        },
      },
    );

    expect(resultsWhenSearchingViaBuildTrigger).toHaveLength(0);

    const resultsWhenSearchingViaSiteSearchSource =
      await client.searchResults.list({
        filter: {
          query: 'project',
          site_search_source_id: siteSearceSource.id,
        },
      });

    expect(resultsWhenSearchingViaSiteSearchSource).toHaveLength(0);
  });
});
