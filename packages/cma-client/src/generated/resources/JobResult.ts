import * as Utils from '@datocms/rest-client-utils';
import BaseResource from '../../BaseResource';
import type * as SchemaTypes from '../SchemaTypes';
import type * as SimpleSchemaTypes from '../SimpleSchemaTypes';

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
  find(jobResultId: string | SimpleSchemaTypes.JobResultData) {
    return this.rawFind(Utils.toId(jobResultId)).then((body) =>
      Utils.deserializeResponseBody<SimpleSchemaTypes.JobResultSelfTargetSchema>(
        body,
      ),
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
  rawFind(jobResultId: string): Promise<SchemaTypes.JobResultSelfTargetSchema> {
    return this.client.request<SchemaTypes.JobResultSelfTargetSchema>({
      method: 'GET',
      url: `/job-results/${jobResultId}`,
    });
  }
}
