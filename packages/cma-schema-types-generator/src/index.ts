/**
 * Schema Types Generator
 *
 * This module provides utilities for generating TypeScript type definitions from DatoCMS schemas.
 * It fetches schema information from the DatoCMS API and creates strongly-typed interfaces
 * that can be used for type-safe content management and migration scripts.
 *
 * The generator supports:
 * - Full schema type generation with imports (for general use)
 * - Migration-specific type generation without imports (for inline migration scripts)
 * - Filtering by specific item types with automatic dependency resolution
 * - Support for localized fields, rich text, structured text, and block fields
 * - Virtual fields for sortable and tree models
 */

import type { Client, RawApiTypes } from '@datocms/cma-client';
// Prettier v3 is ESM-only and cannot be `require()`-d from a CJS build
// (which is what Jest's runtime uses). `@prettier/sync` is the official
// CJS-compatible synchronous wrapper that runs prettier in a worker.
import prettier from '@prettier/sync';
import * as ts from 'typescript';

export interface SchemaTypesGeneratorOptions {
  itemTypesFilter?: string;
}

/**
 * Generates complete TypeScript schema definitions with imports.
 * Used for generating standalone schema files.
 *
 * Example generated code:
 * ```typescript
 * import type { ItemTypeDefinition } from '@datocms/cma-client';
 *
 * type EnvironmentSettings = {
 *   locales: 'en' | 'it';
 * };
 *
 * export type BlogPost = ItemTypeDefinition<
 *   EnvironmentSettings,
 *   '12345',
 *   {
 *     title: { type: 'string'; localized: true; };
 *     content: { type: 'rich_text'; blocks: Hero; };
 *   }
 * >;
 *
 * export type Hero = ItemTypeDefinition<...>;
 *
 * export type AnyBlock = Hero;
 * export type AnyModel = BlogPost;
 * export type AnyBlockOrModel = AnyBlock | AnyModel;
 * ```
 */
export async function generateSchemaTypes(
  client: Client,
  options: SchemaTypesGeneratorOptions = {},
): Promise<string> {
  const response = await client.site.rawFind({
    include: 'item_types,item_types.fields',
  });

  const { data } = response;
  const included = response.included || [];

  const locales = data.attributes.locales;
  const allItemTypes = included.filter(
    (item): item is RawApiTypes.ItemType => item.type === 'item_type',
  );
  const allFields = included.filter(
    (item): item is RawApiTypes.Field => item.type === 'field',
  );

  const { itemTypes, fields } = filterItemTypesAndFields(
    allItemTypes,
    allFields,
    options.itemTypesFilter,
  );

  const generatedCode = generateTypeDefinitions(
    itemTypes,
    fields,
    locales,
    '@datocms/cma-client',
  );

  return prettier.format(generatedCode, {
    parser: 'typescript',
    singleQuote: true,
    trailingComma: 'all',
  });
}

/**
 * Generates TypeScript schema definitions without imports.
 * Used for inline type definitions in migration scripts.
 *
 * Example generated code:
 * ```typescript
 * type EnvironmentSettings = {
 *   locales: 'en' | 'it';
 * };
 *
 * export type BlogPost = ItemTypeDefinition<
 *   EnvironmentSettings,
 *   '12345',
 *   {
 *     title: { type: 'string'; localized: true; };
 *     content: { type: 'rich_text'; blocks: Hero; };
 *   }
 * >;
 *
 * export type Hero = ItemTypeDefinition<...>;
 *
 * export type AnyBlock = Hero;
 * export type AnyModel = BlogPost;
 * export type AnyBlockOrModel = AnyBlock | AnyModel;
 * ```
 */
export async function generateSchemaTypesForMigration(
  client: Client,
  options: SchemaTypesGeneratorOptions = {},
): Promise<string> {
  const { data, included } = await client.site.rawFind({
    include: 'item_types,item_types.fields',
  });

  if (!included) {
    throw new Error('This should not happen');
  }

  const locales = data.attributes.locales;
  const allItemTypes = included.filter(
    (item): item is RawApiTypes.ItemType => item.type === 'item_type',
  );
  const allFields = included.filter(
    (item): item is RawApiTypes.Field => item.type === 'field',
  );

  const { itemTypes, fields } = filterItemTypesAndFields(
    allItemTypes,
    allFields,
    options.itemTypesFilter,
  );

  const generatedCode = generateTypeDefinitionsOnly(itemTypes, fields, locales);

  return prettier.format(generatedCode, {
    parser: 'typescript',
    singleQuote: true,
    trailingComma: 'all',
  });
}

