import { generateNewCmaClient } from './helpers/generateClients';

describe('Webhook calls', () => {
  it.concurrent('create, find, all, destroy', async () => {
    const client = await generateNewCmaClient();

    // TODO: resendWebhook prende user data
    // await client.webhookCalls.resendWebhook('2');

    const webhookCalls = await client.webhookCalls.list();
    expect(webhookCalls).toHaveLength(0);
  });
});
