import { Resources, type SimpleSchemaTypes } from '@datocms/cma-client';
import {
  type CancelablePromise,
  CanceledPromiseError,
  makeCancelablePromise,
} from '@datocms/rest-client-utils';
import {
  type OnProgressInfo,
  uploadFileOrBlobAndReturnPath,
} from '../utils/uploadFileOrBlobAndReturnPath';

export type OnProgressCreatingUploadObjectInfo = {
  type: 'CREATING_UPLOAD_OBJECT';
};

export type OnUploadProgressInfo =
  | OnProgressInfo
  | OnProgressCreatingUploadObjectInfo;

export type CreateUploadFromFileOrBlobSchema = Omit<
  SimpleSchemaTypes.UploadCreateSchema,
  'path'
> & {
  fileOrBlob: File | Blob;
  filename?: string;
  onProgress?: (info: OnUploadProgressInfo) => void;
};

export type UpdateUploadFromFileOrBlobSchema = Omit<
  SimpleSchemaTypes.UploadUpdateSchema,
  'path'
> & {
  fileOrBlob: File | Blob;
  filename?: string;
  onProgress?: (info: OnUploadProgressInfo) => void;
};

export default class Upload extends Resources.Upload {
  /**
   * Create a new upload using a browser File/Blob object
   *
   * Read more: https://www.datocms.com/docs/content-management-api/resources/upload/create
   */
  createFromFileOrBlob(
    body: CreateUploadFromFileOrBlobSchema,
  ): CancelablePromise<SimpleSchemaTypes.Upload> {
    let isCanceledBeforeUpload = false;
    let uploadPromise: CancelablePromise<string> | undefined;

    return makeCancelablePromise(
      async () => {
        if (isCanceledBeforeUpload) {
          throw new CanceledPromiseError();
        }

        const { fileOrBlob, filename, onProgress, ...other } = body;

        uploadPromise = uploadFileOrBlobAndReturnPath(this.client, fileOrBlob, {
          filename,
          onProgress,
        });

        const path = await uploadPromise;

        if (onProgress) {
          onProgress({ type: 'CREATING_UPLOAD_OBJECT' });
        }

        return this.create({ ...other, path });
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
   * Updates an upload asset using a browser File/Blob object
   *
   * Read more: https://www.datocms.com/docs/content-management-api/resources/upload/update
   */
  updateFromFileOrBlob(
    uploadId: string | SimpleSchemaTypes.UploadData,
    body: UpdateUploadFromFileOrBlobSchema,
  ): CancelablePromise<SimpleSchemaTypes.Upload> {
    let isCanceledBeforeUpload = false;
    let uploadPromise: CancelablePromise<string> | undefined;

    return makeCancelablePromise(
      async () => {
        if (isCanceledBeforeUpload) {
          throw new CanceledPromiseError();
        }

        const { fileOrBlob, filename, onProgress, ...other } = body;

        uploadPromise = uploadFileOrBlobAndReturnPath(this.client, fileOrBlob, {
          filename,
          onProgress,
        });

        const path = await uploadPromise;

        if (onProgress) {
          onProgress({ type: 'CREATING_UPLOAD_OBJECT' });
        }

        return this.update(uploadId, { ...other, path });
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
}
