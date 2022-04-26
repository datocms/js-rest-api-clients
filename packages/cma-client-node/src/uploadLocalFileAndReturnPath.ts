import { Client } from '@datocms/cma-client';
import { makeCancelablePromise } from '@datocms/rest-client-utils';
import {
  CancelablePromise,
  CanceledPromiseError,
} from '@datocms/rest-client-utils';
import { basename } from 'path';
import { uploadLocalFileToS3 } from './utils/uploadLocalFileToS3';

export type OnProgressDownloadInfo = {
  type: 'download';
  payload: {
    progress: number;
  };
};

export type OnProgressUploadInfo = {
  type: 'upload';
  payload: {
    progress: number;
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
  | OnProgressDownloadInfo
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

  return makeCancelablePromise<string>(
    async () => {
      const { id, url } = await client.uploadRequest.create({ filename });

      if (isCanceledBeforeUpload) {
        throw new CanceledPromiseError();
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

      return id;
    },
    () => {
      if (uploadPromise) {
        uploadPromise.cancel();
      } else {
        isCanceledBeforeUpload = true;
      }
    },
  );
}
