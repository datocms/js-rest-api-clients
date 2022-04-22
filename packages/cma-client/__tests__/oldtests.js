import { expect } from 'chai';
/* global generateNewAccountClient:true */

describe('Site API', () => {
  describe('plugins', () => {
    it('create, find, all, update, destroy', async () => {
      const plugin = await client.plugins.create({
        packageName: 'datocms-plugin-tag-editor',
      });

      await client.plugins.update(plugin.id, {
        parameters: { developmentMode: true },
      });

      await client.plugins.destroy(plugin.id);
    });
  });

  describe('environments', () => {
    it('all, find, fork, promote, destroy', async () => {
      const primaryEnvironment = await client.environments.find('main');

      const forkedEnvironment = await client.environments.fork(
        primaryEnvironment.id,
        {
          id: 'sandbox-test',
        },
      );

      await client.environments.promote(forkedEnvironment.id);

      await client.environments.promote(primaryEnvironment.id);

      await client.environments.destroy(forkedEnvironment.id);

      const environments = await client.environments.list();
      expect(environments.length).toEqual(1);
    });
  });
});
