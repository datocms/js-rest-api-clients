import * as Utils from '@datocms/rest-client-utils';
import BaseResource from '../../BaseResource';
import type * as ApiTypes from '../ApiTypes';
import type * as RawApiTypes from '../RawApiTypes';

export default class Account extends BaseResource {
  static readonly TYPE = 'account' as const;

  /**
   * Create a new account
   *
   * @throws {ApiError}
   * @throws {TimeoutError}
   */
  create(body: ApiTypes.AccountCreateSchema) {
    return this.rawCreate(
      Utils.serializeRequestBody<RawApiTypes.AccountCreateSchema>(body, {
        type: 'account',
        attributes: [
          'email',
          'first_name',
          'last_name',
          'company',
          'password',
          'signup_to_newsletter',
          'role_description',
          'role_context',
          'acquisition_method',
          'latest_acquisition_method',
        ],
        relationships: [],
      }),
    ).then((body) =>
      Utils.deserializeResponseBody<ApiTypes.AccountCreateTargetSchema>(body),
    );
  }

  /**
   * Create a new account
   *
   * @throws {ApiError}
   * @throws {TimeoutError}
   */
  rawCreate(
    body: RawApiTypes.AccountCreateSchema,
  ): Promise<RawApiTypes.AccountCreateTargetSchema> {
    return this.client.request<RawApiTypes.AccountCreateTargetSchema>({
      method: 'POST',
      url: '/account',
      body,
    });
  }

  /**
   * Update a account
   *
   * @throws {ApiError}
   * @throws {TimeoutError}
   */
  update(body: ApiTypes.AccountUpdateSchema) {
    return this.rawUpdate(
      Utils.serializeRequestBody<RawApiTypes.AccountUpdateSchema>(body, {
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
        relationships: ['default_organization'],
      }),
    ).then((body) =>
      Utils.deserializeResponseBody<ApiTypes.AccountUpdateTargetSchema>(body),
    );
  }

  /**
   * Update a account
   *
   * @throws {ApiError}
   * @throws {TimeoutError}
   */
  rawUpdate(
    body: RawApiTypes.AccountUpdateSchema,
  ): Promise<RawApiTypes.AccountUpdateTargetSchema> {
    return this.client.request<RawApiTypes.AccountUpdateTargetSchema>({
      method: 'PUT',
      url: '/account',
      body,
    });
  }

  /**
   * Delete a account
   *
   * @throws {ApiError}
   * @throws {TimeoutError}
   */
  destroy(body: ApiTypes.AccountDestroySchema) {
    return this.rawDestroy(
      Utils.serializeRequestBody<RawApiTypes.AccountDestroySchema>(body, {
        type: 'account_destroy_request',
        attributes: ['otp_code', 'password'],
        relationships: [],
      }),
    ).then((body) =>
      Utils.deserializeResponseBody<ApiTypes.AccountDestroyJobSchema>(body),
    );
  }

  /**
   * Delete a account
   *
   * @throws {ApiError}
   * @throws {TimeoutError}
   */
  rawDestroy(
    body: RawApiTypes.AccountDestroySchema,
  ): Promise<RawApiTypes.AccountDestroyJobSchema> {
    return this.client.request<RawApiTypes.AccountDestroyJobSchema>({
      method: 'POST',
      url: '/account/destroy',
      body,
    });
  }

  /**
   * Retrieve a account
   *
   * @throws {ApiError}
   * @throws {TimeoutError}
   */
  find(queryParams?: ApiTypes.AccountSelfHrefSchema) {
    return this.rawFind(queryParams).then((body) =>
      Utils.deserializeResponseBody<ApiTypes.AccountSelfTargetSchema>(body),
    );
  }

  /**
   * Retrieve a account
   *
   * @throws {ApiError}
   * @throws {TimeoutError}
   */
  rawFind(
    queryParams?: RawApiTypes.AccountSelfHrefSchema,
  ): Promise<RawApiTypes.AccountSelfTargetSchema> {
    return this.client.request<RawApiTypes.AccountSelfTargetSchema>({
      method: 'GET',
      url: '/account',
      queryParams,
    });
  }

