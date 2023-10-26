import { buildClient } from '@datocms/cma-client';
import { withEventsSubscription } from '../src';
import { generateNewDashboardClient } from './helpers/generateClients';

import { fetch as ponyfillFetch } from '@whatwg-node/fetch';

const fetchFn = typeof fetch === 'undefined' ? ponyfillFetch : fetch;

describe('@datocms/rest-api-events', () => {
  it.concurrent('first test', async () => {
    const dashboardClient = await generateNewDashboardClient();

    const site = await dashboardClient.sites.create({
      name: 'Foo bar',
    });

    const [client, unsubscribe] = await withEventsSubscription(
      buildClient({
        apiToken: site.readwrite_token!,
        fetchFn,
      }),
    );

    const itemType = await client.itemTypes.create({
      api_key: 'foo',
      name: 'Foo',
    });

    await client.fields.create(itemType.id, {
      api_key: 'foo',
      label: 'Foo',
      field_type: 'string',
    });

    unsubscribe();
  });
});
