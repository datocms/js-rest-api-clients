import { generateNewCmaClient } from './helpers/generateClients';

describe('build triggers', () => {
  test('create, find, list, update, destroy, trigger', async () => {
    const client = await generateNewCmaClient();

    const trigger = await client.buildTriggers.create({
      adapter: 'custom',
      autotrigger_on_scheduled_publications: false,
      adapter_settings: { trigger_url: 'https://www.google.com' },
      frontend_url: null,
      name: 'Foo',
      indexing_enabled: false,
    });

    const foundBuildTriggers = await client.buildTriggers.find(trigger.id);
    expect(foundBuildTriggers.id).toEqual(trigger.id);

    const allBuildTriggers = await client.buildTriggers.list();
    expect(allBuildTriggers).toHaveLength(1);

    await client.buildTriggers.trigger(trigger.id);
    await client.buildTriggers.reindex(trigger.id);

    // TODO Error: PUT https://site-api.datocms.com/build-triggers/20159: 422 Unprocessable Entity (INVALID_FIELD, {"field":"adapter_settings","code":"INVALID_FORMAT"})
    const updatedTrigger = await client.buildTriggers.update(trigger.id, {
      name: 'Updated',
    });
    expect(updatedTrigger.name).toEqual('Updated');

    await client.buildTriggers.destroy(trigger.id);
    expect(await client.buildTriggers.list()).toHaveLength(0);
  });
});