function toPascalCase(str: string): string {
  return str
    .split(/[-_]/)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join('');
}

/**
 * Creates a virtual field property for sortable/tree models.
 *
 * Example generated code:
 * ```typescript
 * position: {
 *   type: 'integer';
 * }
 * ```
 */
function createVirtualFieldProperty(
  fieldName: string,
  fieldType: string,
): ts.PropertySignature {
  return ts.factory.createPropertySignature(
    undefined,
    ts.factory.createIdentifier(fieldName),
    undefined,
    ts.factory.createTypeLiteralNode([
      ts.factory.createPropertySignature(
        undefined,
        ts.factory.createIdentifier('type'),
        undefined,
        ts.factory.createLiteralTypeNode(
          ts.factory.createStringLiteral(fieldType),
        ),
      ),
    ]),
  );
}

/**
 * Creates a union type for block references in rich text, structured text, or single block fields.
 *
 * Example generated code:
 * ```typescript
 * // For multiple blocks:
 * Hero | CallToAction | Testimonial
 *
 * // For single block:
 * Hero
 *
 * // For no blocks:
 * never
 * ```
 */
function createBlocksUnion(
  itemTypeIds: string[],
  itemTypeIdToTypeName: Map<string, string>,
): ts.TypeNode {
  if (itemTypeIds.length === 0) {
    return ts.factory.createKeywordTypeNode(ts.SyntaxKind.NeverKeyword);
  }

  const validTypeNames = itemTypeIds
    .map((id) => itemTypeIdToTypeName.get(id))
    .filter((name): name is string => Boolean(name));

  if (validTypeNames.length === 0) {
    return ts.factory.createKeywordTypeNode(ts.SyntaxKind.NeverKeyword);
  }

  if (validTypeNames.length === 1) {
    return ts.factory.createTypeReferenceNode(
      ts.factory.createIdentifier(validTypeNames[0]!),
    );
  }

  return ts.factory.createUnionTypeNode(
    validTypeNames.map((typeName) =>
      ts.factory.createTypeReferenceNode(ts.factory.createIdentifier(typeName)),
    ),
  );
}

/**
 * Maps a DatoCMS field to its TypeScript type definition.
 *
 * Example generated code:
 * ```typescript
 * // For rich_text field:
 * {
 *   type: 'rich_text';
 *   blocks: Hero | CallToAction;
 * }
 *
 * // For structured_text field:
 * {
 *   type: 'structured_text';
 *   blocks: Hero;
 *   inline_blocks: CallToAction;
 * }
 *
 * // For regular field:
 * {
 *   type: 'string';
 * }
 *
 * // For localized field:
 * {
 *   type: 'string';
 *   localized: true;
 * }
 * ```
 */
