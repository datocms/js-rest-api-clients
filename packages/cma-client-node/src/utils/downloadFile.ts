import { createWriteStream, promises } from 'node:fs';
import { basename, join } from 'node:path';
import { URL } from 'node:url';
import {
  type CancelablePromise,
  CanceledPromiseError,
  makeCancelablePromise,
  type request,
} from '@datocms/rest-client-utils';
import { dir } from 'tmp-promise';
import type { OnProgressInfo } from './uploadLocalFileAndReturnPath';

type Options = {
  onProgress?: (info: OnProgressInfo) => void;
  fetchFn?: Parameters<typeof request>[0]['fetchFn'];
};

export type DownloadResult = {
  filePath: string;
  deleteFile: () => Promise<void>;
};

export function downloadFile(
  url: string,
  { onProgress, fetchFn: customFetchFn }: Options = {},
): CancelablePromise<DownloadResult> {
  const fetchFn =
    customFetchFn ||
    (typeof fetch === 'undefined' ? undefined : fetch) ||
    (typeof globalThis === 'undefined' ? undefined : globalThis.fetch);

  if (typeof fetchFn === 'undefined') {
    throw new Error(
      'fetch() is not available: either polyfill it globally, or provide it as fetchFn option.',
    );
  }

  let isCancelled = false;
  const controller = new AbortController();

  return makeCancelablePromise<DownloadResult>(
    async () => {
      if (isCancelled) throw new CanceledPromiseError();

      const { path: tmpDir, cleanup: deleteTmpDir } = await dir({
        unsafeCleanup: true,
      });
      if (isCancelled) {
        await deleteTmpDir();
        throw new CanceledPromiseError();
      }

      const res = await fetchFn(url, { signal: controller.signal });
      if (!res.ok) {
        throw new Error(
          `Failed to download ${url}: ${res.status} ${res.statusText}`,
        );
      }

      const filePath = join(tmpDir, basename(new URL(url).pathname));

      if (res.body) {
        const fileStream = createWriteStream(filePath);
        const reader = res.body.getReader();
        const contentLengthHeader = res.headers.get('content-length');
        const total = contentLengthHeader
          ? Number.parseInt(contentLengthHeader, 10)
          : null;
        let receivedLength = 0;

        while (true) {
          if (controller.signal.aborted) {
            throw new CanceledPromiseError();
          }

          const { done, value } = await reader.read();
          if (done) break;

          receivedLength += value.length;
          fileStream.write(Buffer.from(value));

          if (onProgress && total !== null) {
            onProgress({
              type: 'DOWNLOADING_FILE',
              payload: {
                url,
                progress: Math.round((receivedLength / total) * 100),
              },
            });
          }
        }

        await new Promise((resolve, reject) => {
          fileStream.on('error', reject);
          fileStream.on('finish', () => resolve(undefined));
          fileStream.end();
        });
      } else {
        const arrayBuffer = await res.arrayBuffer();
        await promises.writeFile(filePath, Buffer.from(arrayBuffer));
      }

      if (isCancelled) throw new CanceledPromiseError();

      return {
        filePath,
        deleteFile: deleteTmpDir,
      };
    },
    () => {
      isCancelled = true;
      controller.abort();
    },
  );
}
