import { type ApiTypes, Resources } from '@datocms/cma-client';
import {
  type CancelablePromise,
  CanceledPromiseError,
  makeCancelablePromise,
} from '@datocms/rest-client-utils';
import {
  type OnProgressInfo,
  uploadLocalFileAndReturnPath,
} from '../utils/uploadLocalFileAndReturnPath';

export type OnProgressCreatingUploadTrackObjectInfo = {
  type: 'CREATING_UPLOAD_TRACK_OBJECT';
};

export type OnUploadTrackProgressInfo =
  | OnProgressInfo
  | OnProgressCreatingUploadTrackObjectInfo;

export type CreateUploadTrackFromLocalFileSchema = Omit<
  ApiTypes.UploadTrackCreateSchema,
  'url_or_upload_request_id'
> & {
  localPath: string;
  onProgress?: (info: OnUploadTrackProgressInfo) => void;
};

export default class Upload extends Resources.UploadTrack {
  /**
   * Create a new upload track from a local file path
   *
   * Read more: https://www.datocms.com/docs/content-management-api/resources/upload-track/create
   */
  createFromLocalFile(
    uploadId: string | ApiTypes.UploadData,
    body: CreateUploadTrackFromLocalFileSchema,
  ): CancelablePromise<ApiTypes.UploadTrack> {
    let isCanceledBeforeUpload = false;
    let runningPromise: CancelablePromise<string> | undefined;

    return makeCancelablePromise<ApiTypes.UploadTrack>(
      async () => {
        if (isCanceledBeforeUpload) {
          throw new CanceledPromiseError();
        }

        const { localPath, onProgress, ...other } = body;

        runningPromise = uploadLocalFileAndReturnPath(this.client, localPath, {
          onProgress,
        });

        const path = await runningPromise;

        if (onProgress) {
          onProgress({ type: 'CREATING_UPLOAD_TRACK_OBJECT' });
        }

        return await this.create(uploadId, {
          ...other,
          url_or_upload_request_id: path,
        });
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
}
