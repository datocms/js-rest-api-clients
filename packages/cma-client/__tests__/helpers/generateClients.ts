import {
  Client as DashboardClient,
  LogLevel,
  ClientConfigOptions as DashboardClientConfigOptions,
} from '@datocms/dashboard-client';

import {
  Client as CmaClient,
  ClientConfigOptions as CmaClientConfigOptions,
} from '../../src';

export async function generateNewDashboardClient(
  config?: Partial<DashboardClientConfigOptions>,
) {
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
    ...config,
    apiToken: account.id,
    baseUrl: process.env.ACCOUNT_API_BASE_URL,
  });
}

export async function generateNewCmaClient(
  config?: Partial<CmaClientConfigOptions>,
) {
  const dashboardClient = await generateNewDashboardClient();

  const site = await dashboardClient.sites.create({
    name: 'Foo bar',
  });

  const cmaClient = new CmaClient({
    ...config,
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    apiToken: site.readwrite_token!,
    logLevel: LogLevel.TRACE,
  });
}
