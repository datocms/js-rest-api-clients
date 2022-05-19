import { Resources, SimpleSchemaTypes } from '@datocms/cma-client';
import {
  uploadLocalFileAndReturnPath,
  OnProgressInfo,
} from './utils/uploadLocalFileAndReturnPath';
import {
  CancelablePromise,
  CanceledPromiseError,
} from '@datocms/rest-client-utils';
import { makeCancelablePromise } from '@datocms/rest-client-utils';
import { downloadFile, DownloadResult } from './utils/downloadFile';
import md5 from './utils/md5';

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

export type CreateUploadFromUrlSchema = Omit<
  SimpleSchemaTypes.UploadCreateSchema,
  'path'
> & {
  url: string;
  filename?: string;
  skipCreationIfAlreadyExists?: boolean;
  onProgress?: (info: OnUploadProgressInfo) => void;
};

export class UploadResource extends Resources.Upload {
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
            return existingUploads[0];
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

        downloadPromise = downloadFile(url, { onProgress });

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
        } catch (e) {
          await deleteFile();
          throw e;
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
