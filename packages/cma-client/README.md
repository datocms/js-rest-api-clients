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

### 1. Record Inspection Utilities

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

### 2. Block Processing Utilities

These utilities provide a unified interface for working with blocks embedded within DatoCMS field values. DatoCMS supports three field types that can contain blocks: Modular Content (arrays of blocks), Single Block fields, and Structured Text (with embedded blocks). These functions abstract away the differences between field types, providing consistent APIs for common operations.

#### Recursive Block Operations

These functions traverse blocks recursively, processing nested blocks within blocks. They require a `SchemaRepository` instance to look up field definitions for nested blocks.

<details>
<summary><strong>visitBlocksInFieldValues()</strong> - Recursively visit all blocks</summary>

Visit every block in a field value recursively, including blocks nested within other blocks.

**TypeScript Signature:**
```typescript
async function visitBlocksInFieldValues(
  schemaRepository: SchemaRepository,
  field: Field,
  value: unknown,
  visitor: (item: BlockItemInARequest, path: TreePath) => void | Promise<void>,
  path?: TreePath
): Promise<void>
```

**Parameters:**
- `schemaRepository`: Repository for caching schema lookups
- `field`: The DatoCMS field definition
- `value`: The field value containing blocks
- `visitor`: Function called for each block (including nested)
- `path`: Optional base path for tracking location

**Usage Example:**
```typescript
const schemaRepository = new SchemaRepository(client);

await visitBlocksInFieldValues(
  schemaRepository,
  field,
  fieldValue,
  async (block, path) => {
    console.log(`Block at ${path.join('.')}`);
    // Process both top-level and nested blocks
  }
);
```
</details>

<details>
<summary><strong>mapBlocksInFieldValues()</strong> - Recursively transform all blocks</summary>

Transform all blocks in a field value recursively, including nested blocks.

**TypeScript Signature:**
```typescript
async function mapBlocksInFieldValues(
  schemaRepository: SchemaRepository,
  field: Field,
  value: unknown,
  mapper: (item: BlockItemInARequest, path: TreePath) => BlockItemInARequest | Promise<BlockItemInARequest>,
  path?: TreePath
): Promise<unknown>
```

**Parameters:**
- `schemaRepository`: Repository for caching schema lookups
- `field`: The DatoCMS field definition
- `value`: The field value containing blocks
- `mapper`: Function that transforms each block
- `path`: Optional base path

**Returns:** New field value with all blocks transformed

**Usage Example:**
```typescript
// Add tracking IDs to all blocks recursively
const tracked = await mapBlocksInFieldValues(
  schemaRepository,
  field,
  fieldValue,
  async (block) => ({
    ...block,
    attributes: {
      ...block.attributes,
      tracking_id: generateTrackingId()
    }
  })
);
```
</details>

<details>
<summary><strong>filterBlocksInFieldValues()</strong> - Recursively filter blocks</summary>

Filter blocks recursively, removing blocks at any nesting level that don't match the predicate.

**TypeScript Signature:**
```typescript
async function filterBlocksInFieldValues(
  schemaRepository: SchemaRepository,
  field: Field,
  value: unknown,
  predicate: (item: BlockItemInARequest, path: TreePath) => boolean | Promise<boolean>,
  path?: TreePath
): Promise<unknown>
```

**Parameters:**
- `schemaRepository`: Repository for caching schema lookups
- `field`: The DatoCMS field definition
- `value`: The field value to filter
- `predicate`: Function that tests each block
- `path`: Optional base path

**Returns:** New field value with filtered blocks

**Usage Example:**
```typescript
// Remove all video blocks at any nesting level
const noVideos = await filterBlocksInFieldValues(
  schemaRepository,
  field,
  fieldValue,
  (block) => block.relationships.item_type.data.id !== 'video_block'
);
```
</details>

<details>
<summary><strong>findAllBlocksInFieldValues()</strong> - Recursively search for blocks</summary>

Find all blocks that match the predicate, searching recursively through nested blocks.

**TypeScript Signature:**
```typescript
async function findAllBlocksInFieldValues(
  schemaRepository: SchemaRepository,
  field: Field,
  value: unknown,
  predicate: (item: BlockItemInARequest, path: TreePath) => boolean | Promise<boolean>,
  path?: TreePath
): Promise<Array<{ item: BlockItemInARequest; path: TreePath }>>
```

**Parameters:**
- `schemaRepository`: Repository for caching schema lookups
- `field`: The DatoCMS field definition
- `value`: The field value to search
- `predicate`: Function that tests each block
- `path`: Optional base path

**Returns:** Array of all matching blocks with their paths

**Usage Example:**
```typescript
// Find all blocks with external links
const externalLinks = await findAllBlocksInFieldValues(
  schemaRepository,
  field,
  fieldValue,
  (block) => block.attributes.url?.includes('http')
);
```
</details>

<details>
<summary><strong>reduceBlocksInFieldValues()</strong> - Recursively reduce blocks</summary>

Reduce all blocks recursively to a single value.

**TypeScript Signature:**
```typescript
async function reduceBlocksInFieldValues<R>(
  schemaRepository: SchemaRepository,
  field: Field,
  value: unknown,
  reducer: (accumulator: R, item: BlockItemInARequest, path: TreePath) => R | Promise<R>,
  initialValue: R,
  path?: TreePath
): Promise<R>
```

**Parameters:**
- `schemaRepository`: Repository for caching schema lookups
- `field`: The DatoCMS field definition
- `value`: The field value to reduce
- `reducer`: Function that processes each block
- `initialValue`: Initial accumulator value
- `path`: Optional base path

**Returns:** The final accumulated value

