import { DashboardClient, LogLevel } from '../../src';

export default async function generateNewDashboardClient() {
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