function mapFieldType(
  field: RawApiTypes.Field,
  itemTypeIdToTypeName: Map<string, string>,
): ts.TypeNode {
  let baseType: ts.TypeNode;

  switch (field.attributes.field_type) {
    case 'rich_text':
      baseType = ts.factory.createTypeLiteralNode([
        ts.factory.createPropertySignature(
          undefined,
          ts.factory.createIdentifier('type'),
          undefined,
          ts.factory.createLiteralTypeNode(
            ts.factory.createStringLiteral('rich_text'),
          ),
        ),
        ts.factory.createPropertySignature(
          undefined,
          ts.factory.createIdentifier('blocks'),
          undefined,
          createBlocksUnion(
            field.attributes.validators.rich_text_blocks.item_types,
            itemTypeIdToTypeName,
          ),
        ),
      ]);
      break;

    case 'structured_text': {
      const properties = [
        ts.factory.createPropertySignature(
          undefined,
          ts.factory.createIdentifier('type'),
          undefined,
          ts.factory.createLiteralTypeNode(
            ts.factory.createStringLiteral('structured_text'),
          ),
        ),
      ];

      if (
        field.attributes.validators.structured_text_blocks.item_types.length > 0
      ) {
        properties.push(
          ts.factory.createPropertySignature(
            undefined,
            ts.factory.createIdentifier('blocks'),
            undefined,
            createBlocksUnion(
              field.attributes.validators.structured_text_blocks.item_types,
              itemTypeIdToTypeName,
            ),
          ),
        );
      }

      if (
        (field.attributes.validators.structured_text_inline_blocks?.item_types
          .length ?? 0) > 0
      ) {
        properties.push(
          ts.factory.createPropertySignature(
            undefined,
            ts.factory.createIdentifier('inline_blocks'),
            undefined,
            createBlocksUnion(
              field.attributes.validators.structured_text_inline_blocks!
                .item_types,
              itemTypeIdToTypeName,
            ),
          ),
        );
      }

      baseType = ts.factory.createTypeLiteralNode(properties);
      break;
    }

    case 'single_block':
      baseType = ts.factory.createTypeLiteralNode([
        ts.factory.createPropertySignature(
          undefined,
          ts.factory.createIdentifier('type'),
          undefined,
          ts.factory.createLiteralTypeNode(
            ts.factory.createStringLiteral('single_block'),
          ),
        ),
        ts.factory.createPropertySignature(
          undefined,
          ts.factory.createIdentifier('blocks'),
          undefined,
          createBlocksUnion(
            field.attributes.validators.single_block_blocks.item_types,
            itemTypeIdToTypeName,
          ),
        ),
      ]);
      break;

    default:
      baseType = ts.factory.createTypeLiteralNode([
        ts.factory.createPropertySignature(
          undefined,
          ts.factory.createIdentifier('type'),
          undefined,
          ts.factory.createLiteralTypeNode(
            ts.factory.createStringLiteral(field.attributes.field_type),
          ),
        ),
      ]);
  }

  if (field.attributes.localized) {
    const properties = Array.from(
      (baseType as ts.TypeLiteralNode).members,
    ) as ts.PropertySignature[];

    properties.push(
      ts.factory.createPropertySignature(
        undefined,
        ts.factory.createIdentifier('localized'),
        undefined,
        ts.factory.createLiteralTypeNode(ts.factory.createTrue()),
      ),
    );

    return ts.factory.createTypeLiteralNode(properties);
  }

  return baseType;
}

/**
 * Creates the field definitions object for an item type.
 *
 * Example generated code:
 * ```typescript
 * {
 *   title: {
 *     type: 'string';
 *     localized: true;
 *   };
 *   content: {
 *     type: 'rich_text';
 *     blocks: Hero | CallToAction;
 *   };
 *   position: {
 *     type: 'integer';
 *   }; // Virtual field for sortable models
 * }
 * ```
 */
function createFieldDefinitions(
  fields: RawApiTypes.Field[],
  itemTypeIdToTypeName: Map<string, string>,
  itemType: RawApiTypes.ItemType,
): ts.TypeLiteralNode {
  const properties: ts.PropertySignature[] = [];

  for (const field of fields) {
    const fieldType = mapFieldType(field, itemTypeIdToTypeName);
    const property = ts.factory.createPropertySignature(
      undefined,
      ts.factory.createIdentifier(field.attributes.api_key),
      undefined,
      fieldType,
    );
    properties.push(property);
  }

  if (itemType.attributes.sortable || itemType.attributes.tree) {
    properties.push(createVirtualFieldProperty('position', 'integer'));
  }

  if (itemType.attributes.tree) {
    properties.push(createVirtualFieldProperty('parent_id', 'string'));
  }

  return ts.factory.createTypeLiteralNode(properties);
}

/**
 * Creates lookup maps from raw API data for efficient field and type name resolution.
 *
 * Returns:
 * - fieldsByItemType: Maps item type ID → array of its fields
 * - itemTypeIdToTypeName: Maps item type ID → PascalCase type name
 */
