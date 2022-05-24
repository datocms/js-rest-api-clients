import Pusher, { Channel } from 'pusher-js';
import { JobResult } from './internalTypes';

export type EventsSubscription = {
  channel: Channel;
  waitJobResult: (jobId: string) => Promise<JobResult>;
  unsubscribe: () => void;
};

const pusherAppKey = '75e6ef0fe5d39f481626';

const channelPromisesCache: Record<string, Promise<EventsSubscription>> = {};

export function subscribeToEvents(
  authEndpoint: string,
  apiToken: string,
  channelName: string,
) {
  const cacheKey = [authEndpoint, channelName, apiToken].join('---');

  const cachedPromise = channelPromisesCache[cacheKey];

  if (cachedPromise) {
    return cachedPromise;
  }

  const promise = new Promise<EventsSubscription>((resolve, reject) => {
    const pusher = new Pusher(pusherAppKey, {
      authEndpoint,
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

      channel.bind('job-result', ({ jobId, status, payload }) => {
        const jobResult: JobResult = {
          id: jobId,
          type: 'job_result',
          status,
          payload,
        };
        if (listeners[jobId]) {
          listeners[jobId](jobResult);
          delete listeners[jobId];
        } else {
          pastEmissions[jobId] = jobResult;
        }
      });

      resolve({
        channel,
        waitJobResult: (jobId: string) => {
          return new Promise<JobResult>((resolve) => {
            if (pastEmissions[jobId]) {
              resolve(pastEmissions[jobId]);
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
