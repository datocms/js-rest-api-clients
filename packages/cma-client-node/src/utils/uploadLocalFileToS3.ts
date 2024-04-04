import { createReadStream, promises } from 'node:fs';
import {
  type CancelablePromise,
  CanceledPromiseError,
} from '@datocms/rest-client-utils';
import { makeCancelablePromise } from '@datocms/rest-client-utils';
import got, { CancelError, type CancelableRequest, type Response } from 'got';
import mime from 'mime-types';
import type { OnProgressInfo } from './uploadLocalFileAndReturnPath';

type Options = {
  onProgress?: (info: OnProgressInfo) => void;
  additionalHeaders?: Record<string, string>;
};

export function uploadLocalFileToS3(
  filePath: string,
  url: string,
  { onProgress, additionalHeaders }: Options = {},
): CancelablePromise<void> {
  let isCanceled = false;
  let putPromise: CancelableRequest<Response<unknown>> | undefined;

  return makeCancelablePromise<void>(
    async () => {
      if (isCanceled) {
        throw new CanceledPromiseError();
      }

      const { size: totalLength } = await promises.stat(filePath);

      if (isCanceled) {
        throw new CanceledPromiseError();
      }

      try {
        putPromise = got.put(url, {
          headers: {
            ...(additionalHeaders || {}),
            'Content-Type': mime.lookup(filePath) || 'application/octet-stream',
            'Content-Length': `${totalLength}`,
          },
          responseType: 'json',
          body: createReadStream(filePath),
        });
      } catch (e) {
        if (e instanceof CancelError) {
          throw new CanceledPromiseError();
        }
        throw e;
      }

      if (onProgress) {
        putPromise.on('uploadProgress', ({ percent }) => {
          if (!isCanceled) {
            onProgress({
              type: 'UPLOADING_FILE',
              payload: { progress: Math.round(percent * 100) },
            });
          }
        });
      }

      await putPromise;
    },
    () => {
      isCanceled = true;
      if (putPromise) {
        putPromise.cancel();
      }
    },
  );
}
