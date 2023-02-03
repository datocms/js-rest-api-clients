import * as Utils from '@datocms/rest-client-utils';
import * as SchemaTypes from '../SchemaTypes';
import * as SimpleSchemaTypes from '../SimpleSchemaTypes';
import BaseResource from '../../BaseResource';

export default class SiteTransfer extends BaseResource {
  static readonly TYPE: 'site_transfer' = 'site_transfer';

  /**
   * List all pending transfer requests
   *
   * @throws {ApiError}
   * @throws {TimeoutError}
   */
  list() {
    return this.rawList().then((body) =>
      Utils.deserializeResponseBody<SimpleSchemaTypes.SiteTransferInstancesTargetSchema>(
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
  rawList(): Promise<SchemaTypes.SiteTransferInstancesTargetSchema> {
    return this.client.request<SchemaTypes.SiteTransferInstancesTargetSchema>({
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
  find(siteTransferId: string | SimpleSchemaTypes.SiteTransferData) {
    return this.rawFind(Utils.toId(siteTransferId)).then((body) =>
      Utils.deserializeResponseBody<SimpleSchemaTypes.SiteTransferSelfTargetSchema>(
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
  ): Promise<SchemaTypes.SiteTransferSelfTargetSchema> {
    return this.client.request<SchemaTypes.SiteTransferSelfTargetSchema>({
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
    siteId: string | SimpleSchemaTypes.SiteData,
    body: SimpleSchemaTypes.SiteTransferCreateSchema,
  ) {
    return this.rawCreate(
      Utils.toId(siteId),
      Utils.serializeRequestBody<SchemaTypes.SiteTransferCreateSchema>(body, {
        type: 'site_transfer',
        attributes: ['destination'],
        relationships: [],
      }),
    ).then((body) =>
      Utils.deserializeResponseBody<SimpleSchemaTypes.SiteTransferCreateTargetSchema>(
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
    body: SchemaTypes.SiteTransferCreateSchema,
  ): Promise<SchemaTypes.SiteTransferCreateTargetSchema> {
    return this.client.request<SchemaTypes.SiteTransferCreateTargetSchema>({
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
  destroy(siteId: string | SimpleSchemaTypes.SiteData) {
    return this.rawDestroy(Utils.toId(siteId)).then((body) =>
      Utils.deserializeResponseBody<SimpleSchemaTypes.SiteTransferDestroyTargetSchema>(
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
  ): Promise<SchemaTypes.SiteTransferDestroyTargetSchema> {
    return this.client.request<SchemaTypes.SiteTransferDestroyTargetSchema>({
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
    body: SchemaTypes.SiteTransferSimulateAcceptSchema,
  ): Promise<SchemaTypes.SiteTransferSimulateAcceptTargetSchema> {
    return this.client.request<SchemaTypes.SiteTransferSimulateAcceptTargetSchema>(
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
    body: SchemaTypes.SiteTransferAcceptSchema,
  ): Promise<SchemaTypes.SiteTransferAcceptTargetSchema> {
    return this.client.request<SchemaTypes.SiteTransferAcceptTargetSchema>({
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
  decline(siteTransferId: string | SimpleSchemaTypes.SiteTransferData) {
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
