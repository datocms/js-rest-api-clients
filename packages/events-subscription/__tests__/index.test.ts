import { Client as CmaClient, LogLevel } from '@datocms/cma-client';
import { JobResultsFetcher } from '../src';
import { generateNewCmaClient } from './helpers/generateClients';

describe('@datocms/events-subscription', () => {
  it('first test', async () => {
    const client = await generateNewCmaClient();

    const jobResultsFetcher = new JobResultsFetcher<CmaClient>(client);
    await jobResultsFetcher.subscribeToEvents();

    client.jobResultsFetcher = jobResultsFetcher.fetch;

    const itemType = await client.itemTypes.create({
      api_key: 'foo',
      name: 'Foo',
    });

    const field = await client.fields.create(itemType.id, {
      api_key: 'foo',
      label: 'Foo',
      field_type: 'string',
    });

    jobResultsFetcher.unsubscribeToEvents();
  });
});
