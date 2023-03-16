import { GenericClient } from './internalTypes';
import {
  JobResultsFetcher,
  SubscribeToEventsSubscriptionConfig,
} from './JobResultsFetcher';

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