**Usage Example:**
```typescript
// Collect all image URLs from nested blocks
const imageUrls = await reduceBlocksInFieldValues(
  schemaRepository,
  field,
  fieldValue,
  (urls, block) => {
    if (block.attributes.image_url) {
      urls.push(block.attributes.image_url);
    }
    return urls;
  },
  []
);
```
</details>

<details>
<summary><strong>someBlocksInFieldValues()</strong> - Recursively test for any match</summary>

Check if any block (including nested) matches the predicate.

**TypeScript Signature:**
```typescript
async function someBlocksInFieldValues(
  schemaRepository: SchemaRepository,
  field: Field,
  value: unknown,
  predicate: (item: BlockItemInARequest, path: TreePath) => boolean | Promise<boolean>,
  path?: TreePath
): Promise<boolean>
```

**Parameters:**
- `schemaRepository`: Repository for caching schema lookups
- `field`: The DatoCMS field definition
- `value`: The field value to test
- `predicate`: Function that tests each block
- `path`: Optional base path

**Returns:** True if any block matches

**Usage Example:**
```typescript
// Check if any nested block has missing alt text
const hasMissingAlt = await someBlocksInFieldValues(
  schemaRepository,
  field,
  fieldValue,
  (block) => block.attributes.image && !block.attributes.alt_text
);
```
</details>

<details>
<summary><strong>everyBlockInFieldValues()</strong> - Recursively test if all match</summary>

Check if every block (including nested) matches the predicate.

**TypeScript Signature:**
```typescript
async function everyBlockInFieldValues(
  schemaRepository: SchemaRepository,
  field: Field,
  value: unknown,
  predicate: (item: BlockItemInARequest, path: TreePath) => boolean | Promise<boolean>,
  path?: TreePath
): Promise<boolean>
```

**Parameters:**
- `schemaRepository`: Repository for caching schema lookups
- `field`: The DatoCMS field definition
- `value`: The field value to test
- `predicate`: Function that tests each block
- `path`: Optional base path

**Returns:** True if all blocks match

**Usage Example:**
```typescript
// Verify all blocks have required metadata
const allValid = await everyBlockInFieldValues(
  schemaRepository,
  field,
  fieldValue,
  (block) => block.attributes.title && block.attributes.description
);
```
</details>

#### Block Record Management

<details>
<summary><strong>buildBlockRecord()</strong> - Create block records from data</summary>

Converts a block data object into the proper format for API requests.

**TypeScript Signature:**
```typescript
function buildBlockRecord<D extends ItemTypeDefinition>(
  body: ItemUpdateSchema<ToItemDefinitionAsRequest<D>>
): NewBlockInARequest<ToItemDefinitionAsRequest<D>>
```

**Parameters:**
- `body`: Block data in update schema format

**Returns:** Formatted block record ready for API requests

**Usage Example:**
```typescript
const blockRecord = buildBlockRecord({
  item_type: { type: 'item_type', id: 'c01GlXRMQPiVqBpwWNRY4A' },
  title: 'My Text Block',
  content: 'Block content here'
});
```
</details>

<details>
<summary><strong>duplicateBlockRecord()</strong> - Deep clone blocks with nested content</summary>

Creates a deep copy of a block record, including all nested blocks, removing IDs to create new instances.

**TypeScript Signature:**
```typescript
async function duplicateBlockRecord<D extends ItemTypeDefinition>(
  existingBlock: ItemWithOptionalIdAndMeta<ToItemDefinitionWithNestedBlocks<D>>,
  schemaRepository: SchemaRepository
): Promise<NewBlockInARequest<ToItemDefinitionAsRequest<D>>>
```

**Parameters:**
- `existingBlock`: The block to duplicate
- `schemaRepository`: Repository for schema lookups

**Returns:** New block record without IDs, ready to be created

**Usage Example:**
```typescript
const schemaRepository = new SchemaRepository(client);

// Duplicate a complex block with nested content
const duplicated = await duplicateBlockRecord(
  existingBlock,
  schemaRepository
);

// Create the duplicated block
const newBlock = await client.items.create({
  data: duplicated
});
```
</details>

### 3. Localization-Aware Field Utilities

These utilities provide a unified interface for working with DatoCMS field values that may or may not be localized. They eliminate the need for conditional logic when processing fields that could be either localized or non-localized.

<details>
<summary><strong>isLocalized()</strong> - Check if a field is localized</summary>

Determines whether a DatoCMS field is configured for localization.

**TypeScript Signature:**
```typescript
function isLocalized(field: Field): boolean
```

**Parameters:**
- `field`: The DatoCMS field definition

**Returns:** True if the field is localized, false otherwise

**Usage Example:**
```typescript
if (isLocalized(field)) {
  console.log('This field contains values for multiple locales');
} else {
  console.log('This field has a single value');
}
```
</details>

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
- `field`: The DatoCMS field definition
- `value`: The field value (localized or non-localized)
- `mapFn`: Function to transform each value (receives locale for localized fields, undefined for non-localized)

**Returns:** Transformed value maintaining the same structure

**Usage Example:**
```typescript
// Uppercase all text values, regardless of localization
const uppercased = mapNormalizedFieldValues(
  field,
  fieldValue,
  (locale, value) => {
    console.log(locale ? `Processing ${locale}` : 'Processing non-localized');
    return value.toUpperCase();
  }
);
```
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
- `field`: The DatoCMS field definition
- `value`: The field value to filter
- `filterFn`: Predicate function for filtering

**Returns:** Filtered value or undefined if all filtered out

**Usage Example:**
```typescript
// Keep only non-empty values
const nonEmpty = filterNormalizedFieldValues(
  field,
  fieldValue,
  (locale, value) => value && value.length > 0
);
```
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
- `field`: The DatoCMS field definition
- `value`: The field value to visit
- `visitFn`: Function called for each value

