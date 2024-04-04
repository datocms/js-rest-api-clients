import * as Utils from '@datocms/rest-client-utils';
import BaseResource from '../../BaseResource';
import type * as SchemaTypes from '../SchemaTypes';
import type * as SimpleSchemaTypes from '../SimpleSchemaTypes';

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
  create(body: SimpleSchemaTypes.PluginCreateSchema) {
    return this.rawCreate(
      Utils.serializeRequestBody<SchemaTypes.PluginCreateSchema>(body, {
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
      Utils.deserializeResponseBody<SimpleSchemaTypes.PluginCreateTargetSchema>(
        body,
      ),
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
    body: SchemaTypes.PluginCreateSchema,
  ): Promise<SchemaTypes.PluginCreateTargetSchema> {
    return this.client.request<SchemaTypes.PluginCreateTargetSchema>({
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
    pluginId: string | SimpleSchemaTypes.PluginData,
    body: SimpleSchemaTypes.PluginUpdateSchema,
  ) {
    return this.rawUpdate(
      Utils.toId(pluginId),
      Utils.serializeRequestBody<SchemaTypes.PluginUpdateSchema>(body, {
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
      Utils.deserializeResponseBody<SimpleSchemaTypes.PluginUpdateTargetSchema>(
        body,
      ),
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
    body: SchemaTypes.PluginUpdateSchema,
  ): Promise<SchemaTypes.PluginUpdateTargetSchema> {
    return this.client.request<SchemaTypes.PluginUpdateTargetSchema>({
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
      Utils.deserializeResponseBody<SimpleSchemaTypes.PluginInstancesTargetSchema>(
        body,
      ),
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
  rawList(): Promise<SchemaTypes.PluginInstancesTargetSchema> {
    return this.client.request<SchemaTypes.PluginInstancesTargetSchema>({
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
  find(pluginId: string | SimpleSchemaTypes.PluginData) {
    return this.rawFind(Utils.toId(pluginId)).then((body) =>
      Utils.deserializeResponseBody<SimpleSchemaTypes.PluginSelfTargetSchema>(
        body,
      ),
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
  rawFind(pluginId: string): Promise<SchemaTypes.PluginSelfTargetSchema> {
    return this.client.request<SchemaTypes.PluginSelfTargetSchema>({
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
  destroy(pluginId: string | SimpleSchemaTypes.PluginData) {
    return this.rawDestroy(Utils.toId(pluginId)).then((body) =>
      Utils.deserializeResponseBody<SimpleSchemaTypes.PluginDestroyTargetSchema>(
        body,
      ),
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
  rawDestroy(pluginId: string): Promise<SchemaTypes.PluginDestroyTargetSchema> {
    return this.client.request<SchemaTypes.PluginDestroyTargetSchema>({
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
  fields(pluginId: string | SimpleSchemaTypes.PluginData) {
    return this.rawFields(Utils.toId(pluginId)).then((body) =>
      Utils.deserializeResponseBody<SimpleSchemaTypes.PluginFieldsTargetSchema>(
        body,
      ),
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
  rawFields(pluginId: string): Promise<SchemaTypes.PluginFieldsTargetSchema> {
    return this.client.request<SchemaTypes.PluginFieldsTargetSchema>({
      method: 'GET',
      url: `/plugins/${pluginId}/fields`,
    });
  }
}
