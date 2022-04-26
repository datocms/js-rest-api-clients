import { generateNewCmaClient } from './helpers/generateClients';

describe('Daily usages events', () => {
  test('list', async () => {
    const client = await generateNewCmaClient();

    const usages = await client.dailyUsages.list();

    expect(usages[0].cda_api_calls).toEqual(null);
  });
});
