import * as Utils from '@datocms/rest-client-utils';
import * as SchemaTypes from '../SchemaTypes';
import * as SimpleSchemaTypes from '../SimpleSchemaTypes';
import BaseResource from '../../BaseResource';

export default class Workflow extends BaseResource {
  static readonly TYPE: 'workflow' = 'workflow';

  /**
   * Create a new workflow
   *
   * Read more: https://www.datocms.com/docs/content-management-api/resources/workflow/create
   */
  create(body: SimpleSchemaTypes.WorkflowCreateSchema) {
    return this.rawCreate(
      Utils.serializeRequestBody<SchemaTypes.WorkflowCreateSchema>(body, {
        type: 'workflow',
        attributes: ['name', 'stages'],
        relationships: [],
      }),
    ).then((body) =>
      Utils.deserializeResponseBody<SimpleSchemaTypes.WorkflowCreateTargetSchema>(
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
      Utils.toId(workflowId),
      Utils.serializeRequestBody<SchemaTypes.WorkflowUpdateSchema>(body, {
        id: Utils.toId(workflowId),
        type: 'workflow',
        attributes: ['name', 'stages'],
        relationships: [],
      }),
    ).then((body) =>
      Utils.deserializeResponseBody<SimpleSchemaTypes.WorkflowUpdateTargetSchema>(
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
      Utils.deserializeResponseBody<SimpleSchemaTypes.WorkflowInstancesTargetSchema>(
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
    return this.rawFind(Utils.toId(workflowId)).then((body) =>
      Utils.deserializeResponseBody<SimpleSchemaTypes.WorkflowSelfTargetSchema>(
        body,
      ),
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
    return this.rawDestroy(Utils.toId(workflowId));
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