**Usage Example:**
```typescript
// Log all values with their locales
visitNormalizedFieldValues(
  field,
  fieldValue,
  (locale, value) => {
    if (locale) {
      console.log(`${locale}: ${value}`);
    } else {
      console.log(`Non-localized: ${value}`);
    }
  }
);
```
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
- `field`: The DatoCMS field definition
- `value`: The field value to test
- `testFn`: Predicate function

**Returns:** True if any value passes the test

**Usage Example:**
```typescript
// Check if any locale has content
const hasContent = someNormalizedFieldValues(
  field,
  fieldValue,
  (locale, value) => value && value.length > 0
);
```
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
- `field`: The DatoCMS field definition
- `value`: The field value to test
- `testFn`: Predicate function

**Returns:** True if all values pass the test

**Usage Example:**
```typescript
// Verify all locales have translations
const allTranslated = everyNormalizedFieldValue(
  field,
  fieldValue,
  (locale, value) => value && value.trim().length > 0
);
```
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
- `field`: The DatoCMS field definition
- `value`/`entries`: Value to convert from/to

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
```
</details>

### 4. Schema Repository

The `SchemaRepository` class provides an in-memory caching system for DatoCMS schema entities, significantly improving performance when working with complex content structures.

<details>
<summary><strong>SchemaRepository</strong> - Cache schema entities for performance</summary>

Repository for DatoCMS schema entities including item types, fields, fieldsets, and plugins. Provides caching and efficient lookup functionality for schema-related operations.

**Key Features:**
- Automatic caching of schema entities after first fetch
- Efficient lookups by ID, API key, or package name
- Essential for recursive block operations
- Dramatically reduces API calls during complex traversals

**TypeScript Class:**
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

**When to Use:**
- Complex traversal operations that repeatedly lookup schema
- Bulk operations processing multiple records
- Scripts that need efficient access to schema information
- Working with recursive block utilities

**When NOT to Use:**
- Scripts that modify schema (models, fields, etc.)
- Long-running applications (no cache expiration)
- When schema might change during execution

**Usage Example:**
```typescript
const schemaRepository = new SchemaRepository(client);

// First call fetches from API and caches
const blogPost = await schemaRepository.getItemTypeByApiKey('blog_post');
const fields = await schemaRepository.getItemTypeFields(blogPost);

// Subsequent calls use cached data (no API calls)
const sameBlogPost = await schemaRepository.getItemTypeByApiKey('blog_post');
const sameFields = await schemaRepository.getItemTypeFields(blogPost);

// Use with recursive utilities for optimal performance
await mapBlocksInFieldValues(
  schemaRepository,  // Pass repository for efficient lookups
  field,
  fieldValue,
  async (block) => { /* transform */ }
);
```

**Performance Impact:**
Without SchemaRepository, a script processing structured text with nested blocks might make the same API calls dozens of times. SchemaRepository ensures each unique schema request is made only once, dramatically improving performance for complex operations.
</details>

## Complete Field Type System

DatoCMS provides comprehensive TypeScript definitions for all 20 field types. This type system ensures type safety when working with field values, validators, and appearance configurations across your entire content management workflow.

### Overview

The field type system provides complete TypeScript support for:

- **Field Values**: Strongly typed representations of field data
- **Type Guards**: Runtime validation functions to verify field values
- **Validators**: Configuration for field validation rules
- **Appearance**: Editor configuration and parameters
- **Localization**: Support for both localized and non-localized field values
- **Request/Response Variants**: Different type representations for API requests vs responses

### Key Concepts

#### 1. Field Value Types

Each field type exports a primary value type (e.g., `StringFieldValue`, `IntegerFieldValue`) representing the shape of data stored in that field:

```typescript
import { StringFieldValue, IntegerFieldValue } from '@datocms/cma-client';

// Simple field values
const title: StringFieldValue = "Hello World"; // string | null
const count: IntegerFieldValue = 42; // number | null
```

#### 2. Type Guards

Every field type includes type guard functions for runtime validation:

```typescript
import { isStringFieldValue, isLocalizedStringFieldValue } from '@datocms/cma-client';

// Validate non-localized values
if (isStringFieldValue(value)) {
  // value is typed as string | null
}

// Validate localized values
if (isLocalizedStringFieldValue(value)) {
  // value is typed as { [locale: string]: string | null }
}
```

#### 3. Request vs Response Types

Some field types have different representations for API requests and responses:

- **Response types**: What you receive from the API (with defaults applied)
- **Request types**: What you send to the API (with optional fields)

```typescript
import {
  FileFieldValue,           // Response: all metadata fields present
  FileFieldValueAsRequest    // Request: metadata fields optional
} from '@datocms/cma-client';

// Response format (from API)
const fileResponse: FileFieldValue = {
  upload_id: "Ndugz4zKRq2RRg5NV8xDxw",
  alt: null,          // Always present
  title: null,        // Always present
  custom_data: {},    // Always present with default
  focal_point: null   // Always present
};

// Request format (to API)
const fileRequest: FileFieldValueAsRequest = {
  upload_id: "Ndugz4zKRq2RRg5NV8xDxw"
  // Other fields are optional
};
```

### Field Types Reference

#### Simple Value Fields

<details>
<summary><strong>String Field</strong></summary>

**Value Type:** `string | null`

```typescript
import {
  StringFieldValue,
  isStringFieldValue,
  isLocalizedStringFieldValue,
  StringFieldValidators,
  StringFieldAppearance
} from '@datocms/cma-client';

// Field value
const value: StringFieldValue = "Hello World";