function createMapsFromData(
  itemTypes: RawApiTypes.ItemType[],
  fields: RawApiTypes.Field[],
): {
  fieldsByItemType: Map<string, RawApiTypes.Field[]>;
  itemTypeIdToTypeName: Map<string, string>;
} {
  const fieldsByItemType = new Map<string, RawApiTypes.Field[]>();
  const itemTypeIdToTypeName = new Map<string, string>();

  for (const itemType of itemTypes) {
    itemTypeIdToTypeName.set(
      itemType.id,
      toPascalCase(itemType.attributes.api_key),
    );
  }

  for (const field of fields) {
    const itemTypeId = field.relationships.item_type.data.id;
    if (!fieldsByItemType.has(itemTypeId)) {
      fieldsByItemType.set(itemTypeId, []);
    }
    fieldsByItemType.get(itemTypeId)!.push(field);
  }

  return { fieldsByItemType, itemTypeIdToTypeName };
}

/**
 * Creates the EnvironmentSettings type definition.
 *
 * Example generated code:
 * ```typescript
 * type EnvironmentSettings = {
 *   locales: 'en' | 'it' | 'fr';
 * };
 * ```
 */
function createEnvironmentSettingsType(
  locales: string[],
): ts.TypeAliasDeclaration {
  const localeUnion = ts.factory.createUnionTypeNode(
    locales.map((locale) =>
      ts.factory.createLiteralTypeNode(ts.factory.createStringLiteral(locale)),
    ),
  );

  return ts.factory.createTypeAliasDeclaration(
    undefined,
    ts.factory.createIdentifier('EnvironmentSettings'),
    undefined,
    ts.factory.createTypeLiteralNode([
      ts.factory.createPropertySignature(
        undefined,
        ts.factory.createIdentifier('locales'),
        undefined,
        localeUnion,
      ),
    ]),
  );
}

/**
 * Creates individual item type declarations.
 *
 * Example generated code:
 * ```typescript
 * export type BlogPost = ItemTypeDefinition<
 *   EnvironmentSettings,
 *   '12345',
 *   {
 *     title: {
 *       type: 'string';
 *       localized: true;
 *     };
 *     content: {
 *       type: 'rich_text';
 *       blocks: Hero | CallToAction;
 *     };
 *   }
 * >;
 * ```
 */
function createItemTypeDeclarations(
  itemTypes: RawApiTypes.ItemType[],
  fieldsByItemType: Map<string, RawApiTypes.Field[]>,
  itemTypeIdToTypeName: Map<string, string>,
): ts.TypeAliasDeclaration[] {
  const declarations: ts.TypeAliasDeclaration[] = [];

  for (const itemType of itemTypes) {
    const itemTypeFields = fieldsByItemType.get(itemType.id) || [];
    const fieldDefinitions = createFieldDefinitions(
      itemTypeFields,
      itemTypeIdToTypeName,
      itemType,
    );

    const typeDeclaration = ts.factory.createTypeAliasDeclaration(
      [ts.factory.createToken(ts.SyntaxKind.ExportKeyword)],
      ts.factory.createIdentifier(toPascalCase(itemType.attributes.api_key)),
      undefined,
      ts.factory.createTypeReferenceNode(
        ts.factory.createIdentifier('ItemTypeDefinition'),
        [
          ts.factory.createTypeReferenceNode(
            ts.factory.createIdentifier('EnvironmentSettings'),
          ),
          ts.factory.createLiteralTypeNode(
            ts.factory.createStringLiteral(itemType.id),
          ),
          fieldDefinitions,
        ],
      ),
    );

    declarations.push(typeDeclaration);
  }

  return declarations;
}

/**
 * Creates the paired `export const X = { ID, REF } as const` declarations.
 * Each declaration merges with the same-named type alias so consumers can
 * use `Schema.X` in both type and value position.
 *
 * Example generated code:
 * ```typescript
 * export const BlogPost = {
 *   ID: '12345',
 *   REF: { type: 'item_type', id: '12345' },
 * } as const;
 * ```
 */
