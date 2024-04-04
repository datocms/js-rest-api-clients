import Pusher, { type Channel, type Options } from 'pusher-js';
import type { JobResult } from './internalTypes';

export type EventsSubscription = {
  channel: Channel;
  waitJobResult: (jobId: string) => Promise<JobResult>;
  unsubscribe: () => void;
};

export type SubscriptionConfig = {
  authEndpoint: string;
  apiToken: string;
  channelName: string;
  cluster?: Options['cluster'];
  appKey?: string;
};

type JobResultMessage = {
  jobId: string;
  status: number;
  payload: JobResult['payload'];
};

const DEFAULT_APP_KEY = '75e6ef0fe5d39f481626';

const channelPromisesCache: Record<string, Promise<EventsSubscription>> = {};

export function subscribeToEvents({
  authEndpoint,
  apiToken,
  channelName,
  cluster,
  appKey,
}: SubscriptionConfig) {
  const cacheKey = [authEndpoint, channelName, apiToken].join('---');

  const cachedPromise = channelPromisesCache[cacheKey];

  if (cachedPromise) {
    return cachedPromise;
  }

  const promise = new Promise<EventsSubscription>((resolve, reject) => {
    const pusher = new Pusher(appKey || DEFAULT_APP_KEY, {
      authEndpoint,
      cluster,
      auth: {
        headers: {
          authorization: `Bearer ${apiToken}`,
          accept: 'application/json',
          'x-api-version': '3',
          'content-type': 'application/json',
        },
      },
    });

    const channel = pusher.subscribe(channelName);

    channel.bind('pusher:subscription_error', () => {
      reject(new Error('Could not subscribe to events!'));
    });

    channel.bind('pusher:subscription_succeeded', () => {
      const listeners: Record<string, (event: JobResult) => void> = {};
      const pastEmissions: Record<string, JobResult> = {};

      channel.bind(
        'job-result',
        ({ jobId, status, payload }: JobResultMessage) => {
          const jobResult: JobResult = {
            id: jobId,
            type: 'job_result',
            status,
            payload,
          };
          if (listeners[jobId]) {
            listeners[jobId]!(jobResult);
            delete listeners[jobId];
          } else {
            pastEmissions[jobId] = jobResult;
          }
        },
      );

      resolve({
        channel,
        waitJobResult: (jobId: string) => {
          return new Promise<JobResult>((resolve) => {
            if (pastEmissions[jobId]) {
              resolve(pastEmissions[jobId]!);
              delete pastEmissions[jobId];
            } else {
              listeners[jobId] = resolve;
            }
          });
        },
        unsubscribe: () => {
          delete channelPromisesCache[cacheKey];
          pusher.disconnect();
        },
      });
    });
  });

  channelPromisesCache[cacheKey] = promise;

  return promise;
}
