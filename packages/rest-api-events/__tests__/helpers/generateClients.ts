import {
  buildClient as buildDashboardClient,
  LogLevel,
  ClientConfigOptions as DashboardClientConfigOptions,
} from '@datocms/dashboard-client';

export async function generateNewDashboardClient(
  config?: Partial<DashboardClientConfigOptions>,
) {
  const randomString = Math.random().toString(36).substring(7);

  const client = buildDashboardClient({
    ...config,
    apiToken: null,
    baseUrl: process.env.ACCOUNT_API_BASE_URL,
  });

  const account = await client.account.create({
    email: `${randomString}@delete-this-at-midnight-utc.tk`,
    password: 'STRONG_pass123!',
    first_name: 'Test',
    company: 'DatoCMS',
  });

  return buildDashboardClient({
    ...config,
    apiToken: account.id,
    baseUrl: process.env.ACCOUNT_API_BASE_URL,
  });
}
