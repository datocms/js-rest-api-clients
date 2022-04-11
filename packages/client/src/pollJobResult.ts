import { ApiError } from './ApiError';
import { JobResult, JobResultSelfTargetSchema } from './cma/SchemaTypes';
import { wait } from './utils';

export default async function pollJobResult(
  fetcher: () => Promise<JobResultSelfTargetSchema>,
): Promise<JobResult> {
  let jobResult: JobResult | undefined;
  let retryCount = 0;

  do {
    try {
      retryCount += 1;
      await wait(retryCount * 1000);
      ({ data: jobResult } = await fetcher());
    } catch (e) {
      if (!(e instanceof ApiError) || e.response.status !== 404) {
        throw e;
      }
    }
  } while (!jobResult);

  return jobResult;
}