function createItemTypeConstDeclarations(
  itemTypes: RawApiTypes.ItemType[],
): ts.VariableStatement[] {
  return itemTypes.map((itemType) => {
    const idLiteral = ts.factory.createStringLiteral(itemType.id);
    const refObject = ts.factory.createObjectLiteralExpression(
      [
        ts.factory.createPropertyAssignment(
          'type',
          ts.factory.createStringLiteral('item_type'),
        ),
        ts.factory.createPropertyAssignment(
          'id',
          ts.factory.createStringLiteral(itemType.id),
        ),
      ],
      false,
    );

    const objectLiteral = ts.factory.createObjectLiteralExpression(
      [
        ts.factory.createPropertyAssignment('ID', idLiteral),
        ts.factory.createPropertyAssignment('REF', refObject),
      ],
      true,
    );

    const asConst = ts.factory.createAsExpression(
      objectLiteral,
      ts.factory.createTypeReferenceNode(
        ts.factory.createIdentifier('const'),
        undefined,
      ),
    );

    return ts.factory.createVariableStatement(
      [ts.factory.createToken(ts.SyntaxKind.ExportKeyword)],
      ts.factory.createVariableDeclarationList(
        [
          ts.factory.createVariableDeclaration(
            ts.factory.createIdentifier(
              toPascalCase(itemType.attributes.api_key),
            ),
            undefined,
            undefined,
            asConst,
          ),
        ],
        ts.NodeFlags.Const,
      ),
    );
  });
}

/**
 * Creates the AnyBlock, AnyModel, and AnyBlockOrModel union types.
 *
 * Example generated code:
 * ```typescript
 * export type AnyBlock = Hero | CallToAction | Testimonial;
 * export type AnyModel = BlogPost | Author | Category;
 * export type AnyBlockOrModel = AnyBlock | AnyModel;
 * ```
 */
function createUnionTypes(
  itemTypes: RawApiTypes.ItemType[],
): ts.TypeAliasDeclaration[] {
  const blockTypeNames: string[] = [];
  const modelTypeNames: string[] = [];

  for (const itemType of itemTypes) {
    const typeName = toPascalCase(itemType.attributes.api_key);
    if (itemType.attributes.modular_block) {
      blockTypeNames.push(typeName);
    } else {
      modelTypeNames.push(typeName);
    }
  }

  const anyBlockType = ts.factory.createTypeAliasDeclaration(
    [ts.factory.createToken(ts.SyntaxKind.ExportKeyword)],
    ts.factory.createIdentifier('AnyBlock'),
    undefined,
    blockTypeNames.length > 0
      ? blockTypeNames.length === 1
        ? ts.factory.createTypeReferenceNode(
            ts.factory.createIdentifier(blockTypeNames[0]!),
          )
        : ts.factory.createUnionTypeNode(
            blockTypeNames.map((typeName) =>
              ts.factory.createTypeReferenceNode(
                ts.factory.createIdentifier(typeName),
              ),
            ),
          )
      : ts.factory.createKeywordTypeNode(ts.SyntaxKind.NeverKeyword),
  );

  const anyModelType = ts.factory.createTypeAliasDeclaration(
    [ts.factory.createToken(ts.SyntaxKind.ExportKeyword)],
    ts.factory.createIdentifier('AnyModel'),
    undefined,
    modelTypeNames.length > 0
      ? modelTypeNames.length === 1
        ? ts.factory.createTypeReferenceNode(
            ts.factory.createIdentifier(modelTypeNames[0]!),
          )
        : ts.factory.createUnionTypeNode(
            modelTypeNames.map((typeName) =>
              ts.factory.createTypeReferenceNode(
                ts.factory.createIdentifier(typeName),
              ),
            ),
          )
      : ts.factory.createKeywordTypeNode(ts.SyntaxKind.NeverKeyword),
  );

  const anyBlockOrModelType = ts.factory.createTypeAliasDeclaration(
    [ts.factory.createToken(ts.SyntaxKind.ExportKeyword)],
    ts.factory.createIdentifier('AnyBlockOrModel'),
    undefined,
    ts.factory.createUnionTypeNode([
      ts.factory.createTypeReferenceNode(
        ts.factory.createIdentifier('AnyBlock'),
      ),
      ts.factory.createTypeReferenceNode(
        ts.factory.createIdentifier('AnyModel'),
      ),
    ]),
  );

  return [anyBlockType, anyModelType, anyBlockOrModelType];
}

/**
 * Prints TypeScript AST nodes to formatted string output.
 *
 * Example generated code:
 * ```typescript
 * import type { ItemTypeDefinition } from '@datocms/cma-client';
 *
 * type EnvironmentSettings = {
 *   locales: 'en' | 'it';
 * };
 *
 * export type BlogPost = ItemTypeDefinition<...>;
 * export type Hero = ItemTypeDefinition<...>;
 *
 * export type AnyBlock = Hero;
 * export type AnyModel = BlogPost;
 * export type AnyBlockOrModel = AnyBlock | AnyModel;
 * ```
 */
