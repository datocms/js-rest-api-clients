import * as Utils from '@datocms/rest-client-utils';
import BaseResource from '../../BaseResource';
import type * as ApiTypes from '../ApiTypes';
import type * as RawApiTypes from '../RawApiTypes';

export default class SiteTransfer extends BaseResource {
  static readonly TYPE = 'site_transfer' as const;

  /**
   * List all pending transfer requests
   *
   * @throws {ApiError}
   * @throws {TimeoutError}
   */
  list() {
    return this.rawList().then((body) =>
      Utils.deserializeResponseBody<ApiTypes.SiteTransferInstancesTargetSchema>(
        body,
      ),
    );
  }

  /**
   * List all pending transfer requests
   *
   * @throws {ApiError}
   * @throws {TimeoutError}
   */
  rawList(): Promise<RawApiTypes.SiteTransferInstancesTargetSchema> {
    return this.client.request<RawApiTypes.SiteTransferInstancesTargetSchema>({
      method: 'GET',
      url: '/site-transfers',
    });
  }

  /**
   * Retrieve a transfer
   *
   * @throws {ApiError}
   * @throws {TimeoutError}
   */
  find(siteTransferId: string | ApiTypes.SiteTransferData) {
    return this.rawFind(Utils.toId(siteTransferId)).then((body) =>
      Utils.deserializeResponseBody<ApiTypes.SiteTransferSelfTargetSchema>(
        body,
      ),
    );
  }

  /**
   * Retrieve a transfer
   *
   * @throws {ApiError}
   * @throws {TimeoutError}
   */
  rawFind(
    siteTransferId: string,
  ): Promise<RawApiTypes.SiteTransferSelfTargetSchema> {
    return this.client.request<RawApiTypes.SiteTransferSelfTargetSchema>({
      method: 'GET',
      url: `/site-transfers/${siteTransferId}`,
    });
  }

  /**
   * Create a new site transfer request
   *
   * @throws {ApiError}
   * @throws {TimeoutError}
   */
  create(
    siteId: string | ApiTypes.SiteData,
    body: ApiTypes.SiteTransferCreateSchema,
  ) {
    return this.rawCreate(
      Utils.toId(siteId),
      Utils.serializeRequestBody<RawApiTypes.SiteTransferCreateSchema>(body, {
        type: 'site_transfer',
        attributes: ['destination'],
        relationships: [],
      }),
    ).then((body) =>
      Utils.deserializeResponseBody<ApiTypes.SiteTransferCreateTargetSchema>(
        body,
      ),
    );
  }

  /**
   * Create a new site transfer request
   *
   * @throws {ApiError}
   * @throws {TimeoutError}
   */
  rawCreate(
    siteId: string,
    body: RawApiTypes.SiteTransferCreateSchema,
  ): Promise<RawApiTypes.SiteTransferCreateTargetSchema> {
    return this.client.request<RawApiTypes.SiteTransferCreateTargetSchema>({
      method: 'POST',
      url: `/sites/${siteId}/transfer`,
      body,
    });
  }

  /**
   * Destroy a site transfer request
   *
   * @throws {ApiError}
   * @throws {TimeoutError}
   */
  destroy(siteId: string | ApiTypes.SiteData) {
    return this.rawDestroy(Utils.toId(siteId)).then((body) =>
      Utils.deserializeResponseBody<ApiTypes.SiteTransferDestroyTargetSchema>(
        body,
      ),
    );
  }

  /**
   * Destroy a site transfer request
   *
   * @throws {ApiError}
   * @throws {TimeoutError}
   */
  rawDestroy(
    siteId: string,
  ): Promise<RawApiTypes.SiteTransferDestroyTargetSchema> {
    return this.client.request<RawApiTypes.SiteTransferDestroyTargetSchema>({
      method: 'DELETE',
      url: `/sites/${siteId}/transfer`,
    });
  }

  /**
   * Simulate accept
   *
   * @throws {ApiError}
   * @throws {TimeoutError}
   */
  rawSimulateAccept(
    siteTransferId: string,
    body: RawApiTypes.SiteTransferSimulateAcceptSchema,
  ): Promise<RawApiTypes.SiteTransferSimulateAcceptTargetSchema> {
    return this.client.request<RawApiTypes.SiteTransferSimulateAcceptTargetSchema>(
      {
        method: 'PUT',
        url: `/site-transfers/${siteTransferId}/simulate-accept`,
        body,
      },
    );
  }

  /**
   * Accept a site transfer request
   *
   * @throws {ApiError}
   * @throws {TimeoutError}
   */
  rawAccept(
    siteTransferId: string,
    body: RawApiTypes.SiteTransferAcceptSchema,
  ): Promise<RawApiTypes.SiteTransferAcceptTargetSchema> {
    return this.client.request<RawApiTypes.SiteTransferAcceptTargetSchema>({
      method: 'PUT',
      url: `/site-transfers/${siteTransferId}/accept`,
      body,
    });
  }

  /**
   * Decline a site transfer request
   *
   * @throws {ApiError}
   * @throws {TimeoutError}
   */
  decline(siteTransferId: string | ApiTypes.SiteTransferData) {
    return this.rawDecline(Utils.toId(siteTransferId));
  }

  /**
   * Decline a site transfer request
   *
   * @throws {ApiError}
   * @throws {TimeoutError}
   */
  rawDecline(siteTransferId: string): Promise<void> {
    return this.client.request<void>({
      method: 'PUT',
      url: `/site-transfers/${siteTransferId}/decline`,
    });
  }
}
