import { basename } from 'node:path';
import type { Client } from '@datocms/cma-client';
import {
  type CancelablePromise,
  CanceledPromiseError,
  makeCancelablePromise,
} from '@datocms/rest-client-utils';
import { uploadLocalFileToS3 } from './uploadLocalFileToS3';

export type OnProgressDownloadingFileInfo = {
  type: 'DOWNLOADING_FILE';
  payload: {
    url: string;
    progress: number;
  };
};

export type OnProgressUploadingFileInfo = {
  type: 'UPLOADING_FILE';
  payload: {
    progress: number;
  };
};

export type OnProgressRequestingUploadUrlInfo = {
  type: 'REQUESTING_UPLOAD_URL';
  payload: {
    filename: string;
  };
};

export type OnProgressInfo =
  | OnProgressRequestingUploadUrlInfo
  | OnProgressDownloadingFileInfo
  | OnProgressUploadingFileInfo;

export type Options = {
  filename?: string;
  onProgress?: (info: OnProgressInfo) => void;
};

export function uploadLocalFileAndReturnPath(
  client: Client,
  localPath: string,
  options: Options = {},
): CancelablePromise<string> {
  const filename = options.filename || basename(localPath);

  let isCanceledBeforeUpload = false;
  let uploadPromise: CancelablePromise<void> | undefined = undefined;

  return makeCancelablePromise<string>(
    async () => {
      if (options.onProgress) {
        options.onProgress({
          type: 'REQUESTING_UPLOAD_URL',
          payload: { filename },
        });
      }

      const { id, url, request_headers } = await client.uploadRequest.create({
        filename,
      });

      if (isCanceledBeforeUpload) {
        throw new CanceledPromiseError();
      }

      if (options.onProgress) {
        options.onProgress({
          type: 'UPLOADING_FILE',
          payload: {
            progress: 0,
          },
        });
      }

      uploadPromise = uploadLocalFileToS3(localPath, url, {
        ...options,
        additionalHeaders: request_headers as Record<string, string>,
        fetchFn: client.config.fetchFn,
      });

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
