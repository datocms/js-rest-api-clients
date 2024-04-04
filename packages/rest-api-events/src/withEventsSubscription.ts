import {
  JobResultsFetcher,
  type SubscribeToEventsSubscriptionConfig,
} from './JobResultsFetcher';
import type { GenericClient } from './internalTypes';

type UnsubscribeToEventsFn = () => void;

export async function withEventsSubscription<T extends GenericClient>(
  client: T,
  config?: SubscribeToEventsSubscriptionConfig,
): Promise<[T, UnsubscribeToEventsFn]> {
  const jobResultsFetcher = new JobResultsFetcher<T>(client);
  await jobResultsFetcher.subscribeToEvents(config);
  client.jobResultsFetcher = jobResultsFetcher.fetch;
  return [client, () => jobResultsFetcher.unsubscribeToEvents()];
}
