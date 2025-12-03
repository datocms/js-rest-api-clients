import { deserializeResponseBody } from '@datocms/rest-client-utils';
import type * as ApiTypes from '../generated/ApiTypes';
import type * as RawApiTypes from '../generated/RawApiTypes';
import {
  blockModelIdsReferencedInField,
  modelIdsReferencedInField,
} from './fieldsContainingReferences';

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
  site: {
    rawFind(params: { include: string }): Promise<{
      data: any;
      included?: Array<RawApiTypes.ItemType | RawApiTypes.Field | any>;
    }>;
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
 *   `mapBlocksInNonLocalizedFieldValue()` that need to repeatedly lookup block models and fields
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
 * await mapBlocksInNonLocalizedFieldValue(schemaRepository, record, (block) => {
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
  private prefetchPromise: Promise<void> | null = null;

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
    const rawResult = await this.getRawItemTypeFields(itemType);
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
    itemType: ApiTypes.ItemType | RawApiTypes.ItemType,
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
    const rawResult = await this.getRawItemTypeFieldsets(itemType);
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
    itemType: ApiTypes.ItemType | RawApiTypes.ItemType,
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

  /**
   * Prefetches all models and their fields in a single optimized API call.
   * This method populates the internal caches for both item types and fields,
   * making subsequent lookups very fast without additional API calls.
   *
   * This is more efficient than lazy loading when you know you'll need access
   * to multiple models and fields, as it reduces the number of API requests
   * from potentially dozens down to just one.
   *
   * @returns Promise that resolves when all data has been fetched and cached
   */
  async prefetchAllModelsAndFields(): Promise<void> {
    if (this.prefetchPromise) {
      return this.prefetchPromise;
    }

    const prefetch = async () => {
      const { included } = await this.client.site.rawFind({
        include: 'item_types,item_types.fields',
      });

      if (!included) {
        return;
      }

      const allItemTypes = included.filter(
        (item): item is RawApiTypes.ItemType => item.type === 'item_type',
      );
      const allFields = included.filter(
        (item): item is RawApiTypes.Field => item.type === 'field',
      );

      // Populate item types caches
      this.itemTypesPromise = Promise.resolve(allItemTypes);
      for (const itemType of allItemTypes) {
        this.itemTypesByApiKey.set(itemType.attributes.api_key, itemType);
        this.itemTypesById.set(itemType.id, itemType);
      }

      // Group fields by item type and populate fields cache
      const fieldsByItemTypeId = new Map<string, RawApiTypes.Field[]>();
      for (const field of allFields) {
        const itemTypeId = field.relationships.item_type.data.id;
        if (!fieldsByItemTypeId.has(itemTypeId)) {
          fieldsByItemTypeId.set(itemTypeId, []);
        }
        fieldsByItemTypeId.get(itemTypeId)!.push(field);
      }

      // Populate the fields cache
      for (const [itemTypeId, fields] of fieldsByItemTypeId) {
        this.fieldsByItemType.set(itemTypeId, fields);
      }
    };

    this.prefetchPromise = prefetch();

    return this.prefetchPromise;
  }

  /**
   * Gets all models that directly or indirectly embed the given block models.
   * This method recursively traverses the schema to find all models that reference
   * the provided blocks, either directly through block fields or indirectly through
   * other block models that reference them.
   *
   * @param blocks - Array of block models to find references to
   * @returns Promise that resolves to array of models that embed these blocks
   */
  async getRawModelsEmbeddingBlocks(
    blocks: Array<ApiTypes.ItemType | RawApiTypes.ItemType>,
  ): Promise<Array<RawApiTypes.ItemType>> {
    await this.prefetchAllModelsAndFields();

    const allItemTypes = await this.getAllRawItemTypes();
    const blockIds = new Set(blocks.map((block) => block.id));
    const embeddingModels: Array<RawApiTypes.ItemType> = [];

    // Helper function to check if a model points to any of the target blocks
    const modelPointsToBlocks = async (
      itemType: RawApiTypes.ItemType,
      alreadyExplored: Set<string> = new Set(),
    ): Promise<boolean> => {
      if (alreadyExplored.has(itemType.id)) {
        return false;
      }

      alreadyExplored.add(itemType.id);

      const fields = await this.getRawItemTypeFields(itemType);

      for (const field of fields) {
        const referencedBlockIds = blockModelIdsReferencedInField(field);

        // Check if this field directly references any of our target blocks
        if (referencedBlockIds.some((id) => blockIds.has(id))) {
          return true;
        }

        // Check if this field references other block models that might transitively reference our targets
        const referencedBlocks = referencedBlockIds.map(
          (id) => allItemTypes.find((it) => it.id === id)!,
        );

        for (const linkedBlock of referencedBlocks) {
          if (
            await modelPointsToBlocks(linkedBlock, new Set(alreadyExplored))
          ) {
            return true;
          }
        }
      }

      return false;
    };

    // Check each model to see if it embeds any of the target blocks
    for (const itemType of allItemTypes) {
      if (await modelPointsToBlocks(itemType)) {
        embeddingModels.push(itemType);
      }
    }

    return embeddingModels;
  }

  /**
   * Gets all models that directly or indirectly embed the given block models.
   * This method recursively traverses the schema to find all models that reference
   * the provided blocks, either directly through block fields or indirectly through
   * other block models that reference them.
   *
   * @param blocks - Array of block models to find references to
   * @returns Promise that resolves to array of models that embed these blocks
   */
  async getModelsEmbeddingBlocks(
    blocks: Array<ApiTypes.ItemType | RawApiTypes.ItemType>,
  ): Promise<Array<ApiTypes.ItemType>> {
    const rawResult = await this.getRawModelsEmbeddingBlocks(blocks);
    return deserializeResponseBody<ApiTypes.ItemType[]>({
      data: rawResult,
    });
  }

  /**
   * Gets all block models that are directly or indirectly nested within the given item types.
   * This method recursively traverses the schema to find all blocks that are nested
   * within the provided item types, either directly through block fields or indirectly through
   * other nested block models.
   *
   * @param itemTypes - Array of item types to find nested blocks for
   * @returns Promise that resolves to array of all block models nested in these item types
   */
  async getRawNestedBlocks(
    itemTypes: Array<ApiTypes.ItemType | RawApiTypes.ItemType>,
  ): Promise<Array<RawApiTypes.ItemType>> {
    await this.prefetchAllModelsAndFields();

    const allItemTypes = await this.getAllRawItemTypes();
    const visited = new Set<string>();
    const nestedBlocks: Array<RawApiTypes.ItemType> = [];

    // Helper function to recursively find nested blocks
    const findNestedBlocks = async (
      itemType: ApiTypes.ItemType | RawApiTypes.ItemType,
      alreadyExplored: Set<string> = new Set(),
    ): Promise<void> => {
      if (alreadyExplored.has(itemType.id)) {
        return;
      }

      alreadyExplored.add(itemType.id);

      const fields = await this.getRawItemTypeFields(itemType);

      for (const field of fields) {
        const referencedBlockIds = blockModelIdsReferencedInField(field);

        for (const blockId of referencedBlockIds) {
          if (!visited.has(blockId)) {
            visited.add(blockId);
            const nestedBlock = allItemTypes.find((it) => it.id === blockId);
            if (nestedBlock) {
              nestedBlocks.push(nestedBlock);
              // Recursively find blocks nested in this block
              await findNestedBlocks(nestedBlock, new Set(alreadyExplored));
            }
          }
        }
      }
    };

    // Find nested blocks for each provided item type
    for (const itemType of itemTypes) {
      await findNestedBlocks(itemType);
    }

    return nestedBlocks;
  }

  /**
   * Gets all block models that are directly or indirectly nested within the given item types.
   * This method recursively traverses the schema to find all blocks that are nested
   * within the provided item types, either directly through block fields or indirectly through
   * other nested block models.
   *
   * @param itemTypes - Array of item types to find nested blocks for
   * @returns Promise that resolves to array of all block models nested in these item types
   */
  async getNestedBlocks(
    itemTypes: Array<ApiTypes.ItemType | RawApiTypes.ItemType>,
  ): Promise<Array<ApiTypes.ItemType>> {
    const rawResult = await this.getRawNestedBlocks(itemTypes);
    return deserializeResponseBody<ApiTypes.ItemType[]>({
      data: rawResult,
    });
  }

  /**
   * Gets all models that are directly or indirectly nested/referenced within the given item types.
   * This method recursively traverses the schema to find all models that are referenced
   * by the provided item types through link fields, either directly or indirectly through
   * other referenced blocks.
   *
   * @param itemTypes - Array of item types to find nested models for
   * @returns Promise that resolves to array of all models nested in these item types
   */
  async getRawNestedModels(
    itemTypes: Array<ApiTypes.ItemType | RawApiTypes.ItemType>,
  ): Promise<Array<RawApiTypes.ItemType>> {
    await this.prefetchAllModelsAndFields();

    const allItemTypes = await this.getAllRawItemTypes();
    const visited = new Set<string>();
    const nestedModels: Array<RawApiTypes.ItemType> = [];

    // Helper function to recursively find nested models
    const findNestedModels = async (
      itemType: ApiTypes.ItemType | RawApiTypes.ItemType,
      alreadyExplored: Set<string> = new Set(),
    ): Promise<void> => {
      if (alreadyExplored.has(itemType.id)) {
        return;
      }

      alreadyExplored.add(itemType.id);

      const fields = await this.getRawItemTypeFields(itemType);

      for (const field of fields) {
        // Find models directly referenced via link fields
        const referencedModelIds = modelIdsReferencedInField(field);

        for (const modelId of referencedModelIds) {
          if (!visited.has(modelId)) {
            visited.add(modelId);
            const nestedModel = allItemTypes.find((it) => it.id === modelId);
            if (nestedModel) {
              nestedModels.push(nestedModel);
              // Do NOT recurse into models, only into blocks
            }
          }
        }

        // Find blocks referenced via block fields, then recursively find models in those blocks
        const referencedBlockIds = blockModelIdsReferencedInField(field);

        for (const blockId of referencedBlockIds) {
          const nestedBlock = allItemTypes.find((it) => it.id === blockId);
          if (nestedBlock) {
            // Recursively find models nested in this block
            await findNestedModels(nestedBlock, new Set(alreadyExplored));
          }
        }
      }
    };

    // Find nested models for each provided item type
    for (const itemType of itemTypes) {
      await findNestedModels(itemType);
    }

    return nestedModels;
  }

  /**
   * Gets all models that are directly or indirectly nested/referenced within the given item types.
   * This method recursively traverses the schema to find all models that are referenced
   * by the provided item types through link fields, either directly or indirectly through
   * other referenced blocks.
   *
   * @param itemTypes - Array of item types to find nested models for
   * @returns Promise that resolves to array of all models nested in these item types
   */
  async getNestedModels(
    itemTypes: Array<ApiTypes.ItemType | RawApiTypes.ItemType>,
  ): Promise<Array<ApiTypes.ItemType>> {
    const rawResult = await this.getRawNestedModels(itemTypes);
    return deserializeResponseBody<ApiTypes.ItemType[]>({
      data: rawResult,
    });
  }
}
