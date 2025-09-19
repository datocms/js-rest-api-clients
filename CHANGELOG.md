# Changelog

All notable changes to this project will be documented in this file.

## [5.1.5] - 2025-09-15

- **Complete Field Type System**: Full TypeScript definitions for all 20 DatoCMS field types. Every field type now offers:
  - A type representing the field value (e.g., `StringFieldValue`)
  - A type for API requests (e.g., `StringFieldValueAsRequest`)
  - Type guards for runtime validation (e.g., `isStringFieldValue()`, `isLocalizedStringFieldValue()`)
  - Validators configuration (e.g., `StringFieldValidators`)
  - Appearance configuration (e.g., `StringFieldAppearance`)
  - **Complex content fields** (`structured_text`, `rich_text`, `single_block`) additionally offer variants of field value for:
    - Regular API responses with blocks as IDs: `StructuredTextFieldValue`, `isStructuredTextFieldValue()`
    - Nested Mode API responses with blocks as full objects: `StructuredTextFieldValueWithNestedBlocks`, `isStructuredTextFieldValueWithNestedBlocks()`
    - API Requests supporting either IDs or full objects: `StructuredTextFieldValueAsRequest`, `isStructuredTextFieldValueAsRequest()`

- **Advanced Block Processing**: Unified API for working with blocks across field types with 28 core functions:
  - **Duplicate Block**: `duplicateBlockRecord()`
  - **Visit Operations**: `visitBlocksInFieldValues()` + async variant
  - **Transform Operations**: `mapBlocksInFieldValues()` + async variant
  - **Search Operations**: `findAllBlocksInFieldValues()` + async variant
  - **Filter Operations**: `filterBlocksInFieldValues()` + async variant
  - **Reduce Operations**: `reduceBlocksInFieldValues()` + async variant
  - **Test Operations**: `someBlocksInFieldValues()`, `everyBlockInFieldValues()` + async variants

- **Localization-Aware Field Value Utilities**: Unified interface for working with field values that may or may not be localized. DatoCMS fields can contain either direct values (`"Hello"`) or localized objects (`{ "en": "Hello", "it": "Ciao" }`). These utilities eliminate the need for manual localization checks and provide consistent operations regardless of localization status:
  - **Type Operations**: `isLocalized()`, `LocalizedFieldValue<T>` type
  - **Transform Operations**: `fieldValueToEntries()`, `entriesToFieldValue()`, `mapFieldValue()` + async variant
  - **Filter Operations**: `filterFieldValue()` + async variant
  - **Test Operations**: `someFieldValue()`, `everyFieldValue()`, `visitFieldValue()` + async variants

- **`SchemaRepository` class**: In-memory caching system for DatoCMS schema entities that solves performance problems during complex operations. When traversing nested blocks or structured text, scripts often repeatedly fetch the same schema information. SchemaRepository caches item types, fields, fieldsets, and plugins after the first API request, eliminating redundant calls and dramatically improving performance for bulk operations and read-heavy workflows:
  - **Item Type Operations**: `getAllItemTypes()`, `getAllModels()`, `getAllBlockModels()`, `getItemTypeByApiKey()`, `getItemTypeById()`, `getItemTypeFields()`, `getItemTypeFieldsets()`
  - **Plugin Operations**: `getAllPlugins()`, `getPluginById()`, `getPluginByPackageName()`
  - **Reference Analysis**: `modelIdsReferencedInField()`, `blockModelIdsReferencedInField()`
  - All functions available in both regular and raw variants

- **ItemTypeDefinition System**: Enhanced type safety for item operations. Methods like `client.items.create()`, `client.items.find()`, etc. are now fully typed when you provide an `ItemTypeDefinition`. The system is aware of the `nested` parameter and returns appropriately typed responses. Item type definitions can be written manually or automatically generated from your actual DatoCMS project schema using the `datocms schema:generate` CLI command:

  ```typescript
  // Define your content model structure
  type EnvironmentSettings = { locales: 'en' };

  type BlogPostDefinition = ItemTypeDefinition<
    EnvironmentSettings,
    'ID_OF_MODEL',
    {
      title: { fieldType: 'string'; };
      content: { fieldType: 'structured_text'; };
      slug: { fieldType: 'slug'; };
    }
  >;

  // Create items with full type safety
  const blogPost = await client.items.create<BlogPostDefinition>({
    type: 'item',
    attributes: {
      title: 'Hello World',        // TypeScript knows this is a string
      content: { /* DAST */ },     // TypeScript knows this is structured text
      slug: 'hello-world',         // TypeScript knows this is a string
    },
    relationships: { /* ... */ }
  });

  // Find items with nested blocks
  const withNested = await client.items.find<BlogPostDefinition>('id', { nested: true });
  // Return type automatically includes nested block data based on nested: true

  // TypeScript enforces correct field types
  const title = blogPost.attributes.title;  // ✅ Correctly typed as string
  ```

### Changed
- **BREAKING**: Renamed core type exports for clarity (old names still work):
  - `SchemaTypes` → `RawApiTypes`
  - `SimpleSchemaTypes` → `ApiTypes`
- **Type Safety**: `ApiTypes.Field`, `ApiTypes.FieldUpdateSchema` and `ApiTypes.FieldCreateSchema` are correctly typed based on the specific field type and localization

### Migration Guide

#### Breaking Changes
1. **Type imports**: Update to new names or continue using legacy aliases:
   ```typescript
   // Recommended new approach
   import type { RawApiTypes, ApiTypes } from '@datocms/cma-client';

   // Legacy names still work
   import type { SchemaTypes, SimpleSchemaTypes } from '@datocms/cma-client';
   ```

2. **ID utilities**: Now exported from main package:
   ```typescript
   // Old
   import { generateId } from '@datocms/cma-client/idUtils';

   // New
   import { generateId } from '@datocms/cma-client';
   ```