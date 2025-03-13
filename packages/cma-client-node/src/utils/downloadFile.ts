import { createWriteStream, promises } from 'node:fs';
import { basename, join } from 'node:path';
import { URL } from 'node:url';
import {
  type CancelablePromise,
  CanceledPromiseError,
  getFetchFn,
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
  const fetchFn = getFetchFn(customFetchFn);
  const controller = new AbortController();

  return makeCancelablePromise<DownloadResult>(
    async () => {
      if (controller.signal.aborted) throw new CanceledPromiseError();

      const { path: tmpDir, cleanup: deleteTmpDir } = await dir({
        unsafeCleanup: true,
      });

      if (controller.signal.aborted) {
        await deleteTmpDir();
        throw new CanceledPromiseError();
      }

      const res = await fetchFn(url, {
        signal: controller.signal,
        redirect: 'follow',
      });

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

      if (controller.signal.aborted) throw new CanceledPromiseError();

      return {
        filePath,
        deleteFile: deleteTmpDir,
      };
    },
    () => {
      controller.abort();
    },
  );
}
