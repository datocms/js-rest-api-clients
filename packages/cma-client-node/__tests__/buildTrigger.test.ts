import { generateNewCmaClient } from './helpers/generateClients';

describe('build triggers', () => {
  it.concurrent('create, find, list, update, destroy, trigger', async () => {
    const client = await generateNewCmaClient();

    const trigger = await client.buildTriggers.create({
      autotrigger_on_scheduled_publications: false,
      adapter: 'custom',
      adapter_settings: {
        trigger_url: 'https://www.google.com',
        headers: {},
        payload: {},
      },
      frontend_url: null,
      name: 'Foo',
      indexing_enabled: false,
    });

    const foundBuildTriggers = await client.buildTriggers.find(trigger);
    expect(foundBuildTriggers.id).toEqual(trigger.id);

    const allBuildTriggers = await client.buildTriggers.list();
    expect(allBuildTriggers).toHaveLength(1);

    await client.buildTriggers.trigger(trigger);
    await client.buildTriggers.reindex(trigger);

    const updatedTrigger = await client.buildTriggers.update(trigger, {
      name: 'Updated',
    });
    expect(updatedTrigger.name).toEqual('Updated');

    await client.buildTriggers.destroy(trigger);
    expect(await client.buildTriggers.list()).toHaveLength(0);
  });
});
