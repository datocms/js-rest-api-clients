import { Resources, SimpleSchemaTypes } from '@datocms/cma-client';
import {
  uploadFileOrBlobAndReturnPath,
  Options,
} from './uploadFileOrBlobAndReturnPath';
import {
  CancelablePromise,
  CanceledPromiseError,
  makeCancelablePromise,
} from '@datocms/rest-client-utils';

export type CreateUploadFromFileOrBlobSchema = Omit<
  SimpleSchemaTypes.UploadCreateSchema,
  'path'
> &
  Options & { fileOrBlob: File | Blob };

export class UploadResource extends Resources.Upload {
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
}
