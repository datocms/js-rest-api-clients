import { Resources, SimpleSchemaTypes } from '@datocms/cma-client';
import {
  uploadLocalFileAndReturnPath,
  Options,
} from './uploadLocalFileAndReturnPath';
import {
  CancelablePromise,
  CanceledPromiseError,
} from '@datocms/rest-client-utils';
import { makeCancelablePromise } from '@datocms/rest-client-utils';
import downloadLocally, { DownloadResult } from './utils/downloadFile';

export type CreateUploadFromLocalFileSchema = Omit<
  SimpleSchemaTypes.UploadCreateSchema,
  'path'
> &
  Options & { localPath: string };

export type CreateUploadFromUrlSchema = Omit<
  SimpleSchemaTypes.UploadCreateSchema,
  'path'
> &
  Options & { url: string };

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
    let uploadPromise: CancelablePromise<string> | undefined;

    return makeCancelablePromise<SimpleSchemaTypes.Upload>(
      async () => {
        if (isCanceledBeforeUpload) {
          throw new CanceledPromiseError();
        }

        const { localPath, filename, onProgress, ...other } = body;

        uploadPromise = uploadLocalFileAndReturnPath(this.client, localPath, {
          filename,
          onProgress,
        });
        const path = await uploadPromise;

        return await this.create({ ...other, path });
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
    let uploadPromise: CancelablePromise<string> | undefined;

    return makeCancelablePromise<SimpleSchemaTypes.Upload>(
      async () => {
        if (isCanceled) {
          throw new CanceledPromiseError();
        }

        const { url, filename, onProgress, ...other } = body;

        downloadPromise = downloadLocally(url, { onProgress });

        const { filePath, deleteFile } = await downloadPromise;

        try {
          if (isCanceled) {
            throw new CanceledPromiseError();
          }

          uploadPromise = uploadLocalFileAndReturnPath(this.client, filePath, {
            filename,
            onProgress,
          });

          const path = await uploadPromise;

          if (isCanceled) {
            throw new CanceledPromiseError();
          }

          return await this.create({ ...other, path });
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

        if (uploadPromise) {
          uploadPromise.cancel();
        }
      },
    );
  }
}
