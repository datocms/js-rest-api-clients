import { Client } from '@datocms/cma-client';
import {
  CancelablePromise,
  CanceledPromiseError,
  makeCancelablePromise,
} from '@datocms/rest-client-utils';
import { uploadFileOrBlobToS3 } from './uploadFileOrBlobToS3';

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
  | OnProgressUploadingFileInfo;

export type Options = {
  filename?: string;
  onProgress?: (info: OnProgressInfo) => void;
};

export function uploadFileOrBlobAndReturnPath(
  client: Client,
  fileOrBlob: File | Blob,
  options: Options = {},
): CancelablePromise<string> {
  if (!(options.filename && 'name' in fileOrBlob)) {
    throw new Error('Missing filename, please provide it as an option!');
  }

  const filename = options.filename || fileOrBlob.name;

  let isCanceledBeforeUpload = false;
  let uploadPromise: CancelablePromise<void> | undefined = undefined;

  return makeCancelablePromise(
    async () => {
      if (options.onProgress) {
        options?.onProgress({
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

      uploadPromise = uploadFileOrBlobToS3(fileOrBlob, url, {
        ...options,
        additionalHeaders: request_headers as Record<string, string>,
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
