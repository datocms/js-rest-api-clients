import { deserializeResponseBody } from '@datocms/rest-client-utils';
import type * as SchemaTypes from '../generated/SchemaTypes';
import type * as SimpleSchemaTypes from '../generated/SimpleSchemaTypes';

interface GenericClient {
  itemTypes: {
    rawList(): Promise<{ data: SchemaTypes.ItemType[] }>;
  };
  fields: {
    rawList(itemTypeId: string): Promise<{ data: SchemaTypes.Field[] }>;
  };
  fieldsets: {
    rawList(itemTypeId: string): Promise<{ data: SchemaTypes.Fieldset[] }>;
  };
  plugins: {
    rawList(): Promise<{ data: SchemaTypes.Plugin[] }>;
  };
}

/**
 * Repository for DatoCMS schema entities including item types, fields, and plugins.
 * Provides caching and efficient lookup functionality for schema-related operations.
 */
export class SchemaRepository {
  private client: GenericClient;
  private itemTypesPromise: Promise<SchemaTypes.ItemType[]> | null = null;
  private itemTypesByApiKey: Map<string, SchemaTypes.ItemType> = new Map();
  private itemTypesById: Map<string, SchemaTypes.ItemType> = new Map();
  private fieldsByItemType: Map<string, SchemaTypes.Field[]> = new Map();
  private fieldsetsByItemType: Map<string, SchemaTypes.Fieldset[]> = new Map();
  private pluginsPromise: Promise<SchemaTypes.Plugin[]> | null = null;
  private pluginsById: Map<string, SchemaTypes.Plugin> = new Map();
  private pluginsByPackageName: Map<string, SchemaTypes.Plugin> = new Map();

  /**
   * Creates a new SchemaRepository instance.
   * @param client - The DatoCMS client instance
   */
  constructor(client: GenericClient) {
    this.client = client;
  }

  /**
   * Loads and caches all item types from the DatoCMS API.
   * This method is called lazily and caches the result for subsequent calls.
   * @returns Promise that resolves to an array of item types
   */
  private async loadItemTypes(): Promise<SchemaTypes.ItemType[]> {
    if (!this.itemTypesPromise) {
      this.itemTypesPromise = (async () => {
        const { data: itemTypes } = await this.client.itemTypes.rawList();

        // Populate the lookup maps
        for (const itemType of itemTypes) {
          this.itemTypesByApiKey.set(itemType.attributes.api_key, itemType);
          this.itemTypesById.set(itemType.id, itemType);
        }

        return itemTypes;
      })();
    }

    return this.itemTypesPromise;
  }

  /**
   * Gets all item types from the DatoCMS project.
   * @returns Promise that resolves to an array of all item types
   */
  async getAllItemTypes(): Promise<SimpleSchemaTypes.ItemType[]> {
    const rawResult = await this.getAllRawItemTypes();
    return deserializeResponseBody<SimpleSchemaTypes.ItemType[]>({
      data: rawResult,
    });
  }

  /**
   * Gets all item types from the DatoCMS project.
   * @returns Promise that resolves to an array of all item types
   */
  async getAllRawItemTypes(): Promise<SchemaTypes.ItemType[]> {
    const itemTypes = await this.loadItemTypes();
    return itemTypes;
  }

  /**
   * Gets all item types that are models (not modular blocks).
   * @returns Promise that resolves to an array of model item types
   */
  async getAllModels(): Promise<SimpleSchemaTypes.ItemType[]> {
    const rawResult = await this.getAllRawModels();
    return deserializeResponseBody<SimpleSchemaTypes.ItemType[]>({
      data: rawResult,
    });
  }

  /**
   * Gets all item types that are models (not modular blocks).
   * @returns Promise that resolves to an array of model item types
   */
  async getAllRawModels(): Promise<SchemaTypes.ItemType[]> {
    const itemTypes = await this.loadItemTypes();
    return itemTypes.filter((it) => !it.attributes.modular_block);
  }

  /**
   * Gets all item types that are modular blocks.
   * @returns Promise that resolves to an array of block model item types
   */
  async getAllBlockModels(): Promise<SimpleSchemaTypes.ItemType[]> {
    const rawResult = await this.getAllRawBlockModels();
    return deserializeResponseBody<SimpleSchemaTypes.ItemType[]>({
      data: rawResult,
    });
  }

