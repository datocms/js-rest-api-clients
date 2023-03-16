import { GenericClient } from './internalTypes';
import { JobResultsFetcher } from './JobResultsFetcher';
import { SubscriptionConfig } from './subscribeToEvents';

type UnsubscribeToEventsFn = () => void;

export async function withEventsSubscription<T extends GenericClient>(
  client: T,
  config?: SubscriptionConfig,
): Promise<[T, UnsubscribeToEventsFn]> {
  const jobResultsFetcher = new JobResultsFetcher<T>(client);
  await jobResultsFetcher.subscribeToEvents(config);
  client.jobResultsFetcher = jobResultsFetcher.fetch;
  return [client, () => jobResultsFetcher.unsubscribeToEvents()];
}