function printTypeDeclarations(parts: {
  importDeclaration?: ts.ImportDeclaration;
  environmentSettingsType: ts.TypeAliasDeclaration;
  itemTypeDeclarations: ts.TypeAliasDeclaration[];
  itemTypeConstDeclarations: ts.VariableStatement[];
  unionTypes: ts.TypeAliasDeclaration[];
}): string {
  const sourceFile = ts.createSourceFile(
    'schema.ts',
    '',
    ts.ScriptTarget.Latest,
    false,
    ts.ScriptKind.TS,
  );

  const printer = ts.createPrinter({ newLine: ts.NewLineKind.LineFeed });

  // `printer.printList(MultiLine, …)` ends each rendered group with a single
  // `\n`. Joining the groups with `\n` therefore produces `\n\n` between
  // groups — i.e. a blank separator line — which is what we want between
  // top-level declarations of the generated file.
  const printGroup = (nodes: ts.Statement[]) =>
    printer.printList(
      ts.ListFormat.MultiLine,
      ts.factory.createNodeArray(nodes),
      sourceFile,
    );

  const groups: string[] = [];

  if (parts.importDeclaration) {
    groups.push(printGroup([parts.importDeclaration]));
  }
  groups.push(printGroup([parts.environmentSettingsType]));
  // Each item type emits as a (type alias, const) pair grouped together so
  // they sit on adjacent lines without a blank separator, with blank lines
  // between pairs.
  for (let i = 0; i < parts.itemTypeDeclarations.length; i++) {
    const typeDecl = parts.itemTypeDeclarations[i]!;
    const constDecl = parts.itemTypeConstDeclarations[i]!;
    groups.push(printGroup([typeDecl, constDecl]));
  }
  // The three Any* unions stay grouped together (no blank line between
  // them) since they form a single logical block.
  if (parts.unionTypes.length > 0) {
    groups.push(printGroup(parts.unionTypes));
  }

  return groups.join('\n');
}

function filterItemTypesAndFields(
  allItemTypes: RawApiTypes.ItemType[],
  allFields: RawApiTypes.Field[],
  itemTypesFilter?: string,
): {
  itemTypes: RawApiTypes.ItemType[];
  fields: RawApiTypes.Field[];
} {
  if (!itemTypesFilter) {
    return { itemTypes: allItemTypes, fields: allFields };
  }

  const requestedApiKeys = new Set(
    itemTypesFilter
      .split(',')
      .map((key) => key.trim())
      .filter(Boolean),
  );

  const itemTypeByApiKey = new Map<string, RawApiTypes.ItemType>();
  const itemTypeById = new Map<string, RawApiTypes.ItemType>();
  const fieldsByItemTypeId = new Map<string, RawApiTypes.Field[]>();

  for (const itemType of allItemTypes) {
    itemTypeByApiKey.set(itemType.attributes.api_key, itemType);
    itemTypeById.set(itemType.id, itemType);
  }

  for (const field of allFields) {
    const itemTypeId = field.relationships.item_type.data.id;
    if (!fieldsByItemTypeId.has(itemTypeId)) {
      fieldsByItemTypeId.set(itemTypeId, []);
    }
    fieldsByItemTypeId.get(itemTypeId)!.push(field);
  }

  const requiredItemTypeIds = new Set<string>();

  for (const apiKey of requestedApiKeys) {
    const itemType = itemTypeByApiKey.get(apiKey);
    if (itemType) {
      requiredItemTypeIds.add(itemType.id);
    }
  }

  const processedItemTypeIds = new Set<string>();

  const findDependencies = (itemTypeId: string) => {
    if (processedItemTypeIds.has(itemTypeId)) {
      return;
    }

    processedItemTypeIds.add(itemTypeId);
    requiredItemTypeIds.add(itemTypeId);
    const itemFields = fieldsByItemTypeId.get(itemTypeId) || [];

    for (const field of itemFields) {
      const fieldType = field.attributes.field_type;
      let dependentItemTypeIds: string[] = [];

      if (
        fieldType === 'rich_text' &&
        field.attributes.validators.rich_text_blocks
      ) {
        dependentItemTypeIds =
          field.attributes.validators.rich_text_blocks.item_types;
      } else if (fieldType === 'structured_text') {
        const blockIds =
          field.attributes.validators.structured_text_blocks?.item_types || [];
        const inlineBlockIds =
          field.attributes.validators.structured_text_inline_blocks
            ?.item_types || [];
        dependentItemTypeIds = [...blockIds, ...inlineBlockIds];
      } else if (
        fieldType === 'single_block' &&
        field.attributes.validators.single_block_blocks
      ) {
        dependentItemTypeIds =
          field.attributes.validators.single_block_blocks.item_types;
      }

      for (const depId of dependentItemTypeIds) {
        findDependencies(depId);
      }
    }
  };

  const initialIds = Array.from(requiredItemTypeIds);
  for (const itemTypeId of initialIds) {
    findDependencies(itemTypeId);
  }

  const filteredItemTypes = allItemTypes.filter((itemType) =>
    requiredItemTypeIds.has(itemType.id),
  );

  const filteredFields = allFields.filter((field) =>
    requiredItemTypeIds.has(field.relationships.item_type.data.id),
  );

  return { itemTypes: filteredItemTypes, fields: filteredFields };
}

