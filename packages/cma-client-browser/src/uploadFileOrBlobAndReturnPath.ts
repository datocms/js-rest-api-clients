import { Client } from '@datocms/cma-client';
import {
  CancelablePromise,
  CanceledPromiseError,
} from '@datocms/rest-client-utils';
import { uploadFileOrBlobToS3 } from './utils/uploadFileOrBlobToS3';

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

export function uploadFileOrBlobAndReturnPath(
  client: Client,
  fileOrBlob: File | Blob,
  options: Options = {},
): CancelablePromise<string> {
  let filename: string | undefined = options.filename;

  if (!filename) {
    if (!('name' in fileOrBlob)) {
      throw new Error('Missing filename, please provide it as an option!');
    }

    filename = fileOrBlob.name;
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

      uploadPromise = uploadFileOrBlobToS3(fileOrBlob, url, options);

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
