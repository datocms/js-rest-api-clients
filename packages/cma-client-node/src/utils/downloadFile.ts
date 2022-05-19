import { dir } from 'tmp-promise';
import got, { CancelableRequest, Response, CancelError } from 'got';
import { promises } from 'fs';
import { basename, join } from 'path';
import { URL } from 'url';
import {
  CancelablePromise,
  CanceledPromiseError,
  makeCancelablePromise,
} from '@datocms/rest-client-utils';
import { OnProgressInfo } from './uploadLocalFileAndReturnPath';

type Options = {
  onProgress?: (info: OnProgressInfo) => void;
};

export type DownloadResult = {
  filePath: string;
  deleteFile: () => Promise<void>;
};

export function downloadFile(
  url: string,
  { onProgress }: Options = {},
): CancelablePromise<DownloadResult> {
  let isCancelled = false;
  let requestPromise: CancelableRequest<Response<Buffer>>;

  return makeCancelablePromise<DownloadResult>(
    async () => {
      if (isCancelled) {
        throw new CanceledPromiseError();
      }

      const { path: tmpDir, cleanup: deleteTmpDir } = await dir({
        unsafeCleanup: true,
      });

      if (isCancelled) {
        await deleteTmpDir();
        throw new CanceledPromiseError();
      }

      try {
        requestPromise = got(url, { responseType: 'buffer', maxRedirects: 10 });

        if (onProgress) {
          requestPromise.on('downloadProgress', ({ percent }) => {
            if (isCancelled) {
              return;
            }

            onProgress({
              type: 'DOWNLOADING_FILE',
              payload: { url, progress: Math.round(percent * 100) },
            });
          });
        }

        let response: Response<Buffer>;

        try {
          response = await requestPromise;
        } catch (e) {
          if (e instanceof CancelError) {
            throw new CanceledPromiseError();
          } else {
            throw e;
          }
        }

        if (isCancelled) {
          throw new CanceledPromiseError();
        }

        const filePath = join(tmpDir, basename(new URL(url).pathname));

        await promises.writeFile(filePath, response.body);

        return {
          filePath,
          deleteFile: deleteTmpDir,
        };
      } catch (e) {
        deleteTmpDir();
        throw e;
      }
    },
    () => {
      isCancelled = true;
      if (requestPromise) {
        requestPromise.cancel();
      }
    },
  );
}
