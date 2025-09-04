import * as Utils from '@datocms/rest-client-utils';
import BaseResource from '../../BaseResource';
import type * as ApiTypes from '../ApiTypes';
import type * as RawApiTypes from '../RawApiTypes';

export default class Workflow extends BaseResource {
  static readonly TYPE = 'workflow' as const;

  /**
   * Create a new workflow
   *
   * Read more: https://www.datocms.com/docs/content-management-api/resources/workflow/create
   *
   * @throws {ApiError}
   * @throws {TimeoutError}
   */
  create(body: ApiTypes.WorkflowCreateSchema) {
    return this.rawCreate(
      Utils.serializeRequestBody<RawApiTypes.WorkflowCreateSchema>(body, {
        type: 'workflow',
        attributes: ['name', 'api_key', 'stages'],
        relationships: [],
      }),
    ).then((body) =>
      Utils.deserializeResponseBody<ApiTypes.WorkflowCreateTargetSchema>(body),
    );
  }

  /**
   * Create a new workflow
   *
   * Read more: https://www.datocms.com/docs/content-management-api/resources/workflow/create
   *
   * @throws {ApiError}
   * @throws {TimeoutError}
   */
  rawCreate(
    body: RawApiTypes.WorkflowCreateSchema,
  ): Promise<RawApiTypes.WorkflowCreateTargetSchema> {
    return this.client.request<RawApiTypes.WorkflowCreateTargetSchema>({
      method: 'POST',
      url: '/workflows',
      body,
    });
  }

  /**
   * Update a workflow
   *
   * Read more: https://www.datocms.com/docs/content-management-api/resources/workflow/update
   *
   * @throws {ApiError}
   * @throws {TimeoutError}
   */
  update(
    workflowId: string | ApiTypes.WorkflowData,
    body: ApiTypes.WorkflowUpdateSchema,
  ) {
    return this.rawUpdate(
      Utils.toId(workflowId),
      Utils.serializeRequestBody<RawApiTypes.WorkflowUpdateSchema>(body, {
        id: Utils.toId(workflowId),
        type: 'workflow',
        attributes: ['name', 'api_key', 'stages'],
        relationships: [],
      }),
    ).then((body) =>
      Utils.deserializeResponseBody<ApiTypes.WorkflowUpdateTargetSchema>(body),
    );
  }

  /**
   * Update a workflow
   *
   * Read more: https://www.datocms.com/docs/content-management-api/resources/workflow/update
   *
   * @throws {ApiError}
   * @throws {TimeoutError}
   */
  rawUpdate(
    workflowId: string,
    body: RawApiTypes.WorkflowUpdateSchema,
  ): Promise<RawApiTypes.WorkflowUpdateTargetSchema> {
    return this.client.request<RawApiTypes.WorkflowUpdateTargetSchema>({
      method: 'PUT',
      url: `/workflows/${workflowId}`,
      body,
    });
  }

  /**
   * List all workflows
   *
   * Read more: https://www.datocms.com/docs/content-management-api/resources/workflow/instances
   *
   * @throws {ApiError}
   * @throws {TimeoutError}
   */
  list() {
    return this.rawList().then((body) =>
      Utils.deserializeResponseBody<ApiTypes.WorkflowInstancesTargetSchema>(
        body,
      ),
    );
  }

  /**
   * List all workflows
   *
   * Read more: https://www.datocms.com/docs/content-management-api/resources/workflow/instances
   *
   * @throws {ApiError}
   * @throws {TimeoutError}
   */
  rawList(): Promise<RawApiTypes.WorkflowInstancesTargetSchema> {
    return this.client.request<RawApiTypes.WorkflowInstancesTargetSchema>({
      method: 'GET',
      url: '/workflows',
    });
  }

  /**
   * Retrieve a workflow
   *
   * Read more: https://www.datocms.com/docs/content-management-api/resources/workflow/self
   *
   * @throws {ApiError}
   * @throws {TimeoutError}
   */
  find(workflowId: string | ApiTypes.WorkflowData) {
    return this.rawFind(Utils.toId(workflowId)).then((body) =>
      Utils.deserializeResponseBody<ApiTypes.WorkflowSelfTargetSchema>(body),
    );
  }

  /**
   * Retrieve a workflow
   *
   * Read more: https://www.datocms.com/docs/content-management-api/resources/workflow/self
   *
   * @throws {ApiError}
   * @throws {TimeoutError}
   */
  rawFind(workflowId: string): Promise<RawApiTypes.WorkflowSelfTargetSchema> {
    return this.client.request<RawApiTypes.WorkflowSelfTargetSchema>({
      method: 'GET',
      url: `/workflows/${workflowId}`,
    });
  }

  /**
   * Delete a workflow
   *
   * Read more: https://www.datocms.com/docs/content-management-api/resources/workflow/destroy
   *
   * @throws {ApiError}
   * @throws {TimeoutError}
   */
  destroy(workflowId: string | ApiTypes.WorkflowData) {
    return this.rawDestroy(Utils.toId(workflowId));
  }

  /**
   * Delete a workflow
   *
   * Read more: https://www.datocms.com/docs/content-management-api/resources/workflow/destroy
   *
   * @throws {ApiError}
   * @throws {TimeoutError}
   */
  rawDestroy(workflowId: string): Promise<void> {
    return this.client.request<void>({
      method: 'DELETE',
      url: `/workflows/${workflowId}`,
    });
  }
}
