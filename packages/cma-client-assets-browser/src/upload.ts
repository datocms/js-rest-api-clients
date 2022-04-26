import { Client } from '@datocms/cma-client';
import { uploadToS3 } from './uploadToS3';

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

export default function upload(
  client: Client,
  file: Blob | File,
  options: Options = {},
): { promise: Promise<string>; cancel: () => void } {
  let isCancelled = false;

  let cancel = () => {
    isCancelled = true;
  };

  let filename: string | undefined = options.filename;

  if (!filename) {
    if (!('name' in file)) {
      throw new Error('Missing filename, please provide it as an option!');
    }

    filename = file.name;
  }

  const promise = client.uploadRequest
    .create({ filename })
    .then(({ id, url }) => {
      if (isCancelled) {
        return Promise.reject(new Error('Upload aborted'));
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
      const { promise: uploadPromise, cancel: cancelUpload } = uploadToS3(
        file,
        url,
        options,
      );
      cancel = cancelUpload;
      return uploadPromise.then(() => id);
    });

  return {
    promise,
    cancel: () => {
      cancel();
    },
  };
}
