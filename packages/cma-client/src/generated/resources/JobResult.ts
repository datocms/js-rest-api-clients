import * as Utils from '@datocms/rest-client-utils';
import BaseResource from '../../BaseResource';
import type * as ApiTypes from '../ApiTypes';
import type * as RawApiTypes from '../RawApiTypes';

export default class JobResult extends BaseResource {
  static readonly TYPE = 'job_result' as const;

  /**
   * Retrieve a job result
   *
   * Read more: https://www.datocms.com/docs/content-management-api/resources/job-result/self
   *
   * @throws {ApiError}
   * @throws {TimeoutError}
   */
  find(jobResultId: string | ApiTypes.JobResultData) {
    return this.rawFind(Utils.toId(jobResultId)).then((body) =>
      Utils.deserializeResponseBody<ApiTypes.JobResultSelfTargetSchema>(body),
    );
  }

  /**
   * Retrieve a job result
   *
   * Read more: https://www.datocms.com/docs/content-management-api/resources/job-result/self
   *
   * @throws {ApiError}
   * @throws {TimeoutError}
   */
  rawFind(jobResultId: string): Promise<RawApiTypes.JobResultSelfTargetSchema> {
    return this.client.request<RawApiTypes.JobResultSelfTargetSchema>({
      method: 'GET',
      url: `/job-results/${jobResultId}`,
    });
  }
}
