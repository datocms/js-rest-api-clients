import { generateNewCmaClient } from '../../../jest-helpers/generateNewCmaClient';
import { withEventsSubscription } from '../src';

describe('@datocms/rest-api-events', () => {
  it.concurrent('first test', async () => {
    const rawClient = await generateNewCmaClient();

    const [client, unsubscribe] = await withEventsSubscription(rawClient, {
      appKey: process.env.PUSHER_APP_KEY,
      cluster: process.env.PUSHER_CLUSTER,
    });

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