/**
 * Internal function that generates TypeScript definitions with imports.
 *
 * Example generated code:
 * ```typescript
 * import type { ItemTypeDefinition } from '@datocms/cma-client';
 *
 * type EnvironmentSettings = { locales: 'en' | 'it'; };
 * export type BlogPost = ItemTypeDefinition<...>;
 * export type AnyBlock = Hero;
 * export type AnyModel = BlogPost;
 * export type AnyBlockOrModel = AnyBlock | AnyModel;
 * ```
 */
function generateTypeDefinitions(
  itemTypes: RawApiTypes.ItemType[],
  fields: RawApiTypes.Field[],
  locales: string[],
  importPath: string,
): string {
  const { fieldsByItemType, itemTypeIdToTypeName } = createMapsFromData(
    itemTypes,
    fields,
  );

  const importDeclaration = ts.factory.createImportDeclaration(
    undefined,
    ts.factory.createImportClause(
      true,
      undefined,
      ts.factory.createNamedImports([
        ts.factory.createImportSpecifier(
          false,
          undefined,
          ts.factory.createIdentifier('ItemTypeDefinition'),
        ),
      ]),
    ),
    ts.factory.createStringLiteral(importPath),
  );

  const environmentSettingsType = createEnvironmentSettingsType(locales);
  const itemTypeDeclarations = createItemTypeDeclarations(
    itemTypes,
    fieldsByItemType,
    itemTypeIdToTypeName,
  );
  const itemTypeConstDeclarations = createItemTypeConstDeclarations(itemTypes);
  const unionTypes = createUnionTypes(itemTypes);

  return printTypeDeclarations({
    importDeclaration,
    environmentSettingsType,
    itemTypeDeclarations,
    itemTypeConstDeclarations,
    unionTypes,
  });
}

/**
 * Internal function that generates TypeScript definitions without imports.
 *
 * Example generated code:
 * ```typescript
 * type EnvironmentSettings = { locales: 'en' | 'it'; };
 * export type BlogPost = ItemTypeDefinition<...>;
 * export type AnyBlock = Hero;
 * export type AnyModel = BlogPost;
 * export type AnyBlockOrModel = AnyBlock | AnyModel;
 * ```
 */
function generateTypeDefinitionsOnly(
  itemTypes: RawApiTypes.ItemType[],
  fields: RawApiTypes.Field[],
  locales: string[],
): string {
  const { fieldsByItemType, itemTypeIdToTypeName } = createMapsFromData(
    itemTypes,
    fields,
  );

  const environmentSettingsType = createEnvironmentSettingsType(locales);
  const itemTypeDeclarations = createItemTypeDeclarations(
    itemTypes,
    fieldsByItemType,
    itemTypeIdToTypeName,
  );
  const itemTypeConstDeclarations = createItemTypeConstDeclarations(itemTypes);
  const unionTypes = createUnionTypes(itemTypes);

  return printTypeDeclarations({
    environmentSettingsType,
    itemTypeDeclarations,
    itemTypeConstDeclarations,
    unionTypes,
  });
}