// Type guards
isStringFieldValue(value); // boolean
isLocalizedStringFieldValue(localizedValue); // boolean

// Validators
const validators: StringFieldValidators = {
  required: { message: "Field is required" },
  unique: {},
  length: { min: 10, max: 100 },
  format: { pattern: "^[A-Z]" },
  enum: { values: ["option1", "option2"] }
};

// Appearance
const appearance: StringFieldAppearance = {
  editor: 'single_line',
  parameters: { heading: false, placeholder: "Enter text..." }
};
```
</details>

<details>
<summary><strong>Text Field</strong></summary>

**Value Type:** `string | null`

```typescript
import {
  TextFieldValue,
  isTextFieldValue,
  isLocalizedTextFieldValue,
  TextFieldValidators,
  TextFieldAppearance
} from '@datocms/cma-client';

// Field value
const value: TextFieldValue = "Long text content...";

// Type guards
isTextFieldValue(value); // boolean
isLocalizedTextFieldValue(localizedValue); // boolean

// Validators
const validators: TextFieldValidators = {
  required: { message: "Field is required" },
  length: { min: 50, max: 5000 }
};

// Appearance
const appearance: TextFieldAppearance = {
  editor: 'markdown',
  parameters: { toolbar: ['bold', 'italic', 'link'] }
};
```
</details>

<details>
<summary><strong>Boolean Field</strong></summary>

**Value Type:** `boolean | null`

```typescript
import {
  BooleanFieldValue,
  isBooleanFieldValue,
  isLocalizedBooleanFieldValue,
  BooleanFieldValidators,
  BooleanFieldAppearance
} from '@datocms/cma-client';

// Field value
const value: BooleanFieldValue = true;

// Type guards
isBooleanFieldValue(value); // boolean
isLocalizedBooleanFieldValue(localizedValue); // boolean

// Validators (no validators for boolean)
const validators: BooleanFieldValidators = {};

// Appearance
const appearance: BooleanFieldAppearance = {
  editor: 'boolean',
  parameters: {
    label: "Enable feature",
    hint: "Turn this on to activate"
  }
};
```
</details>

<details>
<summary><strong>Integer Field</strong></summary>

**Value Type:** `number | null`

```typescript
import {
  IntegerFieldValue,
  isIntegerFieldValue,
  isLocalizedIntegerFieldValue,
  IntegerFieldValidators,
  IntegerFieldAppearance
} from '@datocms/cma-client';

// Field value
const value: IntegerFieldValue = 42;

// Type guards
isIntegerFieldValue(value); // boolean
isLocalizedIntegerFieldValue(localizedValue); // boolean

// Validators
const validators: IntegerFieldValidators = {
  required: { message: "Field is required" },
  number_range: { min: 0, max: 100 }
};

// Appearance
const appearance: IntegerFieldAppearance = {
  editor: 'integer',
  parameters: { placeholder: "Enter number..." }
};
```
</details>

<details>
<summary><strong>Float Field</strong></summary>

**Value Type:** `number | null`

```typescript
import {
  FloatFieldValue,
  isFloatFieldValue,
  isLocalizedFloatFieldValue,
  FloatFieldValidators,
  FloatFieldAppearance
} from '@datocms/cma-client';

// Field value
const value: FloatFieldValue = 3.14159;

// Type guards
isFloatFieldValue(value); // boolean
isLocalizedFloatFieldValue(localizedValue); // boolean

// Validators
const validators: FloatFieldValidators = {
  required: { message: "Field is required" },
  number_range: { min: 0.0, max: 1.0 }
};

// Appearance
const appearance: FloatFieldAppearance = {
  editor: 'float',
  parameters: { placeholder: "0.00" }
};
```
</details>

<details>
<summary><strong>Date Field</strong></summary>

**Value Type:** `string | null` (ISO 8601 date string)

```typescript
import {
  DateFieldValue,
  isDateFieldValue,
  isLocalizedDateFieldValue,
  DateFieldValidators,
  DateFieldAppearance
} from '@datocms/cma-client';

// Field value
const value: DateFieldValue = "2024-01-15";

// Type guards
isDateFieldValue(value); // boolean
isLocalizedDateFieldValue(localizedValue); // boolean

// Validators
const validators: DateFieldValidators = {
  required: { message: "Date is required" },
  date_range: {
    min: "2024-01-01",
    max: "2024-12-31"
  }
};

// Appearance
const appearance: DateFieldAppearance = {
  editor: 'date_picker',
  parameters: {}
};
```
</details>

<details>
<summary><strong>DateTime Field</strong></summary>

**Value Type:** `string | null` (ISO 8601 datetime string)

```typescript
import {
  DateTimeFieldValue,
  isDateTimeFieldValue,
  isLocalizedDateTimeFieldValue,
  DateTimeFieldValidators,
  DateTimeFieldAppearance
} from '@datocms/cma-client';

// Field value
const value: DateTimeFieldValue = "2024-01-15T10:30:00Z";

// Type guards
isDateTimeFieldValue(value); // boolean
isLocalizedDateTimeFieldValue(localizedValue); // boolean

// Validators
const validators: DateTimeFieldValidators = {
  required: { message: "DateTime is required" },
  date_time_range: {
    min: "2024-01-01T00:00:00Z",
    max: "2024-12-31T23:59:59Z"
  }
};

// Appearance
const appearance: DateTimeFieldAppearance = {
  editor: 'date_time_picker',
  parameters: {}
};
```
</details>

<details>
<summary><strong>Color Field</strong></summary>

**Value Type:** `{ red: number; green: number; blue: number; alpha: number } | null`

```typescript
import {
  ColorFieldValue,
  isColorFieldValue,
  isLocalizedColorFieldValue,
  ColorFieldValidators,
  ColorFieldAppearance
} from '@datocms/cma-client';

