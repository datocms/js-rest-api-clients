import { generateNewCmaClient } from '../../../jest-helpers/generateNewCmaClient';

describe('Webhooks', () => {
  it.concurrent('create, find, all, destroy', async () => {
    const client = await generateNewCmaClient();

    const webhook = await client.webhooks.create({
      name: 'test',
      url: 'https://www.google.com',
      http_basic_user: null,
      http_basic_password: null,
      custom_payload: null,
      headers: {},
      events: [
        {
          event_types: ['create', 'update'],
          entity_type: 'item_type',
          filters: [
            {
              entity_ids: ['brand', 'tag'],
              entity_type: 'item_type',
            },
          ],
        },
      ],
    });

    const foundWebhook = await client.webhooks.find(webhook);
    expect(foundWebhook.id).toEqual(webhook.id);

    const allWebhooks = await client.webhooks.list();
    expect(allWebhooks).toHaveLength(1);

    await client.webhooks.update(foundWebhook, {
      events: [
        {
          event_types: ['create'],
          filters: [],
          entity_type: 'item_type',
        },
      ],
    });

    await client.webhooks.destroy(foundWebhook);

    expect(await client.webhooks.list()).toHaveLength(0);
  });
});
