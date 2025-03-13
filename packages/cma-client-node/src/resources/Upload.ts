import { Resources, type SimpleSchemaTypes } from '@datocms/cma-client';
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
  SimpleSchemaTypes.UploadCreateSchema,
  'path'
> & {
  localPath: string;
  filename?: string;
  skipCreationIfAlreadyExists?: boolean;
  onProgress?: (info: OnUploadProgressInfo) => void;
};

export type UpdateUploadFromLocalFileSchema = Omit<
  SimpleSchemaTypes.UploadUpdateSchema,
  'path'
> & {
  localPath: string;
  filename?: string;
  onProgress?: (info: OnUploadProgressInfo) => void;
};

export type CreateUploadFromUrlSchema = Omit<
  SimpleSchemaTypes.UploadCreateSchema,
  'path'
> & {
  url: string;
  filename?: string;
  skipCreationIfAlreadyExists?: boolean;
  onProgress?: (info: OnUploadProgressInfo) => void;
};

export type UpdateUploadFromUrlSchema = Omit<
  SimpleSchemaTypes.UploadUpdateSchema,
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
  ): CancelablePromise<SimpleSchemaTypes.Upload> {
    let isCanceledBeforeUpload = false;
    let runningPromise: CancelablePromise<string> | undefined;

    return makeCancelablePromise<SimpleSchemaTypes.Upload>(
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
  ): CancelablePromise<SimpleSchemaTypes.Upload> {
    let isCanceled = false;
    let downloadPromise: CancelablePromise<DownloadResult> | undefined;
    let runningPromise: CancelablePromise<SimpleSchemaTypes.Upload> | undefined;

    return makeCancelablePromise<SimpleSchemaTypes.Upload>(
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
    uploadId: string | SimpleSchemaTypes.UploadData,
    body: UpdateUploadFromLocalFileSchema,
  ): CancelablePromise<SimpleSchemaTypes.Upload> {
    let isCanceledBeforeUpload = false;
    let runningPromise: CancelablePromise<string> | undefined;

    return makeCancelablePromise<SimpleSchemaTypes.Upload>(
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
    uploadId: string | SimpleSchemaTypes.UploadData,
    body: UpdateUploadFromUrlSchema,
  ): CancelablePromise<SimpleSchemaTypes.Upload> {
    let isCanceled = false;
    let downloadPromise: CancelablePromise<DownloadResult> | undefined;
    let runningPromise: CancelablePromise<SimpleSchemaTypes.Upload> | undefined;

    return makeCancelablePromise<SimpleSchemaTypes.Upload>(
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
