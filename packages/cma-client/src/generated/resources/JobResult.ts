import * as Utils from '@datocms/rest-client-utils';
import * as SchemaTypes from '../SchemaTypes';
import * as SimpleSchemaTypes from '../SimpleSchemaTypes';
import BaseResource from '../../BaseResource';

export default class JobResult extends BaseResource {
  static readonly TYPE: 'job_result' = 'job_result';

  /**
   * Retrieve a job result
   *
   * Read more: https://www.datocms.com/docs/content-management-api/resources/job-result/self
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
   */
  rawFind(jobResultId: string): Promise<SchemaTypes.JobResultSelfTargetSchema> {
    return this.client.request<SchemaTypes.JobResultSelfTargetSchema>({
      method: 'GET',
      url: `/job-results/${jobResultId}`,
    });
  }
}
