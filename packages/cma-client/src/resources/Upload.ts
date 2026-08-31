import type * as ApiTypes from '../generated/ApiTypes.js';
import BaseUpload from '../generated/resources/Upload.js';
import {
  encodeDefaultFieldMetadata,
  normalizeUpload,
} from '../utilities/defaultFieldMetadata.js';

/**
 * `default_field_metadata` travels in one of two shapes, and which one an
 * environment speaks depends on the `non_localized_focal_points` opt-in — each
 * rejects the other with `422 INVALID_FORMAT`. This resource hides that: you
 * always read and write the field-keyed shape the types describe, and the
 * legacy one is converted to and from as needed.
 *
 * The raw methods are deliberately left alone: they are the escape hatch for
 * anyone who needs to see what actually goes over the wire.
 */
export default class UploadResource extends BaseUpload {
  /**
   * Create a new upload
   *
   * Read more: https://www.datocms.com/docs/content-management-api/resources/upload/create
   *
   * @throws {ApiError}
   * @throws {TimeoutError}
   */
  async create(body: ApiTypes.UploadCreateSchema) {
    return normalizeUpload(
      await super.create(await encodeDefaultFieldMetadata(this.client, body)),
    );
  }

  /**
   * Update an upload
   *
   * Read more: https://www.datocms.com/docs/content-management-api/resources/upload/update
   *
   * @throws {ApiError}
   * @throws {TimeoutError}
   */
  async update(
    uploadId: string | ApiTypes.UploadData,
    body: ApiTypes.UploadUpdateSchema,
    queryParams?: ApiTypes.UploadUpdateHrefSchema,
  ) {
    return normalizeUpload(
      await super.update(
        uploadId,
        await encodeDefaultFieldMetadata(this.client, body),
        queryParams,
      ),
    );
  }

  /**
   * Retrieve an upload
   *
   * Read more: https://www.datocms.com/docs/content-management-api/resources/upload/self
   *
   * @throws {ApiError}
   * @throws {TimeoutError}
   */
  async find(uploadId: string | ApiTypes.UploadData) {
    return normalizeUpload(await super.find(uploadId));
  }

  /**
   * List all uploads
   *
   * Read more: https://www.datocms.com/docs/content-management-api/resources/upload/instances
   *
   * @throws {ApiError}
   * @throws {TimeoutError}
   */
  async list(queryParams?: ApiTypes.UploadInstancesHrefSchema) {
    return (await super.list(queryParams)).map(normalizeUpload);
  }

  /**
   * Async iterator to auto-paginate over elements returned by list()
   *
   * Read more: https://www.datocms.com/docs/content-management-api/resources/upload/instances
   *
   * @throws {ApiError}
   * @throws {TimeoutError}
   */
  async *listPagedIterator(
    ...args: Parameters<BaseUpload['listPagedIterator']>
  ) {
    for await (const upload of super.listPagedIterator(...args)) {
      yield normalizeUpload(upload);
    }
  }
}
