import { buildClient } from '@datocms/cma-client';
import { withEventsSubscription } from '../src';
import { generateNewDashboardClient } from './helpers/generateClients';

describe('@datocms/rest-api-events', () => {
  it('first test', async () => {
    const dashboardClient = await generateNewDashboardClient();

    const site = await dashboardClient.sites.create({
      name: 'Foo bar',
    });

    const [client, unsubscribe] = await withEventsSubscription(
      buildClient({
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        apiToken: site.readwrite_token!,
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
