import BaseResource from '../BaseResource';
import serializeRequestBody from '../../serializeRequestBody';
import deserializeResponseBody from '../../deserializeResponseBody';
import toId from '../../toId';
import * as SchemaTypes from '../SchemaTypes';
import * as SimpleSchemaTypes from '../SimpleSchemaTypes';

export default class Plugin extends BaseResource {
  static readonly TYPE: 'plugin' = 'plugin';

  /**
   * Create a new plugin
   *
   * Read more: https://www.datocms.com/docs/content-management-api/resources/plugin/create
   */
  create(body: SimpleSchemaTypes.PluginCreateSchema) {
    return this.rawCreate(
      serializeRequestBody<SchemaTypes.PluginCreateSchema>({
        body,
        type: Plugin.TYPE,
      }),
    ).then((body) =>
      deserializeResponseBody<SimpleSchemaTypes.PluginCreateTargetSchema>(body),
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
      toId(pluginId),
      serializeRequestBody<SchemaTypes.PluginUpdateSchema>({
        body,
        id: toId(pluginId),
        type: Plugin.TYPE,
      }),
    ).then((body) =>
      deserializeResponseBody<SimpleSchemaTypes.PluginUpdateTargetSchema>(body),
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
      deserializeResponseBody<SimpleSchemaTypes.PluginInstancesTargetSchema>(
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
    return this.rawFind(toId(pluginId)).then((body) =>
      deserializeResponseBody<SimpleSchemaTypes.PluginSelfTargetSchema>(body),
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
    return this.rawDestroy(toId(pluginId)).then((body) =>
      deserializeResponseBody<SimpleSchemaTypes.PluginDestroyTargetSchema>(
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
    return this.rawFields(toId(pluginId)).then((body) =>
      deserializeResponseBody<SimpleSchemaTypes.PluginFieldsTargetSchema>(body),
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