// Field value
const value: ColorFieldValue = {
  red: 255,
  green: 0,
  blue: 0,
  alpha: 255
};

// Type guards
isColorFieldValue(value); // boolean
isLocalizedColorFieldValue(localizedValue); // boolean

// Validators
const validators: ColorFieldValidators = {
  required: { message: "Color is required" }
};

// Appearance
const appearance: ColorFieldAppearance = {
  editor: 'color_picker',
  parameters: { enable_alpha: true }
};
```
</details>

<details>
<summary><strong>JSON Field</strong></summary>

**Value Type:** `unknown | null` (any valid JSON)

```typescript
import {
  JsonFieldValue,
  isJsonFieldValue,
  isLocalizedJsonFieldValue,
  JsonFieldValidators,
  JsonFieldAppearance
} from '@datocms/cma-client';

// Field value
const value: JsonFieldValue = {
  key: "value",
  nested: { data: [1, 2, 3] }
};

// Type guards
isJsonFieldValue(value); // boolean
isLocalizedJsonFieldValue(localizedValue); // boolean

// Validators
const validators: JsonFieldValidators = {
  required: { message: "JSON is required" }
};

// Appearance
const appearance: JsonFieldAppearance = {
  editor: 'json',
  parameters: {}
};
```
</details>

<details>
<summary><strong>Location (Lat/Lon) Field</strong></summary>

**Value Type:** `{ latitude: number; longitude: number } | null`

```typescript
import {
  LatLonFieldValue,
  isLatLonFieldValue,
  isLocalizedLatLonFieldValue,
  LatLonFieldValidators,
  LatLonFieldAppearance
} from '@datocms/cma-client';

// Field value
const value: LatLonFieldValue = {
  latitude: 40.7128,
  longitude: -74.0060
};

// Type guards
isLatLonFieldValue(value); // boolean
isLocalizedLatLonFieldValue(localizedValue); // boolean

// Validators
const validators: LatLonFieldValidators = {
  required: { message: "Location is required" }
};

// Appearance
const appearance: LatLonFieldAppearance = {
  editor: 'map',
  parameters: {
    initial_latitude: 40.7128,
    initial_longitude: -74.0060,
    initial_zoom: 10
  }
};
```
</details>

<details>
<summary><strong>Slug Field</strong></summary>

**Value Type:** `string | null`

```typescript
import {
  SlugFieldValue,
  isSlugFieldValue,
  isLocalizedSlugFieldValue,
  SlugFieldValidators,
  SlugFieldAppearance
} from '@datocms/cma-client';

// Field value
const value: SlugFieldValue = "my-blog-post";

// Type guards
isSlugFieldValue(value); // boolean
isLocalizedSlugFieldValue(localizedValue); // boolean

// Validators
const validators: SlugFieldValidators = {
  required: { message: "Slug is required" },
  unique: {},
  format: {
    pattern: "^[a-z0-9-]+$",
    custom_pattern: "^[a-z][a-z0-9-]*$"
  }
};

// Appearance
const appearance: SlugFieldAppearance = {
  editor: 'slug',
  parameters: {
    url_prefix: "https://example.com/blog/",
    title_field_id: "title_field_id"
  }
};
```
</details>

<details>
<summary><strong>SEO Field</strong></summary>

**Value Type:** Complex object with optional SEO properties

```typescript
import {
  SeoFieldValue,
  isSeoFieldValue,
  isLocalizedSeoFieldValue,
  SeoFieldValidators,
  SeoFieldAppearance
} from '@datocms/cma-client';

// Field value
const value: SeoFieldValue = {
  title: "Page Title",
  description: "Page description for SEO",
  image: "Ndugz4zKRq2RRg5NV8xDxw",
  twitter_card: "summary_large_image",
  no_index: false
};

// Type guards
isSeoFieldValue(value); // boolean
isLocalizedSeoFieldValue(localizedValue); // boolean

// Validators
const validators: SeoFieldValidators = {
  required_seo_fields: {
    title: true,
    description: true
  },
  title_length: { min: 30, max: 60 },
  description_length: { min: 120, max: 160 }
};

// Appearance
const appearance: SeoFieldAppearance = {
  editor: 'seo',
  parameters: {
    fields: ['title', 'description', 'image'],
    previews: ['google', 'twitter', 'facebook']
  }
};
```
</details>

<details>
<summary><strong>Video Field</strong></summary>

**Value Type:** Complex object with video provider data

```typescript
import {
  VideoFieldValue,
  isVideoFieldValue,
  isLocalizedVideoFieldValue,
  VideoFieldValidators,
  VideoFieldAppearance
} from '@datocms/cma-client';

// Field value
const value: VideoFieldValue = {
  provider: "youtube",
  provider_uid: "dQw4w9WgXcQ",
  url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
  title: "Video Title",
  width: 1920,
  height: 1080,
  thumbnail_url: "https://i.ytimg.com/vi/dQw4w9WgXcQ/maxresdefault.jpg"
};

// Type guards
isVideoFieldValue(value); // boolean
isLocalizedVideoFieldValue(localizedValue); // boolean

// Validators
const validators: VideoFieldValidators = {
  required: { message: "Video is required" }
};

// Appearance
const appearance: VideoFieldAppearance = {
  editor: 'video',
  parameters: {}
};
```
</details>

#### Asset Fields

<details>
<summary><strong>File Field</strong></summary>

**Value Types:**
- `FileFieldValue` - Response format with all metadata
- `FileFieldValueAsRequest` - Request format with optional metadata

```typescript
import {
  FileFieldValue,
  FileFieldValueAsRequest,
  isFileFieldValue,
  isFileFieldValueAsRequest,
  isLocalizedFileFieldValue,
  FileFieldValidators,
  FileFieldAppearance
} from '@datocms/cma-client';

