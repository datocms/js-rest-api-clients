import BaseResource from '../BaseResource';
import serializeRequestBody from '../../serializeRequestBody';
import deserializeResponseBody from '../../deserializeResponseBody';
import toId from '../../toId';
import * as SchemaTypes from '../SchemaTypes';
import * as SimpleSchemaTypes from '../SimpleSchemaTypes';

export default class SiteTransfer extends BaseResource {
  static readonly TYPE: 'site_transfer' = 'site_transfer';

  /**
   * List all pending transfer requests
   */
  list() {
    return this.rawList().then((body) =>
      deserializeResponseBody<SimpleSchemaTypes.SiteTransferInstancesTargetSchema>(
        body,
      ),
    );
  }

  /**
   * List all pending transfer requests
   */
  rawList(): Promise<SchemaTypes.SiteTransferInstancesTargetSchema> {
    return this.client.request<SchemaTypes.SiteTransferInstancesTargetSchema>({
      method: 'GET',
      url: `/site-transfers`,
    });
  }

  /**
   * Retrieve a transfer
   */
  find(siteTransferId: string | SimpleSchemaTypes.SiteTransferData) {
    return this.rawFind(toId(siteTransferId)).then((body) =>
      deserializeResponseBody<SimpleSchemaTypes.SiteTransferSelfTargetSchema>(
        body,
      ),
    );
  }

  /**
   * Retrieve a transfer
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
   */
  create(
    siteId: string | SimpleSchemaTypes.SiteTransferData,
    body: SimpleSchemaTypes.SiteTransferCreateSchema,
  ) {
    return this.rawCreate(
      toId(siteId),
      serializeRequestBody<SchemaTypes.SiteTransferCreateSchema>({
        body,
        type: SiteTransfer.TYPE,
      }),
    ).then((body) =>
      deserializeResponseBody<SimpleSchemaTypes.SiteTransferCreateTargetSchema>(
        body,
      ),
    );
  }

  /**
   * Create a new site transfer request
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
   */
  destroy(siteId: string | SimpleSchemaTypes.SiteTransferData) {
    return this.rawDestroy(toId(siteId)).then((body) =>
      deserializeResponseBody<SimpleSchemaTypes.SiteTransferDestroyTargetSchema>(
        body,
      ),
    );
  }

  /**
   * Destroy a site transfer request
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
   */
  simulateAccept(
    siteTransferId: string | SimpleSchemaTypes.SiteTransferData,
    body: SimpleSchemaTypes.SiteTransferSimulateAcceptSchema,
  ) {
    return this.rawSimulateAccept(
      toId(siteTransferId),
      serializeRequestBody<SchemaTypes.SiteTransferSimulateAcceptSchema>({
        body,
        id: toId(siteTransferId),
        type: SiteTransfer.TYPE,
      }),
    ).then((body) =>
      deserializeResponseBody<SimpleSchemaTypes.SiteTransferSimulateAcceptTargetSchema>(
        body,
      ),
    );
  }

  /**
   * Simulate accept
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
   */
  accept(
    siteTransferId: string | SimpleSchemaTypes.SiteTransferData,
    body: SimpleSchemaTypes.SiteTransferAcceptSchema,
  ) {
    return this.rawAccept(
      toId(siteTransferId),
      serializeRequestBody<SchemaTypes.SiteTransferAcceptSchema>({
        body,
        id: toId(siteTransferId),
        type: SiteTransfer.TYPE,
      }),
    ).then((body) =>
      deserializeResponseBody<SimpleSchemaTypes.SiteTransferAcceptTargetSchema>(
        body,
      ),
    );
  }

  /**
   * Accept a site transfer request
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
   */
  decline(siteTransferId: string | SimpleSchemaTypes.SiteTransferData) {
    return this.rawDecline(toId(siteTransferId));
  }

  /**
   * Decline a site transfer request
   */
  rawDecline(siteTransferId: string): Promise<void> {
    return this.client.request<void>({
      method: 'PUT',
      url: `/site-transfers/${siteTransferId}/decline`,
    });
  }
}
