import { generateNewCmaClient } from '../../../jest-helpers/generateNewCmaClient';

describe('Build log events', () => {
  it.concurrent('list', async () => {
    const client = await generateNewCmaClient();

    const events = await client.buildEvents.list();

    expect(events).toHaveLength(0);
  });
});
