import { ApiError, Client } from '../src';
import { LogLevel } from '../src';
import generateNewDashboardClient from './helpers/generateNewDashboardClient';

describe('@datocms/client', () => {
  it('first test', async () => {
    try {
      const client = new Client({ apiToken: 'XXX' });
      await client.items.list({});
    } catch (e) {
      if (!(e instanceof ApiError)) {
        expect(false).toBe(true);
        return;
      }

      const unauthorizedError = e.findErrorWithCode(
        'INVALID_AUTHORIZATION_HEADER',
      );

      expect(unauthorizedError).toBeTruthy();
    }
  });

  it('creating project', async () => {
    const dashboardClient = await generateNewDashboardClient();
    const site = await dashboardClient.sites.create({
      name: 'Foo bar',
    });

    const cmaClient = new Client({
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      apiToken: site.readwrite_token!,
      logLevel: LogLevel.TRACE,
    });

    const itemType = await cmaClient.itemTypes.create({
      name: 'Foo',
      api_key: 'foo',
    });

    const field = await cmaClient.fields.create(itemType.api_key, {
      label: 'Foo',
      api_key: 'foo',
      field_type: 'string',
    });

    await cmaClient.fields.update(field, { api_key: 'new_foo' });

    const role = await cmaClient.roles.create({
      name: 'Foo',
    });

    const siteInvitation = await cmaClient.siteInvitations.create({
      email: 'foo@bar.com',
      role,
    });
  });

  it('iterators', async () => {
    const client = new Client({
      apiToken: 'faeb9172e232a75339242faafb9e56de8c8f13b735f7090964',
      logLevel: LogLevel.INFO,
    });

    for await (const item of client.items.listPagedIterator({
      filter: { type: 'blog_post' },
    })) {
      console.log(item.title);
    }
  });
});
