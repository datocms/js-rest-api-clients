import * as Utils from '@datocms/rest-client-utils';
import * as SchemaTypes from '../SchemaTypes';
import * as SimpleSchemaTypes from '../SimpleSchemaTypes';
import BaseResource from '../../BaseResource';

export default class Account extends BaseResource {
  static readonly TYPE: 'account' = 'account';

  /**
   * Create a new account
   *
   * @throws {ApiError}
   * @throws {TimeoutError}
   */
  create(body: SimpleSchemaTypes.AccountCreateSchema) {
    return this.rawCreate(
      Utils.serializeRequestBody<SchemaTypes.AccountCreateSchema>(body, {
        type: 'account',
        attributes: [
          'email',
          'first_name',
          'last_name',
          'company',
          'password',
          'acquisition_method',
        ],
        relationships: [],
      }),
    ).then((body) =>
      Utils.deserializeResponseBody<SimpleSchemaTypes.AccountCreateTargetSchema>(
        body,
      ),
    );
  }

  /**
   * Create a new account
   *
   * @throws {ApiError}
   * @throws {TimeoutError}
   */
  rawCreate(
    body: SchemaTypes.AccountCreateSchema,
  ): Promise<SchemaTypes.AccountCreateTargetSchema> {
    return this.client.request<SchemaTypes.AccountCreateTargetSchema>({
      method: 'POST',
      url: `/account`,
      body,
    });
  }

  /**
   * Update a account
   *
   * @throws {ApiError}
   * @throws {TimeoutError}
   */
  update(body: SimpleSchemaTypes.AccountUpdateSchema) {
    return this.rawUpdate(
      Utils.serializeRequestBody<SchemaTypes.AccountUpdateSchema>(body, {
        type: 'account',
        attributes: [
          'email',
          'first_name',
          'last_name',
          'company',
          'password',
          'current_password',
          'otp_code',
        ],
        relationships: [],
      }),
    ).then((body) =>
      Utils.deserializeResponseBody<SimpleSchemaTypes.AccountUpdateTargetSchema>(
        body,
      ),
    );
  }

  /**
   * Update a account
   *
   * @throws {ApiError}
   * @throws {TimeoutError}
   */
  rawUpdate(
    body: SchemaTypes.AccountUpdateSchema,
  ): Promise<SchemaTypes.AccountUpdateTargetSchema> {
    return this.client.request<SchemaTypes.AccountUpdateTargetSchema>({
      method: 'PUT',
      url: `/account`,
      body,
    });
  }

  /**
   * Delete a account
   *
   * @throws {ApiError}
   * @throws {TimeoutError}
   */
  destroy(body: SimpleSchemaTypes.AccountDestroySchema) {
    return this.rawDestroy(
      Utils.serializeRequestBody<SchemaTypes.AccountDestroySchema>(body, {
        type: 'account_destroy_request',
        attributes: ['otp_code', 'password'],
        relationships: [],
      }),
    ).then((body) =>
      Utils.deserializeResponseBody<SimpleSchemaTypes.AccountDestroyJobSchema>(
        body,
      ),
    );
  }

  /**
   * Delete a account
   *
   * @throws {ApiError}
   * @throws {TimeoutError}
   */
  rawDestroy(
    body: SchemaTypes.AccountDestroySchema,
  ): Promise<SchemaTypes.AccountDestroyJobSchema> {
    return this.client.request<SchemaTypes.AccountDestroyJobSchema>({
      method: 'POST',
      url: `/account/destroy`,
      body,
    });
  }

  /**
   * Retrieve a account
   *
   * @throws {ApiError}
   * @throws {TimeoutError}
   */
  find(queryParams?: SimpleSchemaTypes.AccountSelfHrefSchema) {
    return this.rawFind(queryParams).then((body) =>
      Utils.deserializeResponseBody<SimpleSchemaTypes.AccountSelfTargetSchema>(
        body,
      ),
    );
  }

