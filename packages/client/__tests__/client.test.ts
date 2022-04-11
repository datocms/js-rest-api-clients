import { ApiError, Client, DashboardClient } from '../src';
import { LogLevel } from '../src/request';

async function generateNewDashboardClient() {
  const randomString = Math.random().toString(36).substring(7);

  const client = new DashboardClient({
    apiToken: null,
    baseUrl: process.env.ACCOUNT_API_BASE_URL,
    logLevel: LogLevel.INFO,
  });

  const account = await client.account.create({
    email: `${randomString}@delete-this-at-midnight-utc.tk`,
    password: 'STRONG_pass123!',
    first_name: 'Test',
    company: 'DatoCMS',
  });

  return new DashboardClient({
    apiToken: account.id,
    baseUrl: process.env.ACCOUNT_API_BASE_URL,
  });
}

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

    console.log(site);

    const cmaClient = new Client({
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      apiToken: site.readwrite_token!,
      logLevel: LogLevel.TRACE,
    });

    // await cmaClient.subscribeToEvents();

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

    console.log(siteInvitation);

    // cmaClient.unsubscribeToEvents();
  });
});
