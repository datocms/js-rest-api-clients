import * as Utils from '@datocms/rest-client-utils';
import * as SchemaTypes from '../SchemaTypes';
import * as SimpleSchemaTypes from '../SimpleSchemaTypes';
import BaseResource from '../../BaseResource';

export default class OrganizationMandate extends BaseResource {
  static readonly TYPE: 'organization_mandate' = 'organization_mandate';

  /**
   * Update an organization mandate
   *
   * @throws {ApiError}
   * @throws {TimeoutError}
   */
  update(
    organizationMandateId: string | SimpleSchemaTypes.OrganizationMandateData,
    body: SimpleSchemaTypes.OrganizationMandateUpdateSchema,
  ) {
    return this.rawUpdate(
      Utils.toId(organizationMandateId),
      Utils.serializeRequestBody<SchemaTypes.OrganizationMandateUpdateSchema>(
        body,
        {
          id: Utils.toId(organizationMandateId),
          type: 'organization_mandate',
          attributes: [],
          relationships: ['additional_enabled_plans'],
        },
      ),
    ).then((body) =>
      Utils.deserializeResponseBody<SimpleSchemaTypes.OrganizationMandateUpdateTargetSchema>(
        body,
      ),
    );
  }

  /**
   * Update an organization mandate
   *
   * @throws {ApiError}
   * @throws {TimeoutError}
   */
  rawUpdate(
    organizationMandateId: string,
    body: SchemaTypes.OrganizationMandateUpdateSchema,
  ): Promise<SchemaTypes.OrganizationMandateUpdateTargetSchema> {
    return this.client.request<SchemaTypes.OrganizationMandateUpdateTargetSchema>(
      {
        method: 'PUT',
        url: `/organization-mandates/${organizationMandateId}`,
        body,
      },
    );
  }

  /**
   * List all mandates that the organization has approved
   *
   * @throws {ApiError}
   * @throws {TimeoutError}
   */
  approvedList() {
    return this.rawApprovedList().then((body) =>
      Utils.deserializeResponseBody<SimpleSchemaTypes.OrganizationMandateApprovedInstancesTargetSchema>(
        body,
      ),
    );
  }

  /**
   * List all mandates that the organization has approved
   *
   * @throws {ApiError}
   * @throws {TimeoutError}
   */
  rawApprovedList(): Promise<SchemaTypes.OrganizationMandateApprovedInstancesTargetSchema> {
    return this.client.request<SchemaTypes.OrganizationMandateApprovedInstancesTargetSchema>(
      {
        method: 'GET',
        url: '/organization-mandates/approved',
      },
    );
  }

  /**
   * List all mandates that the organization has been given
   *
   * @throws {ApiError}
   * @throws {TimeoutError}
   */
  givenList(
    queryParams?: SimpleSchemaTypes.OrganizationMandateGivenInstancesHrefSchema,
  ) {
    return this.rawGivenList(queryParams).then((body) =>
      Utils.deserializeResponseBody<SimpleSchemaTypes.OrganizationMandateGivenInstancesTargetSchema>(
        body,
      ),
    );
  }

  /**
   * List all mandates that the organization has been given
   *
   * @throws {ApiError}
   * @throws {TimeoutError}
   */
  rawGivenList(
    queryParams?: SchemaTypes.OrganizationMandateGivenInstancesHrefSchema,
  ): Promise<SchemaTypes.OrganizationMandateGivenInstancesTargetSchema> {
    return this.client.request<SchemaTypes.OrganizationMandateGivenInstancesTargetSchema>(
      {
        method: 'GET',
        url: '/organization-mandates/given',
        queryParams,
      },
    );
  }

  /**
   * Cancel an organization mandate
   *
   * @throws {ApiError}
   * @throws {TimeoutError}
   */
  destroy(
    organizationMandateId: string | SimpleSchemaTypes.OrganizationMandateData,
  ) {
    return this.rawDestroy(Utils.toId(organizationMandateId)).then((body) =>
      Utils.deserializeResponseBody<SimpleSchemaTypes.OrganizationMandateDestroyTargetSchema>(
        body,
      ),
    );
  }

  /**
   * Cancel an organization mandate
   *
   * @throws {ApiError}
   * @throws {TimeoutError}
   */
  rawDestroy(
    organizationMandateId: string,
  ): Promise<SchemaTypes.OrganizationMandateDestroyTargetSchema> {
    return this.client.request<SchemaTypes.OrganizationMandateDestroyTargetSchema>(
      {
        method: 'DELETE',
        url: `/organization-mandates/${organizationMandateId}`,
      },
    );
  }
}
