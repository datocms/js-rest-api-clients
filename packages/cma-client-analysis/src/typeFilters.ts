import * as ts from 'typescript';

/**
 * Built-in TypeScript utility types and primitives that should not be resolved
 * or included in type extraction results.
 */
export const BUILT_IN_TYPE_NAMES = new Set([
  // TypeScript utility types
  'Partial',
  'Required',
  'Readonly',
  'Record',
  'Pick',
  'Omit',
  'Exclude',
  'Extract',
  'NonNullable',
  'ReturnType',
  'InstanceType',
  'Parameters',
  'ConstructorParameters',
  'Awaited',
  'ThisType',
  // JavaScript built-in types
  'Promise',
  'Array',
  'Map',
  'Set',
  'WeakMap',
  'WeakSet',
  'Date',
  'RegExp',
  'Error',
  'Function',
  'Object',
  'String',
  'Number',
  'Boolean',
  'Symbol',
  // Primitive types
  'string',
  'number',
  'boolean',
  'void',
  'null',
  'undefined',
  'any',
  'unknown',
  'never',
]);

/**
 * Checks if a symbol is a type parameter using TypeScript's type system.
 */
export function isTypeParameter(
  symbol: ts.Symbol | undefined,
  checker: ts.TypeChecker,
): boolean {
  if (!symbol) return false;
  const type = checker.getDeclaredTypeOfSymbol(symbol);
  return (type.flags & ts.TypeFlags.TypeParameter) !== 0;
}

/**
 * Package basenames whose declarations we treat as "own" types worth tracking
 * and (selectively) expanding. Covers both:
 * - npm hoisted layout: `/node_modules/@datocms/cma-client/...`,
 *   `/node_modules/datocms-structured-text-utils/...`
 * - monorepo dev layout (js-rest-api-clients): `/packages/cma-client/...`
 */
const TRACKED_PACKAGE_BASENAMES = [
  'cma-client',
  'cma-client-node',
  'cma-client-browser',
  'rest-client-utils',
  'dashboard-client',
  'datocms-structured-text-utils',
];

/**
 * Returns true when the given absolute source file path belongs to one of the
 * DatoCMS packages we want to follow during type extraction.
 */
export function isFromTrackedPackage(fileName: string): boolean {
  return TRACKED_PACKAGE_BASENAMES.some(
    (name) =>
      fileName.includes(`/node_modules/@datocms/${name}/`) ||
      fileName.includes(`/node_modules/${name}/`) ||
      fileName.includes(`/packages/${name}/`),
  );
}

/**
 * Check if a type name should be included in extraction results.
 * Filters out internal TypeScript names, built-in types, type parameters, and types from external packages.
 */
export function shouldIncludeTypeName(
  name: string,
  symbol: ts.Symbol | undefined,
  checker: ts.TypeChecker,
): boolean {
  if (!name || !symbol) return false;

  if (name.startsWith('__')) return false;
  if (name === '__type') return false;

  if (BUILT_IN_TYPE_NAMES.has(name)) return false;

  if (isTypeParameter(symbol, checker)) return false;

  const declarations = symbol.getDeclarations();
  if (declarations && declarations.length > 0) {
    const sourceFile = declarations[0]?.getSourceFile();
    if (sourceFile) {
      const fileName = sourceFile.fileName;
      if (
        fileName.includes('/typescript/lib/') ||
        fileName.includes('\\typescript\\lib\\')
      ) {
        return false;
      }
      if (!isFromTrackedPackage(fileName)) {
        return false;
      }
    }
  }

  return true;
}

/**
 * Check if a type is a primitive or built-in type that we should skip.
 * Used when working with resolved ts.Type objects (not AST nodes).
 */
export function isPrimitiveOrBuiltInType(
  type: ts.Type,
  checker: ts.TypeChecker,
): boolean {
  const typeString = checker.typeToString(type);

  const primitives = [
    'string',
    'number',
    'boolean',
    'null',
    'undefined',
    'void',
    'any',
    'unknown',
    'never',
  ];
  if (primitives.includes(typeString)) {
    return true;
  }

  if (type.flags & ts.TypeFlags.StringLiteral) return true;
  if (type.flags & ts.TypeFlags.NumberLiteral) return true;
  if (type.flags & ts.TypeFlags.BooleanLiteral) return true;

  return false;
}
