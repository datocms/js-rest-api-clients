import { ConcurrentPromiseQueue } from 'concurrent-promise-queue';
import 'dotenv/config';
import { ApiError } from '../packages/dashboard-client';
import {
  generateNewDashboardClient,
  shuffleArray,
} from './generateNewDashboardClient';

function isOldEnough(isoDatetime: string) {
  const date = new Date(isoDatetime);
  const currentTime = new Date();

  return Number(currentTime) - Number(date) > 30 * 60 * 1000;
}

export default async () => {
  console.log('');
  console.log('Global setup: preparing environment...');

  const client = await generateNewDashboardClient();

  // Context: multiple processes might be running tests in parallel (like in Github Actions)

  const siteIds: string[] = [];

  console.log('Fetching existing projects...');

  for await (const site of client.sites.listPagedIterator(
    {},
    { perPage: 50, concurrency: 5 },
  )) {
    // We don't want to destroy sites that might be used by other processes,
    // let's only delete old ones

    if (isOldEnough(site.created_at!)) {
      siteIds.push(site.id);
    }
  }

  console.log(`Deleting ${siteIds.length} projects...`);

  const queue = new ConcurrentPromiseQueue({
    maxNumberOfConcurrentPromises: 20,
  });

  await Promise.all(
    // Different parallel processes can start deleting different files
    shuffleArray(siteIds).map((id) =>
      queue.addPromise(async () => {
        try {
          await client.sites.destroy(id);
        } catch (e) {
          if (e instanceof ApiError && e.findError('NOT_FOUND')) {
            // Other processes might have already deleted the project
            return;
          }

          throw e;
        } finally {
          process.stdout.write('.');
        }
      }),
    ),
  );
};