  /**
   * Retrieve a account
   *
   * @throws {ApiError}
   * @throws {TimeoutError}
   */
  rawFind(
    queryParams?: SchemaTypes.AccountSelfHrefSchema,
  ): Promise<SchemaTypes.AccountSelfTargetSchema> {
    return this.client.request<SchemaTypes.AccountSelfTargetSchema>({
      method: 'GET',
      url: `/account`,
      queryParams,
    });
  }

  /**
   * Request a password reset
   *
   * @throws {ApiError}
   * @throws {TimeoutError}
   */
  resetPassword(body: SimpleSchemaTypes.AccountResetPasswordSchema) {
    return this.rawResetPassword(
      Utils.serializeRequestBody<SchemaTypes.AccountResetPasswordSchema>(body, {
        type: 'account',
        attributes: ['email'],
        relationships: [],
      }),
    );
  }

  /**
   * Request a password reset
   *
   * @throws {ApiError}
   * @throws {TimeoutError}
   */
  rawResetPassword(
    body: SchemaTypes.AccountResetPasswordSchema,
  ): Promise<void> {
    return this.client.request<void>({
      method: 'POST',
      url: `/account/reset_password`,
      body,
    });
  }

  /**
   * Activates 2-factor authorization
   *
   * @throws {ApiError}
   * @throws {TimeoutError}
   */
  activate_2Fa(body: SimpleSchemaTypes.AccountActivate_2FaSchema) {
    return this.rawActivate_2Fa(
      Utils.serializeRequestBody<SchemaTypes.AccountActivate_2FaSchema>(body, {
        type: '2fa_activation',
        attributes: ['otp_code', 'password'],
        relationships: [],
      }),
    ).then((body) =>
      Utils.deserializeResponseBody<SimpleSchemaTypes.AccountActivate_2FaTargetSchema>(
        body,
      ),
    );
  }

  /**
   * Activates 2-factor authorization
   *
   * @throws {ApiError}
   * @throws {TimeoutError}
   */
  rawActivate_2Fa(
    body: SchemaTypes.AccountActivate_2FaSchema,
  ): Promise<SchemaTypes.AccountActivate_2FaTargetSchema> {
    return this.client.request<SchemaTypes.AccountActivate_2FaTargetSchema>({
      method: 'PUT',
      url: `/account/activate-2fa`,
      body,
    });
  }

  /**
   * Generates 2-factor authorization secrets
   *
   * @throws {ApiError}
   * @throws {TimeoutError}
   */
  reset_2Fa() {
    return this.rawReset_2Fa().then((body) =>
      Utils.deserializeResponseBody<SimpleSchemaTypes.AccountReset_2FaTargetSchema>(
        body,
      ),
    );
  }

  /**
   * Generates 2-factor authorization secrets
   *
   * @throws {ApiError}
   * @throws {TimeoutError}
   */
  rawReset_2Fa(): Promise<SchemaTypes.AccountReset_2FaTargetSchema> {
    return this.client.request<SchemaTypes.AccountReset_2FaTargetSchema>({
      method: 'PUT',
      url: `/account/reset-2fa`,
    });
  }

  /**
   * De-activates 2-factor authorization
   *
   * @throws {ApiError}
   * @throws {TimeoutError}
   */
  deactivate_2Fa(body: SimpleSchemaTypes.AccountDeactivate_2FaSchema) {
    return this.rawDeactivate_2Fa(
      Utils.serializeRequestBody<SchemaTypes.AccountDeactivate_2FaSchema>(
        body,
        {
          type: '2fa_deactivation',
          attributes: ['otp_code', 'password'],
          relationships: [],
        },
      ),
    ).then((body) =>
      Utils.deserializeResponseBody<SimpleSchemaTypes.AccountDeactivate_2FaTargetSchema>(
        body,
      ),
    );
  }

  /**
   * De-activates 2-factor authorization
   *
   * @throws {ApiError}
   * @throws {TimeoutError}
   */
  rawDeactivate_2Fa(
    body: SchemaTypes.AccountDeactivate_2FaSchema,
  ): Promise<SchemaTypes.AccountDeactivate_2FaTargetSchema> {
    return this.client.request<SchemaTypes.AccountDeactivate_2FaTargetSchema>({
      method: 'PUT',
      url: `/account/deactivate-2fa`,
      body,
    });
  }
}
