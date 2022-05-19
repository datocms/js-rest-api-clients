import got, { CancelError, CancelableRequest, Response } from 'got';
import { createReadStream, promises } from 'fs';
import mime from 'mime-types';
import { OnProgressInfo } from './uploadLocalFileAndReturnPath';
import {
  CancelablePromise,
  CanceledPromiseError,
} from '@datocms/rest-client-utils';
import { makeCancelablePromise } from '@datocms/rest-client-utils';

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
            'Content-Type': mime.lookup(filePath),
            'Content-Length': `${totalLength}`,
          },
          responseType: 'json',
          body: createReadStream(filePath),
        });
      } catch (e) {
        if (e instanceof CancelError) {
          throw new CanceledPromiseError();
        } else {
          throw e;
        }
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
