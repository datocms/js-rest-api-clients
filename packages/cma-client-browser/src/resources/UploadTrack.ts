import { type ApiTypes, Resources } from '@datocms/cma-client';
import {
  type CancelablePromise,
  CanceledPromiseError,
  makeCancelablePromise,
} from '@datocms/rest-client-utils';
import {
  type OnProgressInfo,
  uploadFileOrBlobAndReturnPath,
} from '../utils/uploadFileOrBlobAndReturnPath';

export type OnProgressCreatingUploadTrackObjectInfo = {
  type: 'CREATING_UPLOAD_TRACK_OBJECT';
};

export type OnUploadTrackProgressInfo =
  | OnProgressInfo
  | OnProgressCreatingUploadTrackObjectInfo;

export type CreateUploadTrackFromFileOrBlobSchema = Omit<
  ApiTypes.UploadTrackCreateSchema,
  'url_or_upload_request_id'
> & {
  fileOrBlob: File | Blob;
  onProgress?: (info: OnUploadTrackProgressInfo) => void;
};

export default class Upload extends Resources.UploadTrack {
  /**
   * Create a new upload track using a browser File/Blob object
   *
   * Read more: https://www.datocms.com/docs/content-management-api/resources/upload-track/create
   */
  createFromFileOrBlob(
    uploadId: string | ApiTypes.UploadData,
    body: CreateUploadTrackFromFileOrBlobSchema,
  ): CancelablePromise<ApiTypes.UploadTrack> {
    let isCanceledBeforeUpload = false;
    let uploadPromise: CancelablePromise<string> | undefined;

    return makeCancelablePromise(
      async () => {
        if (isCanceledBeforeUpload) {
          throw new CanceledPromiseError();
        }

        const { fileOrBlob, onProgress, ...other } = body;

        uploadPromise = uploadFileOrBlobAndReturnPath(this.client, fileOrBlob, {
          onProgress,
        });

        const path = await uploadPromise;

        if (onProgress) {
          onProgress({ type: 'CREATING_UPLOAD_TRACK_OBJECT' });
        }

        return this.create(uploadId, {
          ...other,
          url_or_upload_request_id: path,
        });
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