// Response format (from API)
const responseValue: FileFieldValue = {
  upload_id: "Ndugz4zKRq2RRg5NV8xDxw",
  alt: "Image description",      // Always present
  title: "Image title",           // Always present
  custom_data: { key: "value" },  // Always present
  focal_point: { x: 0.5, y: 0.5 } // Always present
};

// Request format (to API)
const requestValue: FileFieldValueAsRequest = {
  upload_id: "Ndugz4zKRq2RRg5NV8xDxw",
  alt: "Image description"  // Optional
  // Other fields can be omitted
};

// Type guards
isFileFieldValue(responseValue); // true
isFileFieldValueAsRequest(requestValue); // true

// Validators
const validators: FileFieldValidators = {
  required: { message: "File is required" },
  file_size: { min_value: 1024, max_value: 10485760 },
  image_dimensions: {
    min_width: 100,
    max_width: 4000,
    min_height: 100,
    max_height: 4000
  },
  required_alt_title: { alt: true, title: false }
};
```
</details>

<details>
<summary><strong>Gallery Field</strong></summary>

**Value Types:**
- `GalleryFieldValue` - Array of files with all metadata
- `GalleryFieldValueAsRequest` - Array with optional metadata

```typescript
import {
  GalleryFieldValue,
  GalleryFieldValueAsRequest,
  isGalleryFieldValue,
  isGalleryFieldValueAsRequest,
  GalleryFieldValidators,
  GalleryFieldAppearance
} from '@datocms/cma-client';

// Response format (from API)
const responseValue: GalleryFieldValue = [
  {
    upload_id: "Ndugz4zKRq2RRg5NV8xDxw",
    alt: null,
    title: null,
    custom_data: {},
    focal_point: null
  },
  {
    upload_id: "SjYCiRY1Q4OqycXjvr4BnQ",
    alt: "Second image",
    title: "Title",
    custom_data: {},
    focal_point: { x: 0.3, y: 0.7 }
  }
];

// Request format (to API)
const requestValue: GalleryFieldValueAsRequest = [
  { upload_id: "Ndugz4zKRq2RRg5NV8xDxw" },  // Minimal
  {
    upload_id: "SjYCiRY1Q4OqycXjvr4BnQ",
    alt: "Second image"  // With some metadata
  }
];

// Validators
const validators: GalleryFieldValidators = {
  size: { min: 1, max: 20 },
  file_size: { max_value: 5242880 }
};
```
</details>

#### Reference Fields

<details>
<summary><strong>Link Field</strong></summary>

**Value Type:** `string | null` (record ID)

```typescript
import {
  LinkFieldValue,
  isLinkFieldValue,
  isLocalizedLinkFieldValue,
  LinkFieldValidators,
  LinkFieldAppearance
} from '@datocms/cma-client';

// Field value
const value: LinkFieldValue = "record_id_123";

// Type guards
isLinkFieldValue(value); // boolean
isLocalizedLinkFieldValue(localizedValue); // boolean

// Validators
const validators: LinkFieldValidators = {
  required: { message: "Link is required" },
  item_item_type: {
    item_types: ["blog_post", "author"]
  },
  unique: {}
};

// Appearance
const appearance: LinkFieldAppearance = {
  editor: 'link_select',
  parameters: { size: 'small' }
};
```
</details>

<details>
<summary><strong>Links Field</strong></summary>

**Value Type:** `string[]` (array of record IDs)

```typescript
import {
  LinksFieldValue,
  isLinksFieldValue,
  isLocalizedLinksFieldValue,
  LinksFieldValidators,
  LinksFieldAppearance
} from '@datocms/cma-client';

// Field value
const value: LinksFieldValue = ["record_1", "record_2", "record_3"];

// Type guards
isLinksFieldValue(value); // boolean
isLocalizedLinksFieldValue(localizedValue); // boolean

// Validators
const validators: LinksFieldValidators = {
  size: { min: 1, max: 10 },
  items_item_type: {
    item_types: ["category", "tag"]
  }
};

// Appearance
const appearance: LinksFieldAppearance = {
  editor: 'links_select',
  parameters: { size: 'medium' }
};
```
</details>

#### Block Fields

These field types support embedded content blocks and have special handling for nested data:

<details>
<summary><strong>Single Block Field</strong></summary>

**Value Types:**
- `SingleBlockFieldValue` - Block as string ID
- `SingleBlockFieldValueAsRequest` - Block as ID or object
- `SingleBlockFieldValueWithNestedBlocks` - Full block object

```typescript
import {
  SingleBlockFieldValue,
  SingleBlockFieldValueAsRequest,
  SingleBlockFieldValueWithNestedBlocks,
  isSingleBlockFieldValue,
  isSingleBlockFieldValueAsRequest,
  isSingleBlockFieldValueWithNestedBlocks,
  SingleBlockFieldValidators,
  SingleBlockFieldAppearance
} from '@datocms/cma-client';

// Regular API response (block as ID)
const value: SingleBlockFieldValue = "G6ZlqIXgS4SPoZOhUMiWsg";

// Request format (flexible)
const requestValue: SingleBlockFieldValueAsRequest =
  "G6ZlqIXgS4SPoZOhUMiWsg" |  // Reference existing
  {                 // Update existing
    id: "G6ZlqIXgS4SPoZOhUMiWsg",
    type: "item",
    attributes: { title: "Updated" },
    relationships: { /* ... */ }
  } |
  {                 // Create new
    type: "item",
    attributes: { title: "New Block" },
    relationships: { /* ... */ }
  };

