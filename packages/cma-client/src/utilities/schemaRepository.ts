import { deserializeResponseBody } from '@datocms/rest-client-utils';
import type * as ApiTypes from '../generated/ApiTypes';
import type * as RawApiTypes from '../generated/RawApiTypes';

interface GenericClient {
  itemTypes: {
    rawList(): Promise<{ data: RawApiTypes.ItemType[] }>;
  };
  fields: {
    rawList(itemTypeId: string): Promise<{ data: RawApiTypes.Field[] }>;
    rawReferencing(itemTypeId: string): Promise<{ data: RawApiTypes.Field[] }>;
  };
  fieldsets: {
    rawList(itemTypeId: string): Promise<{ data: RawApiTypes.Fieldset[] }>;
  };
  plugins: {
    rawList(): Promise<{ data: RawApiTypes.Plugin[] }>;
  };
}

/**
 * Repository for DatoCMS schema entities including item types, fields, and plugins.
 * Provides caching and efficient lookup functionality for schema-related operations.
 *
 * ## Purpose
 *
 * SchemaRepository is designed to solve the performance problem of repeatedly fetching
 * the same schema information during complex operations that traverse nested blocks,
 * structured text, or modular content. It acts as an in-memory cache/memoization layer
 * for schema entities to avoid redundant API calls.
 *
 * ## What it's for:
 *
 * - **Caching schema entities**: Automatically caches item types, fields, fieldsets,
 *   and plugins after the first API request, returning cached results on subsequent calls
 * - **Complex traversal operations**: Essential when using utilities like
 *   `mapBlocksInFieldValues()` that need to repeatedly lookup block models and fields
 *   while traversing nested content structures
 * - **Bulk operations**: Ideal for scripts that process multiple records of different
 *   types and need efficient access to schema information
 * - **Read-heavy workflows**: Perfect for scenarios where you need to repeatedly access
 *   the same schema information without making redundant API calls
 *
 * ## What it's NOT for:
 *
 * - **Schema modification**: Do NOT use SchemaRepository if your script modifies models,
 *   fields, fieldsets, or plugins, as the cache will become stale
 * - **Record/content operations**: This is only for schema entities, not for records,
 *   uploads, or other content
 * - **Long-running applications**: The cache has no expiration or invalidation mechanism,
 *   so it's not suitable for applications that need fresh schema data over time
 * - **Concurrent schema changes**: No protection against cache inconsistency if other
 *   processes modify the schema while your script runs
 *
 * ## Usage Pattern
 *
 * ```typescript
 * const schemaRepository = new SchemaRepository(client);
 *
 * // These calls will hit the API and cache the results
 * const models = await schemaRepository.getAllModels();
 * const blogPost = await schemaRepository.getItemTypeByApiKey('blog_post');
 *
 * // These subsequent calls will return cached results (no API calls)
 * const sameModels = await schemaRepository.getAllModels();
 * const sameBlogPost = await schemaRepository.getItemTypeByApiKey('blog_post');
 *
 * // Pass the repository to utilities that need schema information
 * await mapBlocksInFieldValues(schemaRepository, record, (block) => {
 *   // The utility will use the cached schema data internally
 * });
 * ```
 *
 * ## Performance Benefits
 *
 * Without SchemaRepository, a script processing structured text with nested blocks
 * might make the same `client.itemTypes.list()` or `client.fields.list()` calls
 * dozens of times. SchemaRepository ensures each unique schema request is made only once.
 *
 * ## Best Practices
 *
 * - Use SchemaRepository consistently throughout your script — if you need it for one
 *   utility call, use it for all schema operations to maximize cache efficiency
 * - Create one instance per script execution, not per operation
 * - Only use when you have read-only access to schema entities
 * - Consider using optimistic locking for any record updates to handle potential
 *   version conflicts when working with cached schema information
 */
