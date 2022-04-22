export type JobResult = {
  type: 'job_result';
  id: string;
  status: number;
  payload: null | {
    [k: string]: unknown;
  };
};

export declare class JobResultResource {
  find(jobResultId: string): Promise<JobResult>;
}
export declare class GenericClient {
  config: {
    apiToken: string | null;
  };
  get baseUrl(): string;
  eventsChannelName(): Promise<string>;
  jobResults: JobResultResource;
  jobResultsFetcher?: (jobId: string) => Promise<JobResult>;
}