  /**
   * Gets all item types that are modular blocks.
   * @returns Promise that resolves to an array of block model item types
   */
  async getAllRawBlockModels(): Promise<SchemaTypes.ItemType[]> {
    const itemTypes = await this.loadItemTypes();
    return itemTypes.filter((it) => it.attributes.modular_block);
  }

  /**
   * Gets an item type by its API key.
   * @param apiKey - The API key of the item type to retrieve
   * @returns Promise that resolves to the item type
   * @throws Error if the item type is not found
   */
  async getItemTypeByApiKey(
    apiKey: string,
  ): Promise<SimpleSchemaTypes.ItemType> {
    const rawResult = await this.getRawItemTypeByApiKey(apiKey);
    return deserializeResponseBody<SimpleSchemaTypes.ItemType>({
      data: rawResult,
    });
  }

  /**
   * Gets an item type by its API key.
   * @param apiKey - The API key of the item type to retrieve
   * @returns Promise that resolves to the item type
   * @throws Error if the item type is not found
   */
  async getRawItemTypeByApiKey(apiKey: string): Promise<SchemaTypes.ItemType> {
    await this.loadItemTypes();

    const itemType = this.itemTypesByApiKey.get(apiKey);
    if (!itemType) {
      throw new Error(`Item type with API key '${apiKey}' not found`);
    }

    return itemType;
  }

  /**
   * Gets an item type by its ID.
   * @param id - The ID of the item type to retrieve
   * @returns Promise that resolves to the item type
   * @throws Error if the item type is not found
   */
  async getItemTypeById(id: string): Promise<SimpleSchemaTypes.ItemType> {
    const rawResult = await this.getRawItemTypeById(id);
    return deserializeResponseBody<SimpleSchemaTypes.ItemType>({
      data: rawResult,
    });
  }

  /**
   * Gets an item type by its ID.
   * @param id - The ID of the item type to retrieve
   * @returns Promise that resolves to the item type
   * @throws Error if the item type is not found
   */
  async getRawItemTypeById(id: string): Promise<SchemaTypes.ItemType> {
    await this.loadItemTypes();

    const itemType = this.itemTypesById.get(id);
    if (!itemType) {
      throw new Error(`Item type with ID '${id}' not found`);
    }

    return itemType;
  }

  /**
   * Gets all fields for a given item type.
   * Fields are cached after the first request for performance.
   * @param itemType - The item type to get fields for
   * @returns Promise that resolves to an array of fields
   */
  async getItemTypeFields(
    itemType: SimpleSchemaTypes.ItemType | SchemaTypes.ItemType,
  ): Promise<SimpleSchemaTypes.Field[]> {
    const rawResult = await this.getRawItemTypeFields(
      itemType as SchemaTypes.ItemType,
    );
    return deserializeResponseBody<SimpleSchemaTypes.Field[]>({
      data: rawResult,
    });
  }

  /**
   * Gets all fields for a given item type.
   * Fields are cached after the first request for performance.
   * @param itemType - The item type to get fields for
   * @returns Promise that resolves to an array of fields
   */
  async getRawItemTypeFields(
    itemType: SchemaTypes.ItemType,
  ): Promise<SchemaTypes.Field[]> {
    // Check if we already have the fields cached
    const cachedFields = this.fieldsByItemType.get(itemType.id);
    if (cachedFields) {
      return cachedFields;
    }

    // Fetch and cache the fields
    const { data: fields } = await this.client.fields.rawList(itemType.id);
    this.fieldsByItemType.set(itemType.id, fields);

    return fields;
  }

  /**
   * Gets all fieldsets for a given item type.
   * Fieldsets are cached after the first request for performance.
   * @param itemType - The item type to get fieldsets for
   * @returns Promise that resolves to an array of fieldsets
   */
  async getItemTypeFieldsets(
    itemType: SimpleSchemaTypes.ItemType | SchemaTypes.ItemType,
  ): Promise<SimpleSchemaTypes.Fieldset[]> {
    const rawResult = await this.getRawItemTypeFieldsets(
      itemType as SchemaTypes.ItemType,
    );
    return deserializeResponseBody<SimpleSchemaTypes.Fieldset[]>({
      data: rawResult,
    });
  }

