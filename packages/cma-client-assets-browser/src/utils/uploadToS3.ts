import { OnProgressInfo } from '.';

type Options = {
  onProgress?: (info: OnProgressInfo) => void;
};

export function uploadToS3(
  file: File | Blob,
  url: string,
  { onProgress }: Options = {},
): { promise: Promise<void>; cancel: () => void } {
  const xhr = new XMLHttpRequest();

  const promise = new Promise<void>((resolve, reject) => {
    if (onProgress && xhr.upload) {
      xhr.upload.onprogress = (e) => {
        if (e.lengthComputable) {
          const percent = (e.loaded / e.total) * 100;
          onProgress({ type: 'upload', payload: { percent } });
        }
      };
    }

    xhr.onreadystatechange = () => {
      if (xhr.readyState === 4) {
        if (xhr.status === 200) {
          resolve(undefined);
        } else {
          reject(new Error(`Status ${xhr.status}`));
        }
      }
    };

    xhr.addEventListener('error', reject, false);
    xhr.onabort = () => {
      reject(new Error('Upload aborted'));
    };
    xhr.open('PUT', url, true);
    xhr.send(file);
  });

  const cancel = () => {
    xhr.onreadystatechange = null;
    xhr.abort();
  };

  return { promise, cancel };
}
