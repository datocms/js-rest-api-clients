import { generateNewCmaClient } from '../../../jest-helpers/generateNewCmaClient';

describe('Daily usages events', () => {
  it.concurrent('list', async () => {
    const client = await generateNewCmaClient();

    const usages = await client.dailyUsages.list();

    expect(usages[0].mux_delivered_seconds).toEqual(0);
  });
});
