import { JobResult } from './internalTypes';
import { EventsSubscription, subscribeToEvents } from './subscribeToEvents';

declare class GenericClient {
  config: {
    apiToken: string | null;
  };
  get baseUrl(): string;
  eventsChannelName(): Promise<string>;
}

export class JobResultsFetcher<T extends GenericClient> {
  private eventsSubscription: EventsSubscription | undefined;
  private client: T;

  constructor(client: T) {
    this.client = client;
    this.fetch = this.fetch.bind(this);
  }

  async subscribeToEvents() {
    if (!this.client.config.apiToken) {
      throw new Error('Missing API token!');
    }

    const channelName = await this.client.eventsChannelName();

    if (!this.eventsSubscription) {
      this.eventsSubscription = await subscribeToEvents(
        `${this.client.baseUrl}/pusher/authenticate`,
        this.client.config.apiToken,
        channelName,
      );
    }
  }

  async fetch(jobId: string): Promise<JobResult> {
    if (!this.eventsSubscription) {
      throw new Error(
        'You need to call the method .subscribeToEvents() first!',
      );
    }
    return this.eventsSubscription.waitJobResult(jobId);
  }

  unsubscribeToEvents() {
    if (this.eventsSubscription) {
      this.eventsSubscription.unsubscribe();
    }
  }
}
