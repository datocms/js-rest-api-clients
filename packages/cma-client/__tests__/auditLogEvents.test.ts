import { generateNewCmaClient } from './helpers/generateClients';

describe('Audit log events', () => {
  test('list', async () => {
    const client = await generateNewCmaClient();

    // TODO error
    const events = await client.auditLogEvents.query({
      filter: 'foo',
      next_token: 'E5188+SCXtvvXVUFkqmwtQJd3V3lJIOsZBjHvTYz',
      detailed_log: true,
    });

    expect(events).toHaveLength(0);
  });
});
