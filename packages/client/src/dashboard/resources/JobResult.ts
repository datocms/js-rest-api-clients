import BaseResource from '../BaseResource';
import { serializeRequestBody } from '../../serialize';
import {
  deserializeResponseBody,
  deserializeJsonEntity,
} from '../../deserialize';
import toId from '../../toId';
import * as SchemaTypes from '../SchemaTypes';
import * as SimpleSchemaTypes from '../SimpleSchemaTypes';
import { IteratorOptions, rawPageIterator } from '../../rawPageIterator';

export default class JobResult extends BaseResource {
  static readonly TYPE: 'job_result' = 'job_result';

  /**
   * Retrieve a job result
   */
  find(jobResultId: string | SimpleSchemaTypes.JobResultData) {
    return this.rawFind(toId(jobResultId)).then((body) =>
      deserializeResponseBody<SimpleSchemaTypes.JobResultSelfTargetSchema>(
        body,
      ),
    );
  }

  /**
   * Retrieve a job result
   */
  rawFind(jobResultId: string): Promise<SchemaTypes.JobResultSelfTargetSchema> {
    return this.client.request<SchemaTypes.JobResultSelfTargetSchema>({
      method: 'GET',
      url: `/job-results/${jobResultId}`,
    });
  }
}
