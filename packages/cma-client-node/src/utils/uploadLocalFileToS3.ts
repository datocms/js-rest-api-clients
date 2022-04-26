import got, { CancelError, CancelableRequest, Response } from 'got';
import { createReadStream, promises } from 'fs';
import mime from 'mime-types';
import { OnProgressInfo } from '../uploadLocalFileAndReturnPath';
import {
  CancelablePromise,
  CanceledPromiseError,
} from '@datocms/rest-client-utils';

type Options = {
  onProgress?: (info: OnProgressInfo) => void;
};

export function uploadLocalFileToS3(
  filePath: string,
  url: string,
  { onProgress }: Options = {},
): CancelablePromise<void> {
  let isCanceled = false;
  let putPromise: CancelableRequest<Response<unknown>> | undefined;

  const promise = new CancelablePromise<void>(async (resolve, reject) => {
    try {
      if (isCanceled) {
        reject(new CanceledPromiseError());
        return;
      }

      const { size: totalLength } = await promises.stat(filePath);

      if (isCanceled) {
        reject(new CanceledPromiseError());
        return;
      }

      putPromise = got.put(url, {
        headers: {
          'Content-Type': mime.lookup(filePath),
          'Content-Length': `${totalLength}`,
        },
        responseType: 'json',
        body: createReadStream(filePath),
      });

      if (onProgress) {
        putPromise.on('uploadProgress', ({ percent }) => {
          if (!isCanceled) {
            onProgress({
              type: 'upload',
              payload: { percent: Math.round(percent * 100) },
            });
          }
        });
      }

      await putPromise;

      resolve();
    } catch (e) {
      if (e instanceof CancelError) {
        reject(new CanceledPromiseError());
      } else {
        reject(e);
      }
    }
  });

  promise.cancelMethod = () => {
    isCanceled = true;
    if (putPromise) {
      putPromise.cancel();
    }
  };

  return promise;
}
