import { Resources, SimpleSchemaTypes } from '@datocms/cma-client';
import {
  uploadFileOrBlobAndReturnPath,
  Options,
} from './uploadFileOrBlobAndReturnPath';
import {
  CancelablePromise,
  CanceledPromiseError,
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

    const promise = new CancelablePromise<SimpleSchemaTypes.Upload>(
      async (resolve, reject) => {
        try {
          if (isCanceledBeforeUpload) {
            reject(new CanceledPromiseError());
            return;
          }

          const { fileOrBlob, filename, onProgress, ...other } = body;

          uploadPromise = uploadFileOrBlobAndReturnPath(
            this.client,
            fileOrBlob,
            {
              filename,
              onProgress,
            },
          );
          const path = await uploadPromise;

          const result = await this.create({ ...other, path });
          resolve(result);
        } catch (e) {
          reject(e);
        }
      },
    );

    promise.cancel = () => {
      if (uploadPromise) {
        uploadPromise.cancel();
      } else {
        isCanceledBeforeUpload = true;
      }
    };

    return promise;
  }
}
