import { ApiError } from './errors.js';
import type { JobResult } from './internalTypes.js';
import { wait, withJitter } from './wait.js';

export async function pollJobResult(
  fetcher: () => Promise<JobResult>,
): Promise<JobResult> {
  let jobResult: JobResult | undefined;
  let retryCount = 0;

  do {
    try {
      retryCount += 1;
      // A single call (eg. a bulk publish) can spawn many jobs polled in
      // parallel; jitter keeps them from all landing on the same poll tick.
      await wait(withJitter(retryCount) * 1000);
      jobResult = await fetcher();
    } catch (e) {
      if (!(e instanceof ApiError) || e.response.status !== 404) {
        throw e;
      }
    }
  } while (!jobResult);

  return jobResult;
}