// Nested response (?nested=true)
const nestedValue: SingleBlockFieldValueWithNestedBlocks = {
  id: "G6ZlqIXgS4SPoZOhUMiWsg",
  type: "item",
  attributes: {
    title: "Block Title",
    // Block can contain other blocks
    content: ["nested_ZG20ttUATgysumFNKTZisQ", "nested_SW1GFD4JRkOVlg9nvHCSuQ"]
  },
  relationships: { /* ... */ },
  meta: { /* ... */ }
};

// Type guards
isSingleBlockFieldValue(value); // true for string IDs
isSingleBlockFieldValueAsRequest(requestValue); // true for flexible format
isSingleBlockFieldValueWithNestedBlocks(nestedValue); // true for full objects

// Validators
const validators: SingleBlockFieldValidators = {
  required: { message: "Block is required" },
  single_block_blocks: {
    item_types: ["cta_block", "hero_block"]
  }
};
```
</details>

<details>
<summary><strong>Modular Content (Rich Text) Field</strong></summary>

**Value Types:**
- `RichTextFieldValue` - Array of block IDs
- `RichTextFieldValueAsRequest` - Array of IDs or objects
- `RichTextFieldValueWithNestedBlocks` - Array of full objects

```typescript
import {
  RichTextFieldValue,
  RichTextFieldValueAsRequest,
  RichTextFieldValueWithNestedBlocks,
  isRichTextFieldValue,
  isRichTextFieldValueAsRequest,
  isRichTextFieldValueWithNestedBlocks,
  RichTextFieldValidators,
  RichTextFieldAppearance
} from '@datocms/cma-client';

// Regular API response (blocks as IDs)
const value: RichTextFieldValue = ["ZG20ttUATgysumFNKTZisQ", "SW1GFD4JRkOVlg9nvHCSuQ", "G6ZlqIXgS4SPoZOhUMiWsg"];

// Request format (flexible mix)
const requestValue: RichTextFieldValueAsRequest = [
  "ZG20ttUATgysumFNKTZisQ",                    // Keep existing
  {                             // Update existing
    id: "SW1GFD4JRkOVlg9nvHCSuQ",
    type: "item",
    attributes: { /* updated */ },
    relationships: { /* ... */ }
  },
  {                             // Create new
    type: "item",
    attributes: { /* new block */ },
    relationships: { /* ... */ }
  }
];

// Nested response (?nested=true)
const nestedValue: RichTextFieldValueWithNestedBlocks = [
  {
    id: "ZG20ttUATgysumFNKTZisQ",
    type: "item",
    attributes: {
      title: "Text Block",
      // Blocks can contain other nested blocks
      embedded_gallery: ["Ndugz4zKRq2RRg5NV8xDxw", "SjYCiRY1Q4OqycXjvr4BnQ"]
    },
    relationships: { /* ... */ },
    meta: { /* ... */ }
  },
  // ... more full block objects
];

// Validators
const validators: RichTextFieldValidators = {
  size: { min: 1, max: 20 },
  rich_text_blocks: {
    item_types: ["RbsvlsUxRx2H47xdo70O3A", "G7r2SYDGTpKCS1Na31_tjQ", "c01GlXRMQPiVqBpwWNRY4A"]
  }
};
```
</details>

<details>
<summary><strong>Structured Text Field</strong></summary>

**Value Types:**
- `StructuredTextFieldValue` - Document with block IDs
- `StructuredTextFieldValueAsRequest` - Document with flexible blocks
- `StructuredTextFieldValueWithNestedBlocks` - Document with full blocks

```typescript
import {
  StructuredTextFieldValue,
  StructuredTextFieldValueAsRequest,
  StructuredTextFieldValueWithNestedBlocks,
  isStructuredTextFieldValue,
  isStructuredTextFieldValueAsRequest,
  isStructuredTextFieldValueWithNestedBlocks,
  StructuredTextFieldValidators,
  StructuredTextFieldAppearance
} from '@datocms/cma-client';
import { Document } from 'datocms-structured-text-utils';

// Regular API response (blocks as IDs in document)
const value: StructuredTextFieldValue = {
  schema: 'dast',
  document: {
    type: 'root',
    children: [
      {
        type: 'paragraph',
        children: [
          { type: 'span', value: 'Text' },
          {
            type: 'inlineBlock',
            item: 'SIzhcsTxQ5quS71_Oly66Q'  // Inline block as ID
          },
        ]
      },
      {
        type: 'block',
        item: 'G6ZlqIXgS4SPoZOhUMiWsg'  // Block as ID
      }
    ]
  }
};

// Request format (flexible block representation)
const requestValue: StructuredTextFieldValueAsRequest = {
  schema: 'dast',
  document: {
    type: 'root',
    children: [
      {
        type: 'block',
        item: 'G6ZlqIXgS4SPoZOhUMiWsg'  // Reference
      },
      {
        type: 'block',
        item: {  // New block
          type: 'item',
          attributes: { /* ... */ },
          relationships: { /* ... */ }
        }
      }
    ]
  }
};

// Nested response (?nested=true)
const nestedValue: StructuredTextFieldValueWithNestedBlocks = {
  schema: 'dast',
  document: {
    type: 'root',
    children: [
      {
        type: 'block',
        item: {  // Full block object
          id: 'G6ZlqIXgS4SPoZOhUMiWsg',
          type: 'item',
          attributes: {
            title: 'Embedded Block',
            // Can contain nested structured text
            content: { /* nested document */ }
          },
          relationships: { /* ... */ },
          meta: { /* ... */ }
        }
      }
    ]
  }
};

