# DatoCMS Content Management API Utilities

Take a look at the full [API documentation](https://www.datocms.com/docs/content-management-api) for examples!

## Field Types

This library provides comprehensive TypeScript type definitions and utilities for all DatoCMS field types. Each field type includes type guards, validation functions, localization support, and editor appearance configurations.

### What's available

Every field type follows a consistent pattern providing:

- **Field value types**: TypeScript definitions for the field's data structure
- **Type guards**: Functions to validate field values at runtime
- **Localization support**: Utilities for handling localized field variants
- **Validation types**: Supported validators for the field type
- **Appearance configuration**: Editor types and their configuration options

**Example: `lat_lon` Field Type**

<details>
<summary>View example</summary>

```typescript
import { isLatLonFieldValue, isLocalizedLatLonFieldValue } from '@datocms/cma-client';
import type { LatLonFieldValue, LatLonFieldValidators, LatLonFieldAppearance } from '@datocms/cma-client';

// Field value type - object with latitude/longitude or null
const value: LatLonFieldValue = { latitude: 45.4642, longitude: 9.1900 };

// Type guard functions for validation
if (isLatLonFieldValue(someValue)) {
  // someValue is guaranteed to be { latitude: number; longitude: number } | null
}

if (isLocalizedLatLonFieldValue(localizedValue)) {
  // localizedValue is a localized lat/lon field
}

// Validator and appearance types available for type-safe configuration
type Validators = LatLonFieldValidators;
type Appearance = LatLonFieldAppearance;
```
</details>

### Context-Dependent field types

Some field types have different value formats depending on the API context (request vs response) or query parameters:

#### Request vs Response variations

**File and Gallery fields** have different type requirements for API requests versus responses:

<details>
<summary>View example</summary>

```typescript
import {
  FileFieldValue,
  FileFieldValueInRequest,
  GalleryFieldValue,
  GalleryFieldValueInRequest,
  // Type guards for runtime validation
  isFileFieldValue,
  isFileFieldValueInRequest,
  isGalleryFieldValue,
  isGalleryFieldValueInRequest
} from '@datocms/cma-client';

// API Response format - all metadata fields present with defaults
const fileResponse: FileFieldValue = {
  upload_id: "12345",
  alt: null,           // Always present (default: null)
  title: null,         // Always present (default: null)
  custom_data: {},     // Always present (default: {})
  focal_point: null    // Always present (default: null)
};

// API Request format - metadata fields are optional
const fileRequest: FileFieldValueInRequest = {
  upload_id: "12345"
  // alt, title, custom_data, focal_point are optional
};

// Runtime validation for different contexts
if (isFileFieldValueInRequest(someFileValue)) {
  // someFileValue has optional metadata fields
}

if (isGalleryFieldValue(someGalleryValue)) {
  // someGalleryValue is array of files with all metadata present
}
```
</details>

#### "Nested Mode" Response variations

**Block-containing fields** (`structured_text`, `single_block`, `rich_text`) support different block representations for regular responses, for ["Nested Mode" responses](https://www.datocms.com/docs/content-management-api/resources/item#api-response-modes-regular-vs-nested), and for requests:

<details>
<summary>View example</summary>

```typescript
import {
  StructuredTextFieldValue,
  StructuredTextFieldValueInRequest,
  StructuredTextFieldValueInNestedResponse,
  // Type guards for all variations (also available for single_block and rich_text)
  isStructuredTextFieldValue,
  isStructuredTextFieldValueInRequest,
  isStructuredTextFieldValueInNestedResponse
} from '@datocms/cma-client';

// Regular response - blocks as string IDs
const standard: StructuredTextFieldValue = {
  document: {
    type: "root",
    children: [
      {
        type: "block",
        // String ID reference
        item: "IdMLV2GJTXyQ0Bfns7R4IQ"
      }
    ]
  }
};

// Nested Mode response (?nested=true) - blocks as full objects
const nested: StructuredTextFieldValueInNestedResponse = {
  document: {
    type: "root",
    children: [
      {
        type: "block",
        // Always full block object
        item: {
          id: "IdMLV2GJTXyQ0Bfns7R4IQ",
          type: "item",
          attributes: { /* ... */ },
          relationships: { /* ... */ }
        }
      }
    ]
  }
};

// Request format - flexible block representation
const request: StructuredTextFieldValueInRequest = {
  document: {
    type: "root",
    children: [
      {
        type: "block",
        // Can be string ID, to keep block unchanged...
        item: "FicV5CxCSQ6yOrgfwRoiKA"
      },
      {
        type: "block",
        // ...or full block object (to create new blocks or update existing ones)
        item: {
          type: "item",
          attributes: { /* ... */ },
          relationships: { /* ... */ }
        }
      }
    ]
  }
};

// Runtime validation for different contexts
if (isStructuredTextFieldValueInNestedResponse(someStructuredText)) {
  // someStructuredText has blocks as full objects
}

if (isStructuredTextFieldValueInRequest(requestData)) {
  // requestData allows flexible block representations
}
```
</details>

These variants ensure type safety across different API contexts while maintaining the same conceptual data structure. All localized variants also have corresponding type guards (e.g., `isLocalizedStructuredTextFieldValueInRequest`, `isLocalizedStructuredTextFieldValueInNestedResponse`, etc.).

**TypeScript Generics Support:** For maximum type safety, all field value types and type guards for block-containing fields accept [`ItemTypeDefinition` generics](https://www.datocms.com/docs/content-management-api/resources/item#type-safe-development-with-typescript) to provide precise typing for your specific schema:

<details>
<summary>View example</summary>

```typescript
import type { MyArticle, MyArticleSection } from './schema';

// Fully typed structured text with specific block types
const content: StructuredTextFieldValueInRequest<MyArticleSection> = {
  document: {
    type: "root",
    children: [/* ... */]
  }
};

// Type guard with generic for precise validation
if (isStructuredTextFieldValueInNestedResponse<MyArticleSection>(value)) {
  // value is now typed with your specific block schema
}
```
</details>

## Block Processing Utilities

### Inspecting Records and Blocks

The `inspectItem()` function provides a visual, tree-structured representation of DatoCMS records in the console, making it easier to debug and understand complex content structures.

#### inspectItem()

Formats a DatoCMS item (record or block) as a visual tree structure, showing all fields with proper formatting for each field type. Particularly useful for debugging nested structures like modular content and structured text.

<details>
<summary>View details</summary>

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

### Creating and Duplicating Blocks

#### buildBlockRecord()

Converts a block data object into the proper format for API requests.

<details>
<summary>View details</summary>

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

#### duplicateBlockRecord()

Creates a deep copy of a block record, including all nested blocks, removing IDs to create new instances.

<details>
<summary>View details</summary>

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

### Recursive Block Operations

DatoCMS supports three field types that can contain blocks: Modular Content (arrays of blocks), Single Block fields, and Structured Text (rich-text with embedded blocks). These functions abstract away the differences between field types and can traverse blocks recursively, processing nested blocks within blocks. They require a `SchemaRepository` instance to look up field definitions for nested blocks.

#### visitBlocksInNonLocalizedFieldValue()

Visit every block in a non-localized field value recursively, including blocks nested within other blocks.

<details>
<summary>View details</summary>

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
- `fieldType`: The type of DatoCMS field (ie. `string`, `rich_text`, etc.)
- `schemaRepository`: Repository for caching schema lookups
- `visitor`: Function called for each block (including nested)
</details>

#### mapBlocksInNonLocalizedFieldValue()

Transform all blocks in a non-localized field value recursively, including nested blocks.

<details>
<summary>View details</summary>

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
- `fieldType`: The type of DatoCMS field (ie. `string`, `rich_text`, etc.)
- `schemaRepository`: Repository for caching schema lookups
- `mapper`: Function that transforms each block

**Returns:** New field value
</details>

#### filterBlocksInNonLocalizedFieldValue()

Filter blocks recursively, removing blocks at any nesting level that don't match the predicate.

<details>
<summary>View details</summary>

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
- `fieldType`: The type of DatoCMS field (ie. `string`, `rich_text`, etc.)
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

#### findAllBlocksInNonLocalizedFieldValue()

Find all blocks that match the predicate, searching recursively through nested blocks.

<details>
<summary>View details</summary>

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
- `fieldType`: The type of DatoCMS field (ie. `string`, `rich_text`, etc.)
- `schemaRepository`: Repository for caching schema lookups
- `predicate`: Function that tests each block

**Returns:** Array of all matching blocks with their paths
</details>

#### reduceBlocksInNonLocalizedFieldValue()

Reduce all blocks recursively to a single value.

<details>
<summary>View details</summary>

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
- `fieldType`: The type of DatoCMS field (ie. `string`, `rich_text`, etc.)
- `schemaRepository`: Repository for caching schema lookups
- `reducer`: Function that processes each block
- `initialValue`: Initial accumulator value

**Returns:** The final accumulated value
</details>

#### someBlocksInNonLocalizedFieldValue()

Check if any block (including nested) matches the predicate.

<details>
<summary>View details</summary>

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
- `fieldType`: The type of DatoCMS field (ie. `string`, `rich_text`, etc.)
- `schemaRepository`: Repository for caching schema lookups
- `predicate`: Function that tests each block

**Returns:** True if any block matches
</details>

#### everyBlockInNonLocalizedFieldValue()

Check if every block (including nested) matches the predicate.

<details>
<summary>View details</summary>

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
- `fieldType`: The type of DatoCMS field (ie. `string`, `rich_text`, etc.)
- `schemaRepository`: Repository for caching schema lookups
- `predicate`: Function that tests each block

**Returns:** True if all blocks match
</details>

## Unified Field Processing (Localized & Non-Localized)

These utilities provide a unified interface for working with DatoCMS field values that may or may not be localized. They eliminate the need for conditional logic when processing fields that could be either localized or non-localized.

#### mapNormalizedFieldValues() / mapNormalizedFieldValuesAsync()

Apply a transformation function to field values, handling both localized and non-localized fields uniformly.

<details>
<summary>View details</summary>

**TypeScript Signatures:**
```typescript
function mapNormalizedFieldValues<TInput, TOutput>(
  localizedOrNonLocalizedFieldValue: TInput | LocalizedFieldValue<TInput>,
  field: Field,
  mapFn: (locale: string | undefined, localeValue: TInput) => TOutput
): TOutput | LocalizedFieldValue<TOutput>

async function mapNormalizedFieldValuesAsync<TInput, TOutput>(
  localizedOrNonLocalizedFieldValue: TInput | LocalizedFieldValue<TInput>,
  field: Field,
  mapFn: (locale: string | undefined, localeValue: TInput) => Promise<TOutput>
): Promise<TOutput | LocalizedFieldValue<TOutput>>
```

**Parameters:**
- `localizedOrNonLocalizedFieldValue`: The field value (localized or non-localized)
- `field`: The DatoCMS field definition
- `mapFn`: Function to transform each value (receives locale for localized fields, undefined for non-localized)

**Returns:** Transformed value maintaining the same structure
</details>

#### filterNormalizedFieldValues() / filterNormalizedFieldValuesAsync()

Filter field values based on a predicate, handling both localized and non-localized fields.

<details>
<summary>View details</summary>

**TypeScript Signatures:**
```typescript
function filterNormalizedFieldValues<T>(
  localizedOrNonLocalizedFieldValue: T | LocalizedFieldValue<T>,
  field: Field,
  filterFn: (locale: string | undefined, localeValue: T) => boolean
): T | LocalizedFieldValue<T> | undefined

async function filterNormalizedFieldValuesAsync<T>(
  localizedOrNonLocalizedFieldValue: T | LocalizedFieldValue<T>,
  field: Field,
  filterFn: (locale: string | undefined, localeValue: T) => Promise<boolean>
): Promise<T | LocalizedFieldValue<T> | undefined>
```

**Parameters:**
- `localizedOrNonLocalizedFieldValue`: The field value to filter
- `field`: The DatoCMS field definition
- `filterFn`: Predicate function for filtering

**Returns:** Filtered value or undefined if all filtered out
</details>

#### visitNormalizedFieldValues() / visitNormalizedFieldValuesAsync()

Visit each value in a field, handling both localized and non-localized fields.

<details>
<summary>View details</summary>

**TypeScript Signatures:**
```typescript
function visitNormalizedFieldValues<T>(
  localizedOrNonLocalizedFieldValue: T | LocalizedFieldValue<T>,
  field: Field,
  visitFn: (locale: string | undefined, localeValue: T) => void
): void

async function visitNormalizedFieldValuesAsync<T>(
  localizedOrNonLocalizedFieldValue: T | LocalizedFieldValue<T>,
  field: Field,
  visitFn: (locale: string | undefined, localeValue: T) => Promise<void>
): Promise<void>
```

**Parameters:**
- `localizedOrNonLocalizedFieldValue`: The field value to visit
- `field`: The DatoCMS field definition
- `visitFn`: Function called for each value
</details>

#### someNormalizedFieldValues() / someNormalizedFieldValuesAsync()

Check if at least one field value passes the test.

<details>
<summary>View details</summary>

**TypeScript Signatures:**
```typescript
function someNormalizedFieldValues<T>(
  localizedOrNonLocalizedFieldValue: T | LocalizedFieldValue<T>,
  field: Field,
  testFn: (locale: string | undefined, localeValue: T) => boolean
): boolean

async function someNormalizedFieldValuesAsync<T>(
  localizedOrNonLocalizedFieldValue: T | LocalizedFieldValue<T>,
  field: Field,
  testFn: (locale: string | undefined, localeValue: T) => Promise<boolean>
): Promise<boolean>
```

**Parameters:**
- `localizedOrNonLocalizedFieldValue`: The field value to test
- `field`: The DatoCMS field definition
- `testFn`: Predicate function

**Returns:** True if any value passes the test
</details>

#### everyNormalizedFieldValue() / everyNormalizedFieldValueAsync()

Check if all field values pass the test.

<details>
<summary>View details</summary>

**TypeScript Signatures:**
```typescript
function everyNormalizedFieldValue<T>(
  localizedOrNonLocalizedFieldValue: T | LocalizedFieldValue<T>,
  field: Field,
  testFn: (locale: string | undefined, localeValue: T) => boolean
): boolean

async function everyNormalizedFieldValueAsync<T>(
  localizedOrNonLocalizedFieldValue: T | LocalizedFieldValue<T>,
  field: Field,
  testFn: (locale: string | undefined, localeValue: T) => Promise<boolean>
): Promise<boolean>
```

**Parameters:**
- `localizedOrNonLocalizedFieldValue`: The field value to test
- `field`: The DatoCMS field definition
- `testFn`: Predicate function

**Returns:** True if all values pass the test
</details>

#### toNormalizedFieldValueEntries() / fromNormalizedFieldValueEntries()

Convert field values to/from a normalized entry format for uniform processing.

<details>
<summary>View details</summary>

**TypeScript Signatures:**
```typescript
function toNormalizedFieldValueEntries<T>(
  localizedOrNonLocalizedFieldValue: T | LocalizedFieldValue<T>,
  field: Field
): NormalizedFieldValueEntry<T>[]

function fromNormalizedFieldValueEntries<T>(
  entries: NormalizedFieldValueEntry<T>[],
  field: Field
): T | LocalizedFieldValue<T>

type NormalizedFieldValueEntry<T> = {
  locale: string | undefined;
  value: T;
}
```

**Parameters:**
- `localizedOrNonLocalizedFieldValue`/`entries`: Value to convert from/to
- `field`: The DatoCMS field definition

**Returns:** Normalized entries array or reconstructed field value

**Usage Example:**
```typescript
// Convert to entries for processing
const entries = toNormalizedFieldValueEntries(fieldValue, field);

// Process entries uniformly
const processed = entries.map(({ locale, value }) => ({
  locale,
  value: processValue(value)
}));

// Convert back to field value format
const result = fromNormalizedFieldValueEntries(processed, field);
```
</details>

## SchemaRepository

The `SchemaRepository` class provides a lightweight, in-memory cache for DatoCMS schema entities (item types, fields, fieldsets, and plugins). It helps avoid redundant API calls when working across multiple functions or utilities that require schema lookups.

**Why use it?**

- **Cache once, reuse everywhere**: The first API call stores results in memory; all subsequent lookups are instant.
- **Efficient schema access**: Retrieve entities by ID, API key, or package name without re-fetching.
- **Optimized for block processing**: Essential for utilities like `mapBlocksInNonLocalizedFieldValue`.
- **Fewer API calls**: Dramatically speeds up bulk operations and complex traversals.

**Usage Example:**

<details>
<summary>View example</summary>

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
  fieldType,
  schemaRepository,  // share cached lookups
  async (block) => {
    // transform block here
  }
);
```
</details>

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

  // Higher-level utilities
  async getModelsEmbeddingBlocks(blocks: ItemType[]): Promise<ItemType[]>
  async getNestedBlocks(itemTypes: ItemType[]): Promise<ItemType[]>
  async getNestedModels(itemTypes: ItemType[]): Promise<ItemType[]>

  // Plugin methods
  async getAllPlugins(): Promise<Plugin[]>
  async getPluginById(id: string): Promise<Plugin>
  async getPluginByPackageName(packageName: string): Promise<Plugin>

  // Raw variants (return API response format)
  async getAllRawItemTypes(): Promise<RawItemType[]>
  async getRawItemTypeByApiKey(apiKey: string): Promise<RawItemType>
  async getRawNestedBlocks(itemTypes: Array<ItemType | RawItemType>): Promise<Array<RawItemType>>
  async getRawNestedModels(itemTypes: Array<ItemType | RawItemType>): Promise<Array<RawItemType>>
  // ... and more raw variants
}
```
</details>

## Contributing

Bug reports and pull requests are welcome on GitHub at https://github.com/datocms/js-rest-api-clients. This project is intended to be a safe, welcoming space for collaboration, and contributors are expected to adhere to the [Contributor Covenant](http://contributor-covenant.org) code of conduct.

## License

The package is available as open source under the terms of the [MIT License](http://opensource.org/licenses/MIT).