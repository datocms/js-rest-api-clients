import { Client } from '@datocms/cma-client';
import {
  CancelablePromise,
  CanceledPromiseError,
} from '@datocms/rest-client-utils';
import { basename } from 'path';
import { uploadLocalFileToS3 } from './utils/uploadLocalFileToS3';

export type OnProgressUploadInfo = {
  type: 'upload';
  payload: {
    percent: number;
  };
};

export type OnProgressUploadRequestCompleteInfo = {
  type: 'uploadRequestComplete';
  payload: {
    id: string;
    url: string;
  };
};

export type OnProgressInfo =
  | OnProgressUploadInfo
  | OnProgressUploadRequestCompleteInfo;

export type Options = {
  filename?: string;
  onProgress?: (info: OnProgressInfo) => void;
};

export function uploadLocalFileAndReturnPath(
  client: Client,
  localPath: string,
  options: Options = {},
): CancelablePromise<string> {
  let filename: string | undefined = options.filename;

  if (!filename) {
    filename = basename(localPath);
  }

  let isCanceledBeforeUpload = false;
  let uploadPromise: CancelablePromise<void> | undefined = undefined;

  const promise = new CancelablePromise<string>(async (resolve, reject) => {
    try {
      const { id, url } = await client.uploadRequest.create({ filename });

      if (isCanceledBeforeUpload) {
        reject(new CanceledPromiseError());
        return;
      }

      if (options.onProgress) {
        options.onProgress({
          type: 'uploadRequestComplete',
          payload: {
            id,
            url,
          },
        });
      }

      uploadPromise = uploadLocalFileToS3(localPath, url, options);

      await uploadPromise;

      resolve(id);
    } catch (e) {
      reject(e);
    }
  });

  promise.cancelMethod = () => {
    if (uploadPromise) {
      uploadPromise.cancel();
    } else {
      isCanceledBeforeUpload = true;
    }
  };

  return promise;
}
