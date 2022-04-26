import * as Utils from '@datocms/rest-client-utils';
import * as SchemaTypes from '../SchemaTypes';
import * as SimpleSchemaTypes from '../SimpleSchemaTypes';
import BaseResource from '../../BaseResource';

export default class Plugin extends BaseResource {
  static readonly TYPE: 'plugin' = 'plugin';

  /**
   * Create a new plugin
   *
   * Read more: https://www.datocms.com/docs/content-management-api/resources/plugin/create
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
   */
  rawCreate(
    body: SchemaTypes.PluginCreateSchema,
  ): Promise<SchemaTypes.PluginCreateTargetSchema> {
    return this.client.request<SchemaTypes.PluginCreateTargetSchema>({
      method: 'POST',
      url: `/plugins`,
      body,
    });
  }

  /**
   * Update a plugin
   *
   * Read more: https://www.datocms.com/docs/content-management-api/resources/plugin/update
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
   */
  rawList(): Promise<SchemaTypes.PluginInstancesTargetSchema> {
    return this.client.request<SchemaTypes.PluginInstancesTargetSchema>({
      method: 'GET',
      url: `/plugins`,
    });
  }

  /**
   * Retrieve a plugins
   *
   * Read more: https://www.datocms.com/docs/content-management-api/resources/plugin/self
   */
  find(pluginId: string | SimpleSchemaTypes.PluginData) {
    return this.rawFind(Utils.toId(pluginId)).then((body) =>
      Utils.deserializeResponseBody<SimpleSchemaTypes.PluginSelfTargetSchema>(
        body,
      ),
    );
  }

  /**
   * Retrieve a plugins
   *
   * Read more: https://www.datocms.com/docs/content-management-api/resources/plugin/self
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
   */
  rawFields(pluginId: string): Promise<SchemaTypes.PluginFieldsTargetSchema> {
    return this.client.request<SchemaTypes.PluginFieldsTargetSchema>({
      method: 'GET',
      url: `/plugins/${pluginId}/fields`,
    });
  }
}
