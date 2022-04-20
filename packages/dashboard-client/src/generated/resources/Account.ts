import * as Utils from '@datocms/rest-client-utils';
import * as SchemaTypes from '../SchemaTypes';
import * as SimpleSchemaTypes from '../SimpleSchemaTypes';
import BaseResource from '../../BaseResource';

export default class Account extends BaseResource {
  static readonly TYPE: 'account' = 'account';

  /**
   * Create a new account
   */
  create(body: SimpleSchemaTypes.AccountCreateSchema) {
    return this.rawCreate(
      Utils.serializeRequestBody<SchemaTypes.AccountCreateSchema>(body, {
        type: Account.TYPE,
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
   */
  update(body: SimpleSchemaTypes.AccountUpdateSchema) {
    return this.rawUpdate(
      Utils.serializeRequestBody<SchemaTypes.AccountUpdateSchema>(body, {
        type: Account.TYPE,
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
   */
  destroy(body: SimpleSchemaTypes.AccountDestroySchema) {
    return this.rawDestroy(
      Utils.serializeRequestBody<SchemaTypes.AccountDestroySchema>(body, {
        type: Account.TYPE,
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
   */
  find() {
    return this.rawFind().then((body) =>
      Utils.deserializeResponseBody<SimpleSchemaTypes.AccountSelfTargetSchema>(
        body,
      ),
    );
  }

  /**
   * Retrieve a account
   */
  rawFind(): Promise<SchemaTypes.AccountSelfTargetSchema> {
    return this.client.request<SchemaTypes.AccountSelfTargetSchema>({
      method: 'GET',
      url: `/account`,
    });
  }

  /**
   * Request a password reset
   */
  resetPassword(body: SimpleSchemaTypes.AccountResetPasswordSchema) {
    return this.rawResetPassword(
      Utils.serializeRequestBody<SchemaTypes.AccountResetPasswordSchema>(body, {
        type: Account.TYPE,
        attributes: ['email'],
        relationships: [],
      }),
    );
  }

  /**
   * Request a password reset
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
   */
  activate_2Fa(body: SimpleSchemaTypes.AccountActivate_2FaSchema) {
    return this.rawActivate_2Fa(
      Utils.serializeRequestBody<SchemaTypes.AccountActivate_2FaSchema>(body, {
        type: Account.TYPE,
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
   */
  rawReset_2Fa(): Promise<SchemaTypes.AccountReset_2FaTargetSchema> {
    return this.client.request<SchemaTypes.AccountReset_2FaTargetSchema>({
      method: 'PUT',
      url: `/account/reset-2fa`,
    });
  }

  /**
   * De-activates 2-factor authorization
   */
  deactivate_2Fa(body: SimpleSchemaTypes.AccountDeactivate_2FaSchema) {
    return this.rawDeactivate_2Fa(
      Utils.serializeRequestBody<SchemaTypes.AccountDeactivate_2FaSchema>(
        body,
        {
          type: Account.TYPE,
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
