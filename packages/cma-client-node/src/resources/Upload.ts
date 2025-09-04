import { type ApiTypes, Resources } from '@datocms/cma-client';
import {
  type CancelablePromise,
  CanceledPromiseError,
  makeCancelablePromise,
} from '@datocms/rest-client-utils';
import { type DownloadResult, downloadFile } from '../utils/downloadFile';
import md5 from '../utils/md5';
import {
  type OnProgressInfo,
  uploadLocalFileAndReturnPath,
} from '../utils/uploadLocalFileAndReturnPath';

export type OnProgressCreatingUploadObjectInfo = {
  type: 'CREATING_UPLOAD_OBJECT';
};

export type OnUploadProgressInfo =
  | OnProgressInfo
  | OnProgressCreatingUploadObjectInfo;

export type CreateUploadFromLocalFileSchema = Omit<
  ApiTypes.UploadCreateSchema,
  'path'
> & {
  localPath: string;
  filename?: string;
  skipCreationIfAlreadyExists?: boolean;
  onProgress?: (info: OnUploadProgressInfo) => void;
};

export type UpdateUploadFromLocalFileSchema = Omit<
  ApiTypes.UploadUpdateSchema,
  'path'
> & {
  localPath: string;
  filename?: string;
  onProgress?: (info: OnUploadProgressInfo) => void;
};

export type CreateUploadFromUrlSchema = Omit<
  ApiTypes.UploadCreateSchema,
  'path'
> & {
  url: string;
  filename?: string;
  skipCreationIfAlreadyExists?: boolean;
  onProgress?: (info: OnUploadProgressInfo) => void;
};

export type UpdateUploadFromUrlSchema = Omit<
  ApiTypes.UploadUpdateSchema,
  'path'
> & {
  url: string;
  filename?: string;
  onProgress?: (info: OnUploadProgressInfo) => void;
};

export default class Upload extends Resources.Upload {
  /**
   * Create a new upload from a local file path
   *
   * Read more: https://www.datocms.com/docs/content-management-api/resources/upload/create
   */
  createFromLocalFile(
    body: CreateUploadFromLocalFileSchema,
  ): CancelablePromise<ApiTypes.Upload> {
    let isCanceledBeforeUpload = false;
    let runningPromise: CancelablePromise<string> | undefined;

    return makeCancelablePromise<ApiTypes.Upload>(
      async () => {
        if (isCanceledBeforeUpload) {
          throw new CanceledPromiseError();
        }

        const {
          localPath,
          filename,
          onProgress,
          skipCreationIfAlreadyExists,
          ...other
        } = body;

        if (skipCreationIfAlreadyExists) {
          const checksum = await md5(localPath);

          if (isCanceledBeforeUpload) {
            throw new CanceledPromiseError();
          }

          const existingUploads = await this.list({
            filter: { fields: { md5: { eq: checksum } } },
          });

          if (isCanceledBeforeUpload) {
            throw new CanceledPromiseError();
          }

          if (existingUploads.length > 0) {
            return existingUploads[0]!;
          }
        }

        runningPromise = uploadLocalFileAndReturnPath(this.client, localPath, {
          filename,
          onProgress,
        });

        const path = await runningPromise;

        if (onProgress) {
          onProgress({ type: 'CREATING_UPLOAD_OBJECT' });
        }

        return await this.create({ ...other, path });
      },
      () => {
        if (runningPromise) {
          runningPromise.cancel();
        } else {
          isCanceledBeforeUpload = true;
        }
      },
    );
  }

  /**
   * Create a new upload from a remote URL
   *
   * Read more: https://www.datocms.com/docs/content-management-api/resources/upload/create
   */
  createFromUrl(
    body: CreateUploadFromUrlSchema,
  ): CancelablePromise<ApiTypes.Upload> {
    let isCanceled = false;
    let downloadPromise: CancelablePromise<DownloadResult> | undefined;
    let runningPromise: CancelablePromise<ApiTypes.Upload> | undefined;

    return makeCancelablePromise<ApiTypes.Upload>(
      async () => {
        if (isCanceled) {
          throw new CanceledPromiseError();
        }

        const { url, onProgress, ...other } = body;

        downloadPromise = downloadFile(url, {
          onProgress,
          fetchFn: this.client.config.fetchFn,
        });

        const { filePath, deleteFile } = await downloadPromise;

        try {
          if (isCanceled) {
            throw new CanceledPromiseError();
          }

          runningPromise = this.createFromLocalFile({
            localPath: filePath,
            onProgress,
            ...other,
          });

          const result = await runningPromise;

          if (isCanceled) {
            throw new CanceledPromiseError();
          }

          return result;
        } finally {
          await deleteFile();
        }
      },
      () => {
        isCanceled = true;

        if (downloadPromise) {
          downloadPromise.cancel();
        }

        if (runningPromise) {
          runningPromise.cancel();
        }
      },
    );
  }

  /**
   * Replaces asset of an upload entity with a local file path
   *
   * Read more: https://www.datocms.com/docs/content-management-api/resources/upload/update
   */
  updateFromLocalFile(
    uploadId: string | ApiTypes.UploadData,
    body: UpdateUploadFromLocalFileSchema,
  ): CancelablePromise<ApiTypes.Upload> {
    let isCanceledBeforeUpload = false;
    let runningPromise: CancelablePromise<string> | undefined;

    return makeCancelablePromise<ApiTypes.Upload>(
      async () => {
        if (isCanceledBeforeUpload) {
          throw new CanceledPromiseError();
        }

        const { localPath, filename, onProgress, ...other } = body;

        runningPromise = uploadLocalFileAndReturnPath(this.client, localPath, {
          filename,
          onProgress,
        });

        const path = await runningPromise;

        if (onProgress) {
          onProgress({ type: 'CREATING_UPLOAD_OBJECT' });
        }

        return await this.update(uploadId, { ...other, path });
      },
      () => {
        if (runningPromise) {
          runningPromise.cancel();
        } else {
          isCanceledBeforeUpload = true;
        }
      },
    );
  }

  /**
   * Create a new upload from a remote URL
   *
   * Read more: https://www.datocms.com/docs/content-management-api/resources/upload/update
   */
  updateFromUrl(
    uploadId: string | ApiTypes.UploadData,
    body: UpdateUploadFromUrlSchema,
  ): CancelablePromise<ApiTypes.Upload> {
    let isCanceled = false;
    let downloadPromise: CancelablePromise<DownloadResult> | undefined;
    let runningPromise: CancelablePromise<ApiTypes.Upload> | undefined;

    return makeCancelablePromise<ApiTypes.Upload>(
      async () => {
        if (isCanceled) {
          throw new CanceledPromiseError();
        }

        const { url, onProgress, ...other } = body;

        downloadPromise = downloadFile(url, {
          onProgress,
          fetchFn: this.client.config.fetchFn,
        });

        const { filePath, deleteFile } = await downloadPromise;

        try {
          if (isCanceled) {
            throw new CanceledPromiseError();
          }

          runningPromise = this.updateFromLocalFile(uploadId, {
            localPath: filePath,
            onProgress,
            ...other,
          });

          const result = await runningPromise;

          if (isCanceled) {
            throw new CanceledPromiseError();
          }

          return result;
        } finally {
          await deleteFile();
        }
      },
      () => {
        isCanceled = true;

        if (downloadPromise) {
          downloadPromise.cancel();
        }

        if (runningPromise) {
          runningPromise.cancel();
        }
      },
    );
  }
}
