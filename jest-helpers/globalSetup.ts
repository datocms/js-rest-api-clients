import 'dotenv/config';
import { ApiError } from '../packages/dashboard-client';
import { generateNewDashboardClient } from './generateNewDashboardClient';

function isOldEnough(isoDatetime: string) {
  const datetime = new Date(isoDatetime);

  const oneDayAgo = new Date();
  oneDayAgo.setDate(oneDayAgo.getDate() - 1);

  return datetime < oneDayAgo;
}

export default async () => {
  const client = await generateNewDashboardClient();

  // Context: multiple processes might be running tests in parallel (like in Github Actions)

  const siteIds: string[] = [];

  for await (const site of client.sites.listPagedIterator()) {
    // We don't want to destroy sites that might be used by other processes,
    // let's only delete old ones

    // biome-ignore lint/style/noNonNullAssertion: Always present
    if (isOldEnough(site.created_at!)) {
      siteIds.push(site.id);
    }
  }

  await Promise.all(
    siteIds.map(async (id) => {
      try {
        await client.sites.destroy(id);
      } catch (e) {
        if (e instanceof ApiError && e.findError('NOT_FOUND')) {
          // Other processes might have already deleted the project
          return;
        }

        throw e;
      }
    }),
  );
};