  /**
   * Request a password reset
   *
   * @throws {ApiError}
   * @throws {TimeoutError}
   */
  resetPassword(body: ApiTypes.AccountResetPasswordSchema) {
    return this.rawResetPassword(
      Utils.serializeRequestBody<RawApiTypes.AccountResetPasswordSchema>(body, {
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
    body: RawApiTypes.AccountResetPasswordSchema,
  ): Promise<void> {
    return this.client.request<void>({
      method: 'POST',
      url: '/account/reset_password',
      body,
    });
  }

  /**
   * Activates 2-factor authorization
   *
   * @throws {ApiError}
   * @throws {TimeoutError}
   */
  activate_2Fa(body: ApiTypes.AccountActivate_2FaSchema) {
    return this.rawActivate_2Fa(
      Utils.serializeRequestBody<RawApiTypes.AccountActivate_2FaSchema>(body, {
        type: '2fa_activation',
        attributes: ['otp_code', 'password'],
        relationships: [],
      }),
    ).then((body) =>
      Utils.deserializeResponseBody<ApiTypes.AccountActivate_2FaTargetSchema>(
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
    body: RawApiTypes.AccountActivate_2FaSchema,
  ): Promise<RawApiTypes.AccountActivate_2FaTargetSchema> {
    return this.client.request<RawApiTypes.AccountActivate_2FaTargetSchema>({
      method: 'PUT',
      url: '/account/activate-2fa',
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
      Utils.deserializeResponseBody<ApiTypes.AccountReset_2FaTargetSchema>(
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
  rawReset_2Fa(): Promise<RawApiTypes.AccountReset_2FaTargetSchema> {
    return this.client.request<RawApiTypes.AccountReset_2FaTargetSchema>({
      method: 'PUT',
      url: '/account/reset-2fa',
    });
  }

  /**
   * De-activates 2-factor authorization
   *
   * @throws {ApiError}
   * @throws {TimeoutError}
   */
  deactivate_2Fa(body: ApiTypes.AccountDeactivate_2FaSchema) {
    return this.rawDeactivate_2Fa(
      Utils.serializeRequestBody<RawApiTypes.AccountDeactivate_2FaSchema>(
        body,
        {
          type: '2fa_deactivation',
          attributes: ['otp_code', 'password'],
          relationships: [],
        },
      ),
    ).then((body) =>
      Utils.deserializeResponseBody<ApiTypes.AccountDeactivate_2FaTargetSchema>(
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
    body: RawApiTypes.AccountDeactivate_2FaSchema,
  ): Promise<RawApiTypes.AccountDeactivate_2FaTargetSchema> {
    return this.client.request<RawApiTypes.AccountDeactivate_2FaTargetSchema>({
      method: 'PUT',
      url: '/account/deactivate-2fa',
      body,
    });
  }

  /**
   * Convert to organization
   *
   * @throws {ApiError}
   * @throws {TimeoutError}
   */
  convertToOrganization(body: ApiTypes.AccountConvertToOrganizationSchema) {
    return this.rawConvertToOrganization(
      Utils.serializeRequestBody<RawApiTypes.AccountConvertToOrganizationSchema>(
        body,
        {
          type: 'organization',
          attributes: ['name'],
          relationships: [],
        },
      ),
    ).then((body) =>
      Utils.deserializeResponseBody<ApiTypes.AccountConvertToOrganizationJobSchema>(
        body,
      ),
    );
  }

  /**
   * Convert to organization
   *
   * @throws {ApiError}
   * @throws {TimeoutError}
   */
  rawConvertToOrganization(
    body: RawApiTypes.AccountConvertToOrganizationSchema,
  ): Promise<RawApiTypes.AccountConvertToOrganizationJobSchema> {
    return this.client.request<RawApiTypes.AccountConvertToOrganizationJobSchema>(
      {
        method: 'POST',
        url: '/account/convert-to-organization',
        body,
      },
    );
  }

  /**
   * Confirm email change
   *
   * @throws {ApiError}
   * @throws {TimeoutError}
   */
  confirmEmailChange(body: ApiTypes.AccountConfirmEmailChangeSchema) {
    return this.rawConfirmEmailChange(
      Utils.serializeRequestBody<RawApiTypes.AccountConfirmEmailChangeSchema>(
        body,
        {
          type: 'account',
          attributes: ['token'],
          relationships: [],
        },
      ),
    ).then((body) =>
      Utils.deserializeResponseBody<ApiTypes.AccountConfirmEmailChangeTargetSchema>(
        body,
      ),
    );
  }

  /**
   * Confirm email change
   *
   * @throws {ApiError}
   * @throws {TimeoutError}
   */
  rawConfirmEmailChange(
    body: RawApiTypes.AccountConfirmEmailChangeSchema,
  ): Promise<RawApiTypes.AccountConfirmEmailChangeTargetSchema> {
    return this.client.request<RawApiTypes.AccountConfirmEmailChangeTargetSchema>(
      {
        method: 'POST',
        url: '/account/confirm-email-change',
        body,
      },
    );
  }
}
