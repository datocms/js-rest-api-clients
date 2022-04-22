import { JobResult } from './internalTypes';
import { EventsSubscription, subscribeToEvents } from './subscribeToEvents';
declare class JobResultResource {
  find(jobResultId: string): Promise<JobResult>;
}
declare class GenericClient {
  config: {
    apiToken: string | null;
  };
  get baseUrl(): string;
  eventsChannelName(): Promise<string>;
  jobResults: JobResultResource;
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
