import { createReadStream, promises } from 'node:fs';
import { Readable } from 'node:stream';
import {
  type CancelablePromise,
  CanceledPromiseError,
  makeCancelablePromise,
  type request,
} from '@datocms/rest-client-utils';
import mime from 'mime-types';
import type { OnProgressInfo } from './uploadLocalFileAndReturnPath';

type Options = {
  onProgress?: (info: OnProgressInfo) => void;
  additionalHeaders?: Record<string, string>;
  fetchFn?: Parameters<typeof request>[0]['fetchFn'];
};

export function uploadLocalFileToS3(
  filePath: string,
  url: string,
  { onProgress, additionalHeaders, fetchFn: customFetchFn }: Options = {},
): CancelablePromise<void> {
  const fetchFn =
    customFetchFn ||
    (typeof fetch === 'undefined' ? undefined : fetch) ||
    (typeof globalThis === 'undefined' ? undefined : globalThis.fetch);

  if (typeof fetchFn === 'undefined') {
    throw new Error(
      'fetch() is not available: either polyfill it globally, or provide it as fetchFn option.',
    );
  }

  let isCanceled = false;
  const controller = new AbortController();

  return makeCancelablePromise<void>(
    async () => {
      if (isCanceled) {
        throw new CanceledPromiseError();
      }

      const { size: totalLength } = await promises.stat(filePath);

      if (isCanceled) {
        throw new CanceledPromiseError();
      }

      const headers = {
        ...(additionalHeaders || {}),
        'Content-Type': mime.lookup(filePath) || 'application/octet-stream',
        'Content-Length': `${totalLength}`,
      };

      // Create a readable stream from file
      let body = Readable.toWeb(
        createReadStream(filePath),
      ) as ReadableStream<Uint8Array>;

      // Wrap the stream to track progress if needed.
      if (onProgress) {
        body = createProgressReadableStream(body, totalLength, onProgress);
      }

      const response = await fetchFn(url, {
        method: 'PUT',
        headers,
        body,
        // @ts-expect-error - Types are outdated
        duplex: 'half',
        signal: controller.signal,
        redirect: 'follow',
      });

      // Check for non-2xx responses.
      if (!response.ok) {
        throw new Error(
          `Upload failed with status ${response.status}: ${response.statusText}`,
        );
      }
    },
    () => {
      isCanceled = true;
      controller.abort();
    },
  );
}

/**
 * Wraps a ReadableStream to report upload progress.
 */
function createProgressReadableStream(
  stream: ReadableStream<Uint8Array>,
  totalLength: number,
  onProgress: (info: OnProgressInfo) => void,
): ReadableStream<Uint8Array> {
  let uploaded = 0;
  const reader = stream.getReader();

  return new ReadableStream({
    async pull(controller) {
      const { done, value } = await reader.read();
      if (done) {
        controller.close();
        return;
      }
      if (value) {
        uploaded += value.length;
        const percent = uploaded / totalLength;
        onProgress({
          type: 'UPLOADING_FILE',
          payload: { progress: Math.round(percent * 100) },
        });
        controller.enqueue(value);
      }
    },
    cancel(reason) {
      return reader.cancel(reason);
    },
  });
}