  /**
   * Gets all fieldsets for a given item type.
   * Fieldsets are cached after the first request for performance.
   * @param itemType - The item type to get fieldsets for
   * @returns Promise that resolves to an array of fieldsets
   */
  async getRawItemTypeFieldsets(
    itemType: SchemaTypes.ItemType,
  ): Promise<SchemaTypes.Fieldset[]> {
    // Check if we already have the fieldsets cached
    const cachedFieldsets = this.fieldsetsByItemType.get(itemType.id);
    if (cachedFieldsets) {
      return cachedFieldsets;
    }

    // Fetch and cache the fieldsets
    const { data: fieldsets } = await this.client.fieldsets.rawList(
      itemType.id,
    );
    this.fieldsetsByItemType.set(itemType.id, fieldsets);

    return fieldsets;
  }

  /**
   * Loads and caches all plugins from the DatoCMS API.
   * This method is called lazily and caches the result for subsequent calls.
   * @returns Promise that resolves to an array of plugins
   */
  private async loadPlugins(): Promise<SchemaTypes.Plugin[]> {
    if (!this.pluginsPromise) {
      this.pluginsPromise = (async () => {
        const { data: plugins } = await this.client.plugins.rawList();

        // Populate the lookup maps
        for (const plugin of plugins) {
          this.pluginsById.set(plugin.id, plugin);
          if (plugin.attributes.package_name) {
            this.pluginsByPackageName.set(
              plugin.attributes.package_name,
              plugin,
            );
          }
        }

        return plugins;
      })();
    }

    return this.pluginsPromise;
  }

  /**
   * Gets all plugins from the DatoCMS project.
   * @returns Promise that resolves to an array of all plugins
   */
  async getAllPlugins(): Promise<SimpleSchemaTypes.Plugin[]> {
    const rawResult = await this.getAllRawPlugins();
    return deserializeResponseBody<SimpleSchemaTypes.Plugin[]>({
      data: rawResult,
    });
  }

  /**
   * Gets all plugins from the DatoCMS project.
   * @returns Promise that resolves to an array of all plugins
   */
  async getAllRawPlugins(): Promise<SchemaTypes.Plugin[]> {
    const plugins = await this.loadPlugins();
    return plugins;
  }

  /**
   * Gets a plugin by its ID.
   * @param id - The ID of the plugin to retrieve
   * @returns Promise that resolves to the plugin
   * @throws Error if the plugin is not found
   */
  async getPluginById(id: string): Promise<SimpleSchemaTypes.Plugin> {
    const rawResult = await this.getRawPluginById(id);
    return deserializeResponseBody<SimpleSchemaTypes.Plugin>({
      data: rawResult,
    });
  }

  /**
   * Gets a plugin by its ID.
   * @param id - The ID of the plugin to retrieve
   * @returns Promise that resolves to the plugin
   * @throws Error if the plugin is not found
   */
  async getRawPluginById(id: string): Promise<SchemaTypes.Plugin> {
    await this.loadPlugins();

    const plugin = this.pluginsById.get(id);
    if (!plugin) {
      throw new Error(`Plugin with ID '${id}' not found`);
    }

    return plugin;
  }

  /**
   * Gets a plugin by its package name.
   * @param packageName - The package name of the plugin to retrieve
   * @returns Promise that resolves to the plugin
   * @throws Error if the plugin is not found
   */
  async getPluginByPackageName(
    packageName: string,
  ): Promise<SimpleSchemaTypes.Plugin> {
    const rawResult = await this.getRawPluginByPackageName(packageName);
    return deserializeResponseBody<SimpleSchemaTypes.Plugin>({
      data: rawResult,
    });
  }

  /**
   * Gets a plugin by its package name.
   * @param packageName - The package name of the plugin to retrieve
   * @returns Promise that resolves to the plugin
   * @throws Error if the plugin is not found
   */
  async getRawPluginByPackageName(
    packageName: string,
  ): Promise<SchemaTypes.Plugin> {
    await this.loadPlugins();

    const plugin = this.pluginsByPackageName.get(packageName);
    if (!plugin) {
      throw new Error(`Plugin with package name '${packageName}' not found`);
    }

    return plugin;
  }
}
