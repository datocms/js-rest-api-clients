import { GenericClient } from './internalTypes';
import { JobResultsFetcher } from './JobResultsFetcher';

type UnsubscribeToEventsFn = () => void;

export async function withEventsSubscription<T extends GenericClient>(
  client: T,
): Promise<[T, UnsubscribeToEventsFn]> {
  const jobResultsFetcher = new JobResultsFetcher<T>(client);
  await jobResultsFetcher.subscribeToEvents();
  client.jobResultsFetcher = jobResultsFetcher.fetch;
  return [client, () => jobResultsFetcher.unsubscribeToEvents()];
}
