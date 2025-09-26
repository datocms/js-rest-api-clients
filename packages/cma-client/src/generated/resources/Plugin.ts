import * as Utils from '@datocms/rest-client-utils';
import BaseResource from '../../BaseResource';
import type * as ApiTypes from '../ApiTypes';
import type * as RawApiTypes from '../RawApiTypes';

export default class Plugin extends BaseResource {
  static readonly TYPE = 'plugin' as const;

  /**
   * Create a new plugin
   *
   * Read more: https://www.datocms.com/docs/content-management-api/resources/plugin/create
   *
   * @throws {ApiError}
   * @throws {TimeoutError}
   */
  create(body: ApiTypes.PluginCreateSchema) {
    return this.rawCreate(
      Utils.serializeRequestBody<RawApiTypes.PluginCreateSchema>(body, {
        type: 'plugin',
        attributes: [
          'package_name',
          'name',
          'description',
          'url',
          'permissions',
          'plugin_type',
          'field_types',
          'parameter_definitions',
          'package_version',
        ],
        relationships: [],
      }),
    ).then((body) =>
      Utils.deserializeResponseBody<ApiTypes.PluginCreateTargetSchema>(body),
    );
  }

  /**
   * Create a new plugin
   *
   * Read more: https://www.datocms.com/docs/content-management-api/resources/plugin/create
   *
   * @throws {ApiError}
   * @throws {TimeoutError}
   */
  rawCreate(
    body: RawApiTypes.PluginCreateSchema,
  ): Promise<RawApiTypes.PluginCreateTargetSchema> {
    return this.client.request<RawApiTypes.PluginCreateTargetSchema>({
      method: 'POST',
      url: '/plugins',
      body,
    });
  }

  /**
   * Update a plugin
   *
   * Read more: https://www.datocms.com/docs/content-management-api/resources/plugin/update
   *
   * @throws {ApiError}
   * @throws {TimeoutError}
   */
  update(
    pluginId: string | ApiTypes.PluginData,
    body: ApiTypes.PluginUpdateSchema,
  ) {
    return this.rawUpdate(
      Utils.toId(pluginId),
      Utils.serializeRequestBody<RawApiTypes.PluginUpdateSchema>(body, {
        id: Utils.toId(pluginId),
        type: 'plugin',
        attributes: [
          'name',
          'description',
          'url',
          'parameters',
          'package_version',
          'permissions',
        ],
        relationships: [],
      }),
    ).then((body) =>
      Utils.deserializeResponseBody<ApiTypes.PluginUpdateTargetSchema>(body),
    );
  }

  /**
   * Update a plugin
   *
   * Read more: https://www.datocms.com/docs/content-management-api/resources/plugin/update
   *
   * @throws {ApiError}
   * @throws {TimeoutError}
   */
  rawUpdate(
    pluginId: string,
    body: RawApiTypes.PluginUpdateSchema,
  ): Promise<RawApiTypes.PluginUpdateTargetSchema> {
    return this.client.request<RawApiTypes.PluginUpdateTargetSchema>({
      method: 'PUT',
      url: `/plugins/${pluginId}`,
      body,
    });
  }

  /**
   * List all plugins
   *
   * Read more: https://www.datocms.com/docs/content-management-api/resources/plugin/instances
   *
   * @throws {ApiError}
   * @throws {TimeoutError}
   */
  list() {
    return this.rawList().then((body) =>
      Utils.deserializeResponseBody<ApiTypes.PluginInstancesTargetSchema>(body),
    );
  }

  /**
   * List all plugins
   *
   * Read more: https://www.datocms.com/docs/content-management-api/resources/plugin/instances
   *
   * @throws {ApiError}
   * @throws {TimeoutError}
   */
  rawList(): Promise<RawApiTypes.PluginInstancesTargetSchema> {
    return this.client.request<RawApiTypes.PluginInstancesTargetSchema>({
      method: 'GET',
      url: '/plugins',
    });
  }

  /**
   * Retrieve a plugin
   *
   * Read more: https://www.datocms.com/docs/content-management-api/resources/plugin/self
   *
   * @throws {ApiError}
   * @throws {TimeoutError}
   */
  find(pluginId: string | ApiTypes.PluginData) {
    return this.rawFind(Utils.toId(pluginId)).then((body) =>
      Utils.deserializeResponseBody<ApiTypes.PluginSelfTargetSchema>(body),
    );
  }

  /**
   * Retrieve a plugin
   *
   * Read more: https://www.datocms.com/docs/content-management-api/resources/plugin/self
   *
   * @throws {ApiError}
   * @throws {TimeoutError}
   */
  rawFind(pluginId: string): Promise<RawApiTypes.PluginSelfTargetSchema> {
    return this.client.request<RawApiTypes.PluginSelfTargetSchema>({
      method: 'GET',
      url: `/plugins/${pluginId}`,
    });
  }

  /**
   * Delete a plugin
   *
   * Read more: https://www.datocms.com/docs/content-management-api/resources/plugin/destroy
   *
   * @throws {ApiError}
   * @throws {TimeoutError}
   */
  destroy(pluginId: string | ApiTypes.PluginData) {
    return this.rawDestroy(Utils.toId(pluginId)).then((body) =>
      Utils.deserializeResponseBody<ApiTypes.PluginDestroyTargetSchema>(body),
    );
  }

  /**
   * Delete a plugin
   *
   * Read more: https://www.datocms.com/docs/content-management-api/resources/plugin/destroy
   *
   * @throws {ApiError}
   * @throws {TimeoutError}
   */
  rawDestroy(pluginId: string): Promise<RawApiTypes.PluginDestroyTargetSchema> {
    return this.client.request<RawApiTypes.PluginDestroyTargetSchema>({
      method: 'DELETE',
      url: `/plugins/${pluginId}`,
    });
  }

  /**
   * Retrieve all fields using the plugin
   *
   * Read more: https://www.datocms.com/docs/content-management-api/resources/plugin/fields
   *
   * @throws {ApiError}
   * @throws {TimeoutError}
   */
  fields(pluginId: string | ApiTypes.PluginData) {
    return this.rawFields(Utils.toId(pluginId)).then((body) =>
      Utils.deserializeResponseBody<ApiTypes.PluginFieldsTargetSchema>(body),
    );
  }

  /**
   * Retrieve all fields using the plugin
   *
   * Read more: https://www.datocms.com/docs/content-management-api/resources/plugin/fields
   *
   * @throws {ApiError}
   * @throws {TimeoutError}
   */
  rawFields(pluginId: string): Promise<RawApiTypes.PluginFieldsTargetSchema> {
    return this.client.request<RawApiTypes.PluginFieldsTargetSchema>({
      method: 'GET',
      url: `/plugins/${pluginId}/fields`,
    });
  }
}
