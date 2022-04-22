import { uploadToS3 } from './uploadToS3';

type OnProgressUploadInfo = {
  type: 'upload';
  payload: {
    percent: number;
  };
};

type OnProgressUploadRequestCompleteInfo = {
  type: 'uploadRequestComplete';
  payload: {
    id: string;
    url: string;
  };
};

type OnProgressInfo =
  | OnProgressUploadInfo
  | OnProgressUploadRequestCompleteInfo;

export type Options = {
  filename: string;
  onProgress?: (info: OnProgressInfo) => void;
};

export default function browser(client, file, { onProgress, filename }) {
  let isCancelled = false;

  let cancel = () => {
    isCancelled = true;
  };

  const promise = client.uploadRequest
    .create({ filename: filename || file.name })
    .then(({ id, url }) => {
      if (isCancelled) {
        return Promise.reject(new Error('upload aborted'));
      }
      if (onProgress) {
        onProgress({
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
        {
          onProgress,
        },
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
