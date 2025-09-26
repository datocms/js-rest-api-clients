import * as Utils from '@datocms/rest-client-utils';
import BaseResource from '../../BaseResource';
import type * as ApiTypes from '../ApiTypes';
import type * as RawApiTypes from '../RawApiTypes';

export default class Organization extends BaseResource {
  static readonly TYPE = 'organization' as const;

  /**
   * List organizations
   *
   * @throws {ApiError}
   * @throws {TimeoutError}
   */
  list(queryParams?: ApiTypes.OrganizationInstancesHrefSchema) {
    return this.rawList(queryParams).then((body) =>
      Utils.deserializeResponseBody<ApiTypes.OrganizationInstancesTargetSchema>(
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
    queryParams?: RawApiTypes.OrganizationInstancesHrefSchema,
  ): Promise<RawApiTypes.OrganizationInstancesTargetSchema> {
    return this.client.request<RawApiTypes.OrganizationInstancesTargetSchema>({
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
    organizationId: string | ApiTypes.OrganizationData,
    queryParams?: ApiTypes.OrganizationSelfHrefSchema,
  ) {
    return this.rawFind(Utils.toId(organizationId), queryParams).then((body) =>
      Utils.deserializeResponseBody<ApiTypes.OrganizationSelfTargetSchema>(
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
    queryParams?: RawApiTypes.OrganizationSelfHrefSchema,
  ): Promise<RawApiTypes.OrganizationSelfTargetSchema> {
    return this.client.request<RawApiTypes.OrganizationSelfTargetSchema>({
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
  create(body: ApiTypes.OrganizationCreateSchema) {
    return this.rawCreate(
      Utils.serializeRequestBody<RawApiTypes.OrganizationCreateSchema>(body, {
        type: 'organization',
        attributes: ['name'],
        relationships: [],
      }),
    ).then((body) =>
      Utils.deserializeResponseBody<ApiTypes.OrganizationCreateTargetSchema>(
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
    body: RawApiTypes.OrganizationCreateSchema,
  ): Promise<RawApiTypes.OrganizationCreateTargetSchema> {
    return this.client.request<RawApiTypes.OrganizationCreateTargetSchema>({
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
    organizationId: string | ApiTypes.OrganizationData,
    body: ApiTypes.OrganizationUpdateSchema,
  ) {
    return this.rawUpdate(
      Utils.toId(organizationId),
      Utils.serializeRequestBody<RawApiTypes.OrganizationUpdateSchema>(body, {
        id: Utils.toId(organizationId),
        type: 'organization',
        attributes: ['name'],
        relationships: [],
      }),
    ).then((body) =>
      Utils.deserializeResponseBody<ApiTypes.OrganizationUpdateTargetSchema>(
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
    body: RawApiTypes.OrganizationUpdateSchema,
  ): Promise<RawApiTypes.OrganizationUpdateTargetSchema> {
    return this.client.request<RawApiTypes.OrganizationUpdateTargetSchema>({
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
  destroy(
    organizationId: string | ApiTypes.OrganizationData,
    body: ApiTypes.OrganizationDestroySchema,
  ) {
    return this.rawDestroy(
      Utils.toId(organizationId),
      Utils.serializeRequestBody<RawApiTypes.OrganizationDestroySchema>(body, {
        type: 'organization_destroy_request',
        attributes: ['otp_code', 'password'],
        relationships: [],
      }),
    ).then((body) =>
      Utils.deserializeResponseBody<ApiTypes.OrganizationDestroyJobSchema>(
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
    organizationId: string,
    body: RawApiTypes.OrganizationDestroySchema,
  ): Promise<RawApiTypes.OrganizationDestroyJobSchema> {
    return this.client.request<RawApiTypes.OrganizationDestroyJobSchema>({
      method: 'POST',
      url: `/organizations/${organizationId}/destroy`,
      body,
    });
  }
}