// Type guards for different variants
isStructuredTextFieldValue(value); // Blocks as IDs
isStructuredTextFieldValueAsRequest(requestValue); // Flexible
isStructuredTextFieldValueWithNestedBlocks(nestedValue); // Full objects

// Validators
const validators: StructuredTextFieldValidators = {
  structured_text_blocks: {
    item_types: ["RbsvlsUxRx2H47xdo70O3A", "c01GlXRMQPiVqBpwWNRY4A"]
  },
  structured_text_links: {
    item_types: ["TlvicMqCRJSalMO4sQ7vcQ", "SIzhcsTxQ5quS71_Oly66Q"]
  },
  structured_text_inline_blocks: {
    item_types: ["CNHd69K8SDGjmNecUaCJ0g", "EULvtyAzS8CFBrEFo89qOw"]
  },
  length: { min: 100, max: 5000 }
};
```
</details>

### Working with Localized Fields

All field types support localization. When a field is configured as localized, its value becomes an object with locale codes as keys:

```typescript
import {
  LocalizedFieldValue,
  isLocalizedFieldValue,
  StringFieldValue,
  isLocalizedStringFieldValue
} from '@datocms/cma-client';

// Non-localized field
const simpleTitle: StringFieldValue = "Hello";

// Localized field
const localizedTitle: LocalizedFieldValue<StringFieldValue> = {
  en: "Hello",
  it: "Ciao",
  es: "Hola"
};

// Generic localization check
if (isLocalizedFieldValue(value)) {
  // value is { [locale: string]: unknown }
  Object.entries(value).forEach(([locale, localeValue]) => {
    console.log(`${locale}: ${localeValue}`);
  });
}

// Type-specific localization check
if (isLocalizedStringFieldValue(value)) {
  // value is { [locale: string]: string | null }
  const englishValue = value.en;  // string | null
}
```

### Advanced Type Usage

#### Generic Field Value Handling

When working with fields dynamically, you can use the type guards to narrow types:

```typescript
import { Field } from '@datocms/cma-client';

function processFieldValue(field: Field, value: unknown) {
  switch (field.attributes.field_type) {
    case 'string':
      if (isStringFieldValue(value)) {
        // value is string | null
        return value?.toUpperCase();
      }
      break;

    case 'structured_text':
      if (isStructuredTextFieldValueWithNestedBlocks(value)) {
        // value is StructuredTextFieldValueWithNestedBlocks
        // Process nested blocks...
      }
      break;

    case 'file':
      if (isFileFieldValueAsRequest(value)) {
        // value is FileFieldValueAsRequest
        // Handle file upload...
      }
      break;
  }
}
```

#### TypeScript Generics with Field Types

Many field types support generics for stronger typing with your content models:

```typescript
import {
  SingleBlockFieldValueAsRequest,
  RichTextFieldValueWithNestedBlocks,
  ItemDefinition
} from '@datocms/cma-client';

// Define your block types
interface TextBlock extends ItemDefinition {
  attributes: {
    title: string;
    content: string;
  };
}

interface ImageBlock extends ItemDefinition {
  attributes: {
    image: string;
    caption?: string;
  };
}

// Use with field types
type MyBlockRequest = SingleBlockFieldValueAsRequest<TextBlock | ImageBlock>;
type MyModularContent = RichTextFieldValueWithNestedBlocks<TextBlock | ImageBlock>;
```

#### Request/Response Transformation

When working with fields that have different request/response formats:

```typescript
import {
  FileFieldValue,
  FileFieldValueAsRequest,
  isFileFieldValue
} from '@datocms/cma-client';

// Transform response to request format
function prepareFileForUpdate(file: FileFieldValue): FileFieldValueAsRequest {
  if (!file) return null;

  // Only include fields that need updating
  return {
    upload_id: file.upload_id,
    alt: file.alt,
    // Omit unchanged fields
  };
}

// Handle API response
async function handleFileResponse(value: unknown) {
  if (isFileFieldValue(value)) {
    // value has all metadata fields with defaults
    console.log(value.alt);         // string | null
    console.log(value.custom_data); // Record<string, unknown>
  }
}
```

### Best Practices

1. **Always use type guards for runtime validation** when receiving data from external sources:
   ```typescript
   if (!isStructuredTextFieldValue(apiResponse.content)) {
     throw new Error('Invalid structured text format');
   }
   ```

2. **Prefer specific type variants** over generic `unknown`:
   ```typescript
   // Good
   const content: StructuredTextFieldValue = record.attributes.content;

   // Avoid
   const content: unknown = record.attributes.content;
   ```

3. **Use request types when building API payloads** to avoid unnecessary fields:
   ```typescript
   const payload: FileFieldValueAsRequest = {
     upload_id: "Ndugz4zKRq2RRg5NV8xDxw"
     // Don't include unchanged metadata
   };
   ```

4. **Handle both localized and non-localized fields** with normalized utilities:
   ```typescript
   import { mapNormalizedFieldValues } from '@datocms/cma-client';

   const processed = mapNormalizedFieldValues(
     field,
     value,
     (locale, val) => processValue(val)
   );
   ```

5. **Use nested block types for complex content operations**:
   ```typescript
   // When you need to traverse nested content
   const response = await client.items.list({
     nested: true  // Get full block objects
   });

   if (isStructuredTextFieldValueWithNestedBlocks(response.content)) {
     // Can now access nested block attributes directly
   }
   ```

## Contributing

Bug reports and pull requests are welcome on GitHub at https://github.com/datocms/js-rest-api-clients. This project is intended to be a safe, welcoming space for collaboration, and contributors are expected to adhere to the [Contributor Covenant](http://contributor-covenant.org) code of conduct.

## License

The package is available as open source under the terms of the [MIT License](http://opensource.org/licenses/MIT).