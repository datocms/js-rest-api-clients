import type { GenericClient, JobResult } from './internalTypes';
import {
  type EventsSubscription,
  type SubscriptionConfig,
  subscribeToEvents,
} from './subscribeToEvents';

export type SubscribeToEventsSubscriptionConfig = Pick<
  SubscriptionConfig,
  'cluster' | 'appKey'
>;

export class JobResultsFetcher<T extends GenericClient> {
  private eventsSubscription: EventsSubscription | undefined;
  private client: T;

  constructor(client: T) {
    this.client = client;
    this.fetch = this.fetch.bind(this);
  }

  async subscribeToEvents(config?: SubscribeToEventsSubscriptionConfig) {
    if (!this.client.config.apiToken) {
      throw new Error('Missing API token!');
    }

    const channelName = await this.client.eventsChannelName();

    if (!this.eventsSubscription) {
      this.eventsSubscription = await subscribeToEvents({
        ...config,
        authEndpoint: `${this.client.baseUrl}/pusher/authenticate`,
        apiToken: this.client.config.apiToken,
        channelName,
      });
    }
  }

  async fetch(jobId: string): Promise<JobResult> {
    if (!this.eventsSubscription) {
      throw new Error(
        'You need to call the method .subscribeToEvents() first!',
      );
    }
    const jobResult = await this.eventsSubscription.waitJobResult(jobId);

    // payload is too large, we need to fetch the result from
    // the /job-results endpoint
    if (jobResult.status === 413) {
      return this.client.jobResults.find(jobId);
    }

    return jobResult;
  }

  unsubscribeToEvents() {
    if (this.eventsSubscription) {
      this.eventsSubscription.unsubscribe();
    }
  }
}
