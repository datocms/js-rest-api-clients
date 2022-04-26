import { makeCancelablePromise } from '@datocms/rest-client-utils';
import { CancelablePromise } from '@datocms/rest-client-utils/src';
import { OnProgressInfo } from '../uploadFileOrBlobAndReturnPath';

type Options = {
  onProgress?: (info: OnProgressInfo) => void;
};

export function uploadFileOrBlobToS3(
  fileOrBlob: File | Blob,
  url: string,
  { onProgress }: Options = {},
): CancelablePromise<void> {
  const xhr = new XMLHttpRequest();

  return makeCancelablePromise(
    new Promise<void>((resolve, reject) => {
      if (onProgress && xhr.upload) {
        xhr.upload.onprogress = (e) => {
          if (e.lengthComputable) {
            onProgress({
              type: 'upload',
              payload: { progress: Math.round((e.loaded / e.total) * 100) },
            });
          }
        };
      }

      xhr.onreadystatechange = () => {
        if (xhr.readyState === 4) {
          if (xhr.status === 200) {
            resolve();
          } else {
            reject(new Error(`Status ${xhr.status}`));
          }
        }
      };

      xhr.addEventListener('error', reject, false);
      xhr.open('PUT', url, true);
      xhr.send(fileOrBlob);
    }),
    () => {
      xhr.onreadystatechange = null;
      xhr.abort();
    },
  );
}
