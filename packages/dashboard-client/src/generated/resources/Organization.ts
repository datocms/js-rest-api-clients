import * as Utils from '@datocms/rest-client-utils';
import * as SchemaTypes from '../SchemaTypes';
import * as SimpleSchemaTypes from '../SimpleSchemaTypes';
import BaseResource from '../../BaseResource';

export default class Organization extends BaseResource {
  static readonly TYPE: 'organization' = 'organization';

  /**
   * List organizations
   *
   * @throws {ApiError}
   * @throws {TimeoutError}
   */
  list(queryParams?: SimpleSchemaTypes.OrganizationInstancesHrefSchema) {
    return this.rawList(queryParams).then((body) =>
      Utils.deserializeResponseBody<SimpleSchemaTypes.OrganizationInstancesTargetSchema>(
        body,
      ),
    );
  }

  /**
   * List organizations
   *
   * @throws {ApiError}
   * @throws {TimeoutError}
   */
  rawList(
    queryParams?: SchemaTypes.OrganizationInstancesHrefSchema,
  ): Promise<SchemaTypes.OrganizationInstancesTargetSchema> {
    return this.client.request<SchemaTypes.OrganizationInstancesTargetSchema>({
      method: 'GET',
      url: '/organizations',
      queryParams,
    });
  }

  /**
   * Retrieve an organization
   *
   * @throws {ApiError}
   * @throws {TimeoutError}
   */
  find(
    organizationId: string | SimpleSchemaTypes.OrganizationData,
    queryParams?: SimpleSchemaTypes.OrganizationSelfHrefSchema,
  ) {
    return this.rawFind(Utils.toId(organizationId), queryParams).then((body) =>
      Utils.deserializeResponseBody<SimpleSchemaTypes.OrganizationSelfTargetSchema>(
        body,
      ),
    );
  }

  /**
   * Retrieve an organization
   *
   * @throws {ApiError}
   * @throws {TimeoutError}
   */
  rawFind(
    organizationId: string,
    queryParams?: SchemaTypes.OrganizationSelfHrefSchema,
  ): Promise<SchemaTypes.OrganizationSelfTargetSchema> {
    return this.client.request<SchemaTypes.OrganizationSelfTargetSchema>({
      method: 'GET',
      url: `/organizations/${organizationId}`,
      queryParams,
    });
  }

  /**
   * Create a new organization
   *
   * @throws {ApiError}
   * @throws {TimeoutError}
   */
  create(body: SimpleSchemaTypes.OrganizationCreateSchema) {
    return this.rawCreate(
      Utils.serializeRequestBody<SchemaTypes.OrganizationCreateSchema>(body, {
        type: 'organization',
        attributes: ['name'],
        relationships: [],
      }),
    ).then((body) =>
      Utils.deserializeResponseBody<SimpleSchemaTypes.OrganizationCreateTargetSchema>(
        body,
      ),
    );
  }

  /**
   * Create a new organization
   *
   * @throws {ApiError}
   * @throws {TimeoutError}
   */
  rawCreate(
    body: SchemaTypes.OrganizationCreateSchema,
  ): Promise<SchemaTypes.OrganizationCreateTargetSchema> {
    return this.client.request<SchemaTypes.OrganizationCreateTargetSchema>({
      method: 'POST',
      url: '/organizations',
      body,
    });
  }

  /**
   * Update an organization
   *
   * @throws {ApiError}
   * @throws {TimeoutError}
   */
  update(
    organizationId: string | SimpleSchemaTypes.OrganizationData,
    body: SimpleSchemaTypes.OrganizationUpdateSchema,
  ) {
    return this.rawUpdate(
      Utils.toId(organizationId),
      Utils.serializeRequestBody<SchemaTypes.OrganizationUpdateSchema>(body, {
        id: Utils.toId(organizationId),
        type: 'organization',
        attributes: ['name'],
        relationships: [],
      }),
    ).then((body) =>
      Utils.deserializeResponseBody<SimpleSchemaTypes.OrganizationUpdateTargetSchema>(
        body,
      ),
    );
  }

  /**
   * Update an organization
   *
   * @throws {ApiError}
   * @throws {TimeoutError}
   */
  rawUpdate(
    organizationId: string,
    body: SchemaTypes.OrganizationUpdateSchema,
  ): Promise<SchemaTypes.OrganizationUpdateTargetSchema> {
    return this.client.request<SchemaTypes.OrganizationUpdateTargetSchema>({
      method: 'PUT',
      url: `/organizations/${organizationId}`,
      body,
    });
  }

  /**
   * Destroy an organization
   *
   * @throws {ApiError}
   * @throws {TimeoutError}
   */
  destroy(siteId: string | SimpleSchemaTypes.SiteData) {
    return this.rawDestroy(Utils.toId(siteId)).then((body) =>
      Utils.deserializeResponseBody<SimpleSchemaTypes.OrganizationDestroyJobSchema>(
        body,
      ),
    );
  }

  /**
   * Destroy an organization
   *
   * @throws {ApiError}
   * @throws {TimeoutError}
   */
  rawDestroy(
    siteId: string,
  ): Promise<SchemaTypes.OrganizationDestroyJobSchema> {
    return this.client.request<SchemaTypes.OrganizationDestroyJobSchema>({
      method: 'DELETE',
      url: `/organizations/${siteId}`,
    });
  }
}
