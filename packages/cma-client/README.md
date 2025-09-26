[![Node.js CI](https://github.com/datocms/js-rest-api-clients/actions/workflows/node.js.yml/badge.svg)](https://github.com/datocms/js-rest-api-clients/actions/workflows/node.js.yml)

# DatoCMS Content Management JS API Client (Common)

API client for [DatoCMS](https://www.datocms.com). Take a look at the full [API documentation](https://www.datocms.com/docs/content-management-api) for examples.

<br /><br />
<a href="https://www.datocms.com/">
<img src="https://www.datocms.com/images/full_logo.svg" height="60">
</a>
<br /><br />

## Utility Functions

This library provides a comprehensive set of utility functions to work with DatoCMS records, blocks, and field values. These utilities make it easier to manipulate, traverse, and inspect your content programmatically.

### 1. Record/block inspection

The `inspectItem()` function provides a visual, tree-structured representation of DatoCMS records in the console, making it easier to debug and understand complex content structures.

<details>
<summary><strong>inspectItem()</strong> - Display records with visual appeal</summary>

Formats a DatoCMS item (record or block) as a visual tree structure, showing all fields with proper formatting for each field type. Particularly useful for debugging nested structures like modular content and structured text.

**TypeScript Signature:**
```typescript
function inspectItem(
  item: Item,
  options?: InspectItemOptions
): string

type InspectItemOptions = {
  maxWidth?: number; // Maximum width for text fields before truncation (default: 80)
}
```

**Parameters:**
- `item`: Any DatoCMS item, including records, blocks, or items in create/update format
- `options`: Optional configuration object
  - `maxWidth`: Maximum characters to display for text fields before truncating with "..."

**Returns:** A formatted string representation of the item as a tree structure

**Usage Example:**
```typescript
import { inspectItem } from '@datocms/cma-client';

const record = await client.items.find('MgCNaAI0RxSG8CA9sDXCHg');
console.log(inspectItem(record));

// Output:
// Item "MgCNaAI0RxSG8CA9sDXCHg" (item_type: "bJse85JFR0GbA37ey6kA1w")
// ├─ title: "My Blog Post"
// ├─ slug: "my-blog-post"
// └─ content:
//    ├─ en: "This is the English content..."
//    └─ it: "Questo è il contenuto italiano..."
```
</details>

### 2. Block processing utilities

These utilities provide a unified interface for working with blocks embedded within DatoCMS field values. DatoCMS supports three field types that can contain blocks: Modular Content (arrays of blocks), Single Block fields, and Structured Text (rich-text with embedded blocks). These functions abstract away the differences between field types, providing consistent APIs for common operations.

#### Recursive Block Operations

These functions traverse blocks recursively, processing nested blocks within blocks. They require a `SchemaRepository` instance to look up field definitions for nested blocks.

<details>
<summary><strong>visitBlocksInNonLocalizedFieldValue()</strong> - Recursively visit all blocks</summary>

Visit every block in a non-localized field value recursively, including blocks nested within other blocks.

**TypeScript Signature:**
```typescript
async function visitBlocksInNonLocalizedFieldValue(
  nonLocalizedFieldValue: unknown,
  fieldType: string,
  schemaRepository: SchemaRepository,
  visitor: (item: BlockInRequest, path: TreePath) => void | Promise<void>,
): Promise<void>
```

**Parameters:**
- `nonLocalizedFieldValue`: The non-localized field value
- `fieldType`: The typeo of DatoCMS field (ie. `string`, `rich_text`, etc.)
- `schemaRepository`: Repository for caching schema lookups
- `visitor`: Function called for each block (including nested)
</details>

<details>
<summary><strong>mapBlocksInNonLocalizedFieldValue()</strong> - Recursively transform all blocks</summary>

Transform all blocks in a non-localized field value recursively, including nested blocks.

**TypeScript Signature:**
```typescript
async function mapBlocksInNonLocalizedFieldValue(
  nonLocalizedFieldValue: unknown,
  fieldType: string,
  schemaRepository: SchemaRepository,
  mapper: (item: BlockInRequest, path: TreePath) => BlockInRequest | Promise<BlockInRequest>,
): Promise<unknown>
```

**Parameters:**
- `nonLocalizedFieldValue`: The non-localized field value
- `fieldType`: The typeo of DatoCMS field (ie. `string`, `rich_text`, etc.)
- `schemaRepository`: Repository for caching schema lookups
- `mapper`: Function that transforms each block

**Returns:** New field value
</details>

<details>
<summary><strong>filterBlocksInNonLocalizedFieldValue()</strong> - Recursively filter blocks</summary>

Filter blocks recursively, removing blocks at any nesting level that don't match the predicate.

**TypeScript Signature:**
```typescript
async function filterBlocksInNonLocalizedFieldValue(
  nonLocalizedFieldValue: unknown,
  fieldType: string,
  schemaRepository: SchemaRepository,
  predicate: (item: BlockInRequest, path: TreePath) => boolean | Promise<boolean>,
): Promise<unknown>
```

**Parameters:**
- `nonLocalizedFieldValue`: The non-localized field value to filter
- `fieldType`: The typeo of DatoCMS field (ie. `string`, `rich_text`, etc.)
- `schemaRepository`: Repository for caching schema lookups
- `predicate`: Function that tests each block

**Returns:** New field value with filtered blocks

**Usage Example:**
```typescript
// Remove all video blocks at any nesting level
const noVideos = await filterBlocksInNonLocalizedFieldValue(
  schemaRepository,
  field,
  fieldValue,
  (block) => block.relationships.item_type.data.id !== 'video_block'
);
```
</details>

<details>
<summary><strong>findAllBlocksInNonLocalizedFieldValue()</strong> - Recursively search for blocks</summary>

Find all blocks that match the predicate, searching recursively through nested blocks.

**TypeScript Signature:**
```typescript
async function findAllBlocksInNonLocalizedFieldValue(
  nonLocalizedFieldValue: unknown,
  fieldType: string,
  schemaRepository: SchemaRepository,
  predicate: (item: BlockInRequest, path: TreePath) => boolean | Promise<boolean>,
): Promise<Array<{ item: BlockInRequest; path: TreePath }>>
```

**Parameters:**
- `nonLocalizedFieldValue`: The non-localized field value to search
- `fieldType`: The typeo of DatoCMS field (ie. `string`, `rich_text`, etc.)
- `schemaRepository`: Repository for caching schema lookups
- `predicate`: Function that tests each block

**Returns:** Array of all matching blocks with their paths
</details>

<details>
<summary><strong>reduceBlocksInNonLocalizedFieldValue()</strong> - Recursively reduce blocks</summary>

Reduce all blocks recursively to a single value.

**TypeScript Signature:**
```typescript
async function reduceBlocksInNonLocalizedFieldValue<R>(
  nonLocalizedFieldValue: unknown,
  fieldType: string,
  schemaRepository: SchemaRepository,
  reducer: (accumulator: R, item: BlockInRequest, path: TreePath) => R | Promise<R>,
  initialValue: R,
): Promise<R>
```

**Parameters:**
- `nonLocalizedFieldValue`: The non-localized field value to reduce
- `fieldType`: The typeo of DatoCMS field (ie. `string`, `rich_text`, etc.)
- `schemaRepository`: Repository for caching schema lookups
- `reducer`: Function that processes each block
- `initialValue`: Initial accumulator value

**Returns:** The final accumulated value
</details>

<details>
<summary><strong>someBlocksInNonLocalizedFieldValue()</strong> - Recursively test for any match</summary>

Check if any block (including nested) matches the predicate.

**TypeScript Signature:**
```typescript
async function someBlocksInNonLocalizedFieldValue(
  nonLocalizedFieldValue: unknown,
  fieldType: string,
  schemaRepository: SchemaRepository,
  predicate: (item: BlockInRequest, path: TreePath) => boolean | Promise<boolean>,
): Promise<boolean>
```

**Parameters:**
- `nonLocalizedFieldValue`: The non-localized field value to test
- `fieldType`: The typeo of DatoCMS field (ie. `string`, `rich_text`, etc.)
- `schemaRepository`: Repository for caching schema lookups
- `predicate`: Function that tests each block

**Returns:** True if any block matches
</details>

<details>
<summary><strong>everyBlockInNonLocalizedFieldValue()</strong> - Recursively test if all match</summary>

Check if every block (including nested) matches the predicate.

**TypeScript Signature:**
```typescript
async function everyBlockInNonLocalizedFieldValue(
  nonLocalizedFieldValue: unknown,
  fieldType: string,
  schemaRepository: SchemaRepository,
  predicate: (item: BlockInRequest, path: TreePath) => boolean | Promise<boolean>,
): Promise<boolean>
```

**Parameters:**
- `nonLocalizedFieldValue`: The non-localized field value to test
- `fieldType`: The typeo of DatoCMS field (ie. `string`, `rich_text`, etc.)
- `schemaRepository`: Repository for caching schema lookups
- `predicate`: Function that tests each block

**Returns:** True if all blocks match
</details>

#### Block Record Management

<details>
<summary><strong>buildBlockRecord()</strong> - Create block records from data</summary>

Converts a block data object into the proper format for API requests.

**TypeScript Signature:**
```typescript
function buildBlockRecord<D extends ItemTypeDefinition>(
  body: ItemUpdateSchema<ToItemDefinitionInRequest<D>>
): NewBlockInRequest<ToItemDefinitionInRequest<D>>
```

**Parameters:**
- `body`: Block data in update schema format

**Returns:** Formatted block record ready for API requests
</details>

<details>
<summary><strong>duplicateBlockRecord()</strong> - Deep clone blocks with nested content</summary>

Creates a deep copy of a block record, including all nested blocks, removing IDs to create new instances.

**TypeScript Signature:**
```typescript
async function duplicateBlockRecord<D extends ItemTypeDefinition>(
  existingBlock: ItemWithOptionalIdAndMeta<ToItemDefinitionInNestedResponse<D>>,
  schemaRepository: SchemaRepository
): Promise<NewBlockInRequest<ToItemDefinitionInRequest<D>>>
```

**Parameters:**
- `existingBlock`: The block to duplicate
- `schemaRepository`: Repository for schema lookups

**Returns:** New block record without IDs, ready to be created
</details>

### 3. Localization-Aware Field Utilities

These utilities provide a unified interface for working with DatoCMS field values that may or may not be localized. They eliminate the need for conditional logic when processing fields that could be either localized or non-localized.

<details>
<summary><strong>mapNormalizedFieldValues() / mapNormalizedFieldValuesAsync()</strong> - Transform field values</summary>

Apply a transformation function to field values, handling both localized and non-localized fields uniformly.

**TypeScript Signatures:**
```typescript
function mapNormalizedFieldValues<TInput, TOutput>(
  field: Field,
  value: TInput | LocalizedFieldValue<TInput>,
  mapFn: (locale: string | undefined, localeValue: TInput) => TOutput
): TOutput | LocalizedFieldValue<TOutput>

async function mapNormalizedFieldValuesAsync<TInput, TOutput>(
  field: Field,
  value: TInput | LocalizedFieldValue<TInput>,
  mapFn: (locale: string | undefined, localeValue: TInput) => Promise<TOutput>
): Promise<TOutput | LocalizedFieldValue<TOutput>>
```

**Parameters:**
- `fieldType`: The typeo of DatoCMS field (ie. `string`, `rich_text`, etc.)
- `nonLocalizedFieldValue`: The non-localized field value (localized or non-localized)
- `mapFn`: Function to transform each value (receives locale for localized fields, undefined for non-localized)

**Returns:** Transformed value maintaining the same structure
</details>

<details>
<summary><strong>filterNormalizedFieldValues() / filterNormalizedFieldValuesAsync()</strong> - Filter field values</summary>

Filter field values based on a predicate, handling both localized and non-localized fields.

**TypeScript Signatures:**
```typescript
function filterNormalizedFieldValues<T>(
  field: Field,
  value: T | LocalizedFieldValue<T>,
  filterFn: (locale: string | undefined, localeValue: T) => boolean
): T | LocalizedFieldValue<T> | undefined

async function filterNormalizedFieldValuesAsync<T>(
  field: Field,
  value: T | LocalizedFieldValue<T>,
  filterFn: (locale: string | undefined, localeValue: T) => Promise<boolean>
): Promise<T | LocalizedFieldValue<T> | undefined>
```

**Parameters:**
- `fieldType`: The typeo of DatoCMS field (ie. `string`, `rich_text`, etc.)
- `nonLocalizedFieldValue`: The non-localized field value to filter
- `filterFn`: Predicate function for filtering

**Returns:** Filtered value or undefined if all filtered out
</details>

<details>
<summary><strong>visitNormalizedFieldValues() / visitNormalizedFieldValuesAsync()</strong> - Iterate over field values</summary>

Visit each value in a field, handling both localized and non-localized fields.

**TypeScript Signatures:**
```typescript
function visitNormalizedFieldValues<T>(
  field: Field,
  value: T | LocalizedFieldValue<T>,
  visitFn: (locale: string | undefined, localeValue: T) => void
): void

async function visitNormalizedFieldValuesAsync<T>(
  field: Field,
  value: T | LocalizedFieldValue<T>,
  visitFn: (locale: string | undefined, localeValue: T) => Promise<void>
): Promise<void>
```

**Parameters:**
- `fieldType`: The typeo of DatoCMS field (ie. `string`, `rich_text`, etc.)
- `nonLocalizedFieldValue`: The non-localized field value to visit
- `visitFn`: Function called for each value
</details>

<details>
<summary><strong>someNormalizedFieldValues() / someNormalizedFieldValuesAsync()</strong> - Test if any value matches</summary>

Check if at least one field value passes the test.

**TypeScript Signatures:**
```typescript
function someNormalizedFieldValues<T>(
  field: Field,
  value: T | LocalizedFieldValue<T>,
  testFn: (locale: string | undefined, localeValue: T) => boolean
): boolean

async function someNormalizedFieldValuesAsync<T>(
  field: Field,
  value: T | LocalizedFieldValue<T>,
  testFn: (locale: string | undefined, localeValue: T) => Promise<boolean>
): Promise<boolean>
```

**Parameters:**
- `fieldType`: The typeo of DatoCMS field (ie. `string`, `rich_text`, etc.)
- `nonLocalizedFieldValue`: The non-localized field value to test
- `testFn`: Predicate function

**Returns:** True if any value passes the test
</details>

<details>
<summary><strong>everyNormalizedFieldValue() / everyNormalizedFieldValueAsync()</strong> - Test if all values match</summary>

Check if all field values pass the test.

**TypeScript Signatures:**
```typescript
function everyNormalizedFieldValue<T>(
  field: Field,
  value: T | LocalizedFieldValue<T>,
  testFn: (locale: string | undefined, localeValue: T) => boolean
): boolean

async function everyNormalizedFieldValueAsync<T>(
  field: Field,
  value: T | LocalizedFieldValue<T>,
  testFn: (locale: string | undefined, localeValue: T) => Promise<boolean>
): Promise<boolean>
```

**Parameters:**
- `fieldType`: The typeo of DatoCMS field (ie. `string`, `rich_text`, etc.)
- `nonLocalizedFieldValue`: The non-localized field value to test
- `testFn`: Predicate function

**Returns:** True if all values pass the test
</details>

<details>
<summary><strong>toNormalizedFieldValueEntries() / fromNormalizedFieldValueEntries()</strong> - Convert between formats</summary>

Convert field values to/from a normalized entry format for uniform processing.

**TypeScript Signatures:**
```typescript
function toNormalizedFieldValueEntries<T>(
  field: Field,
  value: T | LocalizedFieldValue<T>
): NormalizedFieldValueEntry<T>[]

function fromNormalizedFieldValueEntries<T>(
  field: Field,
  entries: NormalizedFieldValueEntry<T>[]
): T | LocalizedFieldValue<T>

type NormalizedFieldValueEntry<T> = {
  locale: string | undefined;
  value: T;
}
```

**Parameters:**
- `fieldType`: The typeo of DatoCMS field (ie. `string`, `rich_text`, etc.)
- `nonLocalizedFieldValue`/`entries non-localized`: Value to convert from/to

**Returns:** Normalized entries array or reconstructed field value

**Usage Example:**
```typescript
// Convert to entries for processing
const entries = toNormalizedFieldValueEntries(field, fieldValue);

// Process entries uniformly
const processed = entries.map(({ locale, value }) => ({
  locale,
  value: processValue(value)
}));

// Convert back to field value format
const result = fromNormalizedFieldValueEntries(field, processed);
</details>

### 4. SchemaRepository

The `SchemaRepository` class provides a lightweight, in-memory cache for DatoCMS schema entities (item types, fields, fieldsets, and plugins). It helps avoid redundant API calls when working across multiple functions or utilities that require schema lookups.

**Why use it?**

- **Cache once, reuse everywhere**: The first API call stores results in memory; all subsequent lookups are instant.
- **Efficient schema access**: Retrieve entities by ID, API key, or package name without re-fetching.
- **Optimized for block processing**: Essential for utilities like `mapBlocksInNonLocalizedFieldValue`.
- **Fewer API calls**: Dramatically speeds up bulk operations and complex traversals.

**Usage Example:**
```typescript
const schemaRepository = new SchemaRepository(client);

// First call: fetches from API and caches result
const blogPost = await schemaRepository.getItemTypeByApiKey('blog_post');
const fields = await schemaRepository.getItemTypeFields(blogPost);

// Next calls: resolved instantly from cache (no API calls)
const sameBlogPost = await schemaRepository.getItemTypeByApiKey('blog_post');
const sameFields = await schemaRepository.getItemTypeFields(blogPost);

// Works seamlessly with block-processing utilities
await mapBlocksInNonLocalizedFieldValue(
  fieldValue,
  field,
  schemaRepository,  // share cached lookups
  async (block) => {
    // transform block here
  }
);
```

**When to Use**

* Traversing relationships that repeatedly query schema
* Bulk record processing scripts
* Block-processing utilities that need frequent lookups
* Any script where reducing API calls matters

**When Not to Use**

* Scripts that modify schema (models, fields, etc.)
* Long-running applications (cache never expires)
* Situations where the schema might change during execution

<details><summary><strong>Class signature</strong></summary>

```typescript
class SchemaRepository {
  constructor(client: GenericClient)

  // Item Type methods
  async getAllItemTypes(): Promise<ItemType[]>
  async getAllModels(): Promise<ItemType[]>
  async getAllBlockModels(): Promise<ItemType[]>
  async getItemTypeByApiKey(apiKey: string): Promise<ItemType>
  async getItemTypeById(id: string): Promise<ItemType>

  // Field methods
  async getItemTypeFields(itemType: ItemType): Promise<Field[]>
  async getItemTypeFieldsets(itemType: ItemType): Promise<Fieldset[]>

  // Plugin methods
  async getAllPlugins(): Promise<Plugin[]>
  async getPluginById(id: string): Promise<Plugin>
  async getPluginByPackageName(packageName: string): Promise<Plugin>

  // Raw variants (return API response format)
  async getAllRawItemTypes(): Promise<RawItemType[]>
  async getRawItemTypeByApiKey(apiKey: string): Promise<RawItemType>
  // ... and more raw variants
}
```
</details>

## Contributing

Bug reports and pull requests are welcome on GitHub at https://github.com/datocms/js-rest-api-clients. This project is intended to be a safe, welcoming space for collaboration, and contributors are expected to adhere to the [Contributor Covenant](http://contributor-covenant.org) code of conduct.

## License

The package is available as open source under the terms of the [MIT License](http://opensource.org/licenses/MIT).