export class SchemaRepository {
  private client: GenericClient;
  private itemTypesPromise: Promise<RawApiTypes.ItemType[]> | null = null;
  private itemTypesByApiKey: Map<string, RawApiTypes.ItemType> = new Map();
  private itemTypesById: Map<string, RawApiTypes.ItemType> = new Map();
  private fieldsByItemType: Map<string, RawApiTypes.Field[]> = new Map();
  private fieldsetsByItemType: Map<string, RawApiTypes.Fieldset[]> = new Map();
  private pluginsPromise: Promise<RawApiTypes.Plugin[]> | null = null;
  private pluginsById: Map<string, RawApiTypes.Plugin> = new Map();
  private pluginsByPackageName: Map<string, RawApiTypes.Plugin> = new Map();

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
  private async loadItemTypes(): Promise<RawApiTypes.ItemType[]> {
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
  async getAllItemTypes(): Promise<ApiTypes.ItemType[]> {
    const rawResult = await this.getAllRawItemTypes();
    return deserializeResponseBody<ApiTypes.ItemType[]>({
      data: rawResult,
    });
  }

  /**
   * Gets all item types from the DatoCMS project.
   * @returns Promise that resolves to an array of all item types
   */
  async getAllRawItemTypes(): Promise<RawApiTypes.ItemType[]> {
    const itemTypes = await this.loadItemTypes();
    return itemTypes;
  }

  /**
   * Gets all item types that are models (not modular blocks).
   * @returns Promise that resolves to an array of model item types
   */
  async getAllModels(): Promise<ApiTypes.ItemType[]> {
    const rawResult = await this.getAllRawModels();
    return deserializeResponseBody<ApiTypes.ItemType[]>({
      data: rawResult,
    });
  }

  /**
   * Gets all item types that are models (not modular blocks).
   * @returns Promise that resolves to an array of model item types
   */
  async getAllRawModels(): Promise<RawApiTypes.ItemType[]> {
    const itemTypes = await this.loadItemTypes();
    return itemTypes.filter((it) => !it.attributes.modular_block);
  }

  /**
   * Gets all item types that are modular blocks.
   * @returns Promise that resolves to an array of block model item types
   */
  async getAllBlockModels(): Promise<ApiTypes.ItemType[]> {
    const rawResult = await this.getAllRawBlockModels();
    return deserializeResponseBody<ApiTypes.ItemType[]>({
      data: rawResult,
    });
  }

  /**
   * Gets all item types that are modular blocks.
   * @returns Promise that resolves to an array of block model item types
   */
  async getAllRawBlockModels(): Promise<RawApiTypes.ItemType[]> {
    const itemTypes = await this.loadItemTypes();
    return itemTypes.filter((it) => it.attributes.modular_block);
  }

  /**
   * Gets an item type by its API key.
   * @param apiKey - The API key of the item type to retrieve
   * @returns Promise that resolves to the item type
   * @throws Error if the item type is not found
   */
  async getItemTypeByApiKey(apiKey: string): Promise<ApiTypes.ItemType> {
    const rawResult = await this.getRawItemTypeByApiKey(apiKey);
    return deserializeResponseBody<ApiTypes.ItemType>({
      data: rawResult,
    });
  }

  /**
   * Gets an item type by its API key.
   * @param apiKey - The API key of the item type to retrieve
   * @returns Promise that resolves to the item type
   * @throws Error if the item type is not found
   */
  async getRawItemTypeByApiKey(apiKey: string): Promise<RawApiTypes.ItemType> {
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
  async getItemTypeById(id: string): Promise<ApiTypes.ItemType> {
    const rawResult = await this.getRawItemTypeById(id);
    return deserializeResponseBody<ApiTypes.ItemType>({
      data: rawResult,
    });
  }

  /**
   * Gets an item type by its ID.
   * @param id - The ID of the item type to retrieve
   * @returns Promise that resolves to the item type
   * @throws Error if the item type is not found
   */
  async getRawItemTypeById(id: string): Promise<RawApiTypes.ItemType> {
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
    itemType: ApiTypes.ItemType | RawApiTypes.ItemType,
  ): Promise<ApiTypes.Field[]> {
    const rawResult = await this.getRawItemTypeFields(
      itemType as RawApiTypes.ItemType,
    );
    return deserializeResponseBody<ApiTypes.Field[]>({
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
    itemType: RawApiTypes.ItemType,
  ): Promise<RawApiTypes.Field[]> {
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
    itemType: ApiTypes.ItemType | RawApiTypes.ItemType,
  ): Promise<ApiTypes.Fieldset[]> {
    const rawResult = await this.getRawItemTypeFieldsets(
      itemType as RawApiTypes.ItemType,
    );
    return deserializeResponseBody<ApiTypes.Fieldset[]>({
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
    itemType: RawApiTypes.ItemType,
  ): Promise<RawApiTypes.Fieldset[]> {
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
  private async loadPlugins(): Promise<RawApiTypes.Plugin[]> {
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
  async getAllPlugins(): Promise<ApiTypes.Plugin[]> {
    const rawResult = await this.getAllRawPlugins();
    return deserializeResponseBody<ApiTypes.Plugin[]>({
      data: rawResult,
    });
  }

  /**
   * Gets all plugins from the DatoCMS project.
   * @returns Promise that resolves to an array of all plugins
   */
  async getAllRawPlugins(): Promise<RawApiTypes.Plugin[]> {
    const plugins = await this.loadPlugins();
    return plugins;
  }

  /**
   * Gets a plugin by its ID.
   * @param id - The ID of the plugin to retrieve
   * @returns Promise that resolves to the plugin
   * @throws Error if the plugin is not found
   */
  async getPluginById(id: string): Promise<ApiTypes.Plugin> {
    const rawResult = await this.getRawPluginById(id);
    return deserializeResponseBody<ApiTypes.Plugin>({
      data: rawResult,
    });
  }

  /**
   * Gets a plugin by its ID.
   * @param id - The ID of the plugin to retrieve
   * @returns Promise that resolves to the plugin
   * @throws Error if the plugin is not found
   */
  async getRawPluginById(id: string): Promise<RawApiTypes.Plugin> {
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
  async getPluginByPackageName(packageName: string): Promise<ApiTypes.Plugin> {
    const rawResult = await this.getRawPluginByPackageName(packageName);
    return deserializeResponseBody<ApiTypes.Plugin>({
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
  ): Promise<RawApiTypes.Plugin> {
    await this.loadPlugins();

    const plugin = this.pluginsByPackageName.get(packageName);
    if (!plugin) {
      throw new Error(`Plugin with package name '${packageName}' not found`);
    }

    return plugin;
  }
}
