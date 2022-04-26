import {
  CancelablePromise,
  CanceledPromiseError,
} from '@datocms/rest-client-utils/src';
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

  const promise = new CancelablePromise<void>((resolve, reject) => {
    if (onProgress && xhr.upload) {
      xhr.upload.onprogress = (e) => {
        if (e.lengthComputable) {
          const percent = Math.round((e.loaded / e.total) * 100);
          onProgress({ type: 'upload', payload: { percent } });
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
    xhr.onabort = () => {
      reject(new CanceledPromiseError());
    };
    xhr.open('PUT', url, true);
    xhr.send(fileOrBlob);
  });

  promise.cancelMethod = () => {
    xhr.onreadystatechange = null;
    xhr.abort();
  };

  return promise;
}
