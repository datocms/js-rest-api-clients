import { generateNewCmaClient } from '../../../jest-helpers/generateNewCmaClient';

describe('Audit log events', () => {
  it.concurrent('list', async () => {
    const client = await generateNewCmaClient();

    // TODO error
    const events = await client.auditLogEvents.query({
      filter: 'foo',
      detailed_log: true,
    });

    expect(events).toHaveLength(0);
  });
});
