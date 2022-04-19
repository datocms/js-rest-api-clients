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

export default class Workflow extends BaseResource {
  static readonly TYPE: 'workflow' = 'workflow';

  /**
   * Create a new workflow
   *
   * Read more: https://www.datocms.com/docs/content-management-api/resources/workflow/create
   */
  create(body: SimpleSchemaTypes.WorkflowCreateSchema) {
    return this.rawCreate(
      serializeRequestBody<SchemaTypes.WorkflowCreateSchema>({
        body,
        type: Workflow.TYPE,
      }),
    ).then((body) =>
      deserializeResponseBody<SimpleSchemaTypes.WorkflowCreateTargetSchema>(
        body,
      ),
    );
  }

  /**
   * Create a new workflow
   *
   * Read more: https://www.datocms.com/docs/content-management-api/resources/workflow/create
   */
  rawCreate(
    body: SchemaTypes.WorkflowCreateSchema,
  ): Promise<SchemaTypes.WorkflowCreateTargetSchema> {
    return this.client.request<SchemaTypes.WorkflowCreateTargetSchema>({
      method: 'POST',
      url: `/workflows`,
      body,
    });
  }

  /**
   * Update a workflow
   *
   * Read more: https://www.datocms.com/docs/content-management-api/resources/workflow/update
   */
  update(
    workflowId: string | SimpleSchemaTypes.WorkflowData,
    body: SimpleSchemaTypes.WorkflowUpdateSchema,
  ) {
    return this.rawUpdate(
      toId(workflowId),
      serializeRequestBody<SchemaTypes.WorkflowUpdateSchema>({
        body,
        id: toId(workflowId),
        type: Workflow.TYPE,
      }),
    ).then((body) =>
      deserializeResponseBody<SimpleSchemaTypes.WorkflowUpdateTargetSchema>(
        body,
      ),
    );
  }

  /**
   * Update a workflow
   *
   * Read more: https://www.datocms.com/docs/content-management-api/resources/workflow/update
   */
  rawUpdate(
    workflowId: string,
    body: SchemaTypes.WorkflowUpdateSchema,
  ): Promise<SchemaTypes.WorkflowUpdateTargetSchema> {
    return this.client.request<SchemaTypes.WorkflowUpdateTargetSchema>({
      method: 'PUT',
      url: `/workflows/${workflowId}`,
      body,
    });
  }

  /**
   * List all workflows
   *
   * Read more: https://www.datocms.com/docs/content-management-api/resources/workflow/instances
   */
  list() {
    return this.rawList().then((body) =>
      deserializeResponseBody<SimpleSchemaTypes.WorkflowInstancesTargetSchema>(
        body,
      ),
    );
  }

  /**
   * List all workflows
   *
   * Read more: https://www.datocms.com/docs/content-management-api/resources/workflow/instances
   */
  rawList(): Promise<SchemaTypes.WorkflowInstancesTargetSchema> {
    return this.client.request<SchemaTypes.WorkflowInstancesTargetSchema>({
      method: 'GET',
      url: `/workflows`,
    });
  }

  /**
   * Retrieve a workflow
   *
   * Read more: https://www.datocms.com/docs/content-management-api/resources/workflow/self
   */
  find(workflowId: string | SimpleSchemaTypes.WorkflowData) {
    return this.rawFind(toId(workflowId)).then((body) =>
      deserializeResponseBody<SimpleSchemaTypes.WorkflowSelfTargetSchema>(body),
    );
  }

  /**
   * Retrieve a workflow
   *
   * Read more: https://www.datocms.com/docs/content-management-api/resources/workflow/self
   */
  rawFind(workflowId: string): Promise<SchemaTypes.WorkflowSelfTargetSchema> {
    return this.client.request<SchemaTypes.WorkflowSelfTargetSchema>({
      method: 'GET',
      url: `/workflows/${workflowId}`,
    });
  }

  /**
   * Delete a workflow
   *
   * Read more: https://www.datocms.com/docs/content-management-api/resources/workflow/destroy
   */
  destroy(workflowId: string | SimpleSchemaTypes.WorkflowData) {
    return this.rawDestroy(toId(workflowId));
  }

  /**
   * Delete a workflow
   *
   * Read more: https://www.datocms.com/docs/content-management-api/resources/workflow/destroy
   */
  rawDestroy(workflowId: string): Promise<void> {
    return this.client.request<void>({
      method: 'DELETE',
      url: `/workflows/${workflowId}`,
    });
  }
}
