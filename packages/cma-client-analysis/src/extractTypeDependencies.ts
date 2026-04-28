import * as ts from 'typescript';
import {
  BUILT_IN_TYPE_NAMES,
  isFromTrackedPackage,
  isTypeParameter,
} from './typeFilters.js';

export interface TypeExtractionResult {
  expandedTypes: string;
  notExpandedTypes: string[];
}

export interface TypeExtractionOptions {
  /**
   * Maximum depth for type expansion.
   * @default 2
   */
  maxDepth?: number;
  /**
   * When provided, only these types are extracted (starting at depth 0),
   * instead of the types in typeNames. Use ['*'] to expand all types with no depth limit.
   */
  expandTypes?: string[];
}

/**
 * Whether a given source file is part of one of the DatoCMS packages we want
 * to inline during type extraction. Centralised in `typeFilters` so the
 * dependency walk and the per-name include filter stay in sync.
 */
const isFromAllowedPackage = isFromTrackedPackage;

/**
 * Resolve a symbol through import/alias chains to its final declaration symbol.
 */
function resolveAliasedSymbol(
  symbol: ts.Symbol,
  checker: ts.TypeChecker,
): ts.Symbol {
  let current = symbol;
  while (current.flags & ts.SymbolFlags.Alias) {
    const next = checker.getAliasedSymbol(current);
    if (!next || next === current) break;
    current = next;
  }
  return current;
}

export function extractTypeDependencies(
  checker: ts.TypeChecker,
  program: ts.Program,
  typeNames: string[],
  typeSymbols?: Map<string, ts.Symbol>,
  options: TypeExtractionOptions = {},
): TypeExtractionResult {
  const maxDepth = options.maxDepth ?? 2;
  const expandTypes = options.expandTypes ?? [];
  const noDepthLimit = expandTypes.includes('*');

  const startingTypes =
    expandTypes.length > 0 && !noDepthLimit ? expandTypes : typeNames;

  const extractedTypes = new Map<string, string>();
  const processedAtDepth = new Map<string, number>();
  const unexpandedTypes = new Set<string>();

  const getTypeId = (symbol: ts.Symbol): string => {
    const declarations = symbol.getDeclarations();
    if (!declarations || declarations.length === 0) {
      return symbol.getName();
    }
    const decl = declarations[0];
    if (!decl) return symbol.getName();
    const sourceFile = decl.getSourceFile();
    return `${sourceFile.fileName}::${symbol.getName()}`;
  };

  const extractType = (
    typeName: string,
    currentDepth = 0,
    preresolvedSymbol?: ts.Symbol,
  ): void => {
    const previousDepth = processedAtDepth.get(typeName);
    if (previousDepth !== undefined && previousDepth <= currentDepth) return;
    processedAtDepth.set(typeName, currentDepth);

    unexpandedTypes.delete(typeName);

    if (currentDepth >= maxDepth && !noDepthLimit) {
      if (!BUILT_IN_TYPE_NAMES.has(typeName)) {
        const typeSymbol =
          preresolvedSymbol ??
          typeSymbols?.get(typeName) ??
          findTypeSymbol(checker, program, typeName);
        if (typeSymbol) {
          const declarations = typeSymbol.getDeclarations();
          if (declarations && declarations.length > 0) {
            const declaration = declarations[0];
            const sourceFile = declaration?.getSourceFile();
            if (sourceFile && isFromAllowedPackage(sourceFile.fileName)) {
              unexpandedTypes.add(typeName);

              if (declaration) {
                const referencedTypes = findReferencedTypes(
                  declaration,
                  checker,
                );
                for (const ref of referencedTypes) {
                  extractType(ref.name, currentDepth + 1, ref.symbol);
                }
              }
            }
          }
        }
      }
      return;
    }

    if (BUILT_IN_TYPE_NAMES.has(typeName)) return;

    const typeSymbol =
      preresolvedSymbol ??
      typeSymbols?.get(typeName) ??
      findTypeSymbol(checker, program, typeName);

    if (!typeSymbol) return;

    const typeId = getTypeId(typeSymbol);
    if (extractedTypes.has(typeId)) return;

    const declarations = typeSymbol.getDeclarations();
    if (!declarations || declarations.length === 0) return;

    const declaration = declarations[0];
    if (!declaration) return;

    const sourceFile = declaration.getSourceFile();
    if (!isFromAllowedPackage(sourceFile.fileName)) return;

    const declarationText = getDeclarationText(declaration, sourceFile);
    extractedTypes.set(typeId, declarationText);

    const referencedTypes = findReferencedTypes(declaration, checker);
    for (const ref of referencedTypes) {
      extractType(ref.name, currentDepth + 1, ref.symbol);
    }
  };

  for (const typeName of startingTypes) {
    extractType(typeName, 0);
  }

  const expandedTypes = Array.from(extractedTypes.values()).join('\n\n');
  const notExpandedTypes = Array.from(unexpandedTypes).sort();

  return { expandedTypes, notExpandedTypes };
}

/**
 * Finds a type symbol by name in the program.
 * Handles both simple names ("Upload") and qualified names ("ApiTypes.ItemType").
 */
function findTypeSymbol(
  checker: ts.TypeChecker,
  program: ts.Program,
  typeName: string,
): ts.Symbol | undefined {
  const parts = typeName.split('.');

  if (parts.length > 1 && parts[0]) {
    const namespaceName = parts[0];
    const typeNameInNamespace = parts.slice(1).join('.');

    for (const sourceFile of program.getSourceFiles()) {
      if (
        sourceFile.fileName.includes('node_modules') &&
        !sourceFile.fileName.includes('@datocms')
      ) {
        continue;
      }

      const namespaceSymbol = findSymbolInNode(
        sourceFile,
        namespaceName,
        checker,
      );
      if (!namespaceSymbol) continue;

      const exports = namespaceSymbol.exports;
      if (!exports) continue;

      const typeSymbol = exports.get(typeNameInNamespace as ts.__String);
      if (typeSymbol) return typeSymbol;
    }

    return undefined;
  }

  for (const sourceFile of program.getSourceFiles()) {
    if (
      sourceFile.fileName.includes('node_modules') &&
      !sourceFile.fileName.includes('@datocms')
    ) {
      continue;
    }

    const symbol = findSymbolInNode(sourceFile, typeName, checker);
    if (symbol) return symbol;
  }

  return undefined;
}

function findSymbolInNode(
  node: ts.Node,
  name: string,
  checker: ts.TypeChecker,
): ts.Symbol | undefined {
  if (ts.isTypeAliasDeclaration(node) || ts.isInterfaceDeclaration(node)) {
    if (node.name.text === name) {
      return checker.getSymbolAtLocation(node.name);
    }
  }

  if (ts.isClassDeclaration(node) && node.name && node.name.text === name) {
    return checker.getSymbolAtLocation(node.name);
  }

  if (ts.isEnumDeclaration(node) && node.name && node.name.text === name) {
    return checker.getSymbolAtLocation(node.name);
  }

  if (ts.isModuleDeclaration(node) && node.name) {
    const moduleName = ts.isIdentifier(node.name)
      ? node.name.text
      : node.name.text;
    if (moduleName === name) {
      return checker.getSymbolAtLocation(node.name);
    }
  }

  let result: ts.Symbol | undefined;
  ts.forEachChild(node, (child) => {
    if (!result) {
      result = findSymbolInNode(child, name, checker);
    }
  });

  return result;
}

export interface ReferencedType {
  /** The short type name, always the rightmost identifier of a qualified name. */
  name: string;
  /**
   * The symbol for the type, resolved via the TypeScript checker and with
   * import aliases unwrapped.
   */
  symbol?: ts.Symbol;
}

/**
 * Finds all type names referenced in a declaration, along with their resolved
 * symbols. Using the checker (instead of name-based search) is critical for
 * qualified namespace-imported references and for short-name disambiguation
 * across files.
 */
function findReferencedTypes(
  node: ts.Node,
  checker: ts.TypeChecker,
): ReferencedType[] {
  const referencedTypes: ReferencedType[] = [];
  const seen = new Set<string>();

  const genericParams = new Set<string>();
  function collectGenericParams(n: ts.Node): void {
    if (
      (ts.isTypeAliasDeclaration(n) ||
        ts.isInterfaceDeclaration(n) ||
        ts.isFunctionDeclaration(n) ||
        ts.isMethodDeclaration(n) ||
        ts.isMethodSignature(n)) &&
      n.typeParameters
    ) {
      for (const param of n.typeParameters) {
        genericParams.add(param.name.text);
      }
    }
    ts.forEachChild(n, collectGenericParams);
  }
  collectGenericParams(node);

  const record = (name: string, symbol?: ts.Symbol): void => {
    if (seen.has(name)) return;
    seen.add(name);
    referencedTypes.push({ name, symbol });
  };

  function visit(n: ts.Node): void {
    if (ts.isTypeReferenceNode(n)) {
      const nameNode: ts.Identifier | undefined = ts.isIdentifier(n.typeName)
        ? n.typeName
        : ts.isQualifiedName(n.typeName)
          ? getRightmostIdentifier(n.typeName)
          : undefined;

      if (nameNode) {
        const shortName = nameNode.text;

        if (
          BUILT_IN_TYPE_NAMES.has(shortName) ||
          genericParams.has(shortName)
        ) {
          ts.forEachChild(n, visit);
          return;
        }

        let resolved = checker.getSymbolAtLocation(nameNode);

        if (isTypeParameter(resolved, checker)) {
          ts.forEachChild(n, visit);
          return;
        }

        if (resolved) {
          resolved = resolveAliasedSymbol(resolved, checker);
        }

        record(shortName, resolved);
      }

      ts.forEachChild(n, visit);
      return;
    }

    if (ts.isTypeQueryNode(n)) {
      const symbol = checker.getSymbolAtLocation(n.exprName);
      if (symbol) {
        record(symbol.getName(), resolveAliasedSymbol(symbol, checker));
      }
    }

    if (ts.isImportTypeNode(n)) {
      if (n.qualifier && ts.isIdentifier(n.qualifier)) {
        const symbol = checker.getSymbolAtLocation(n.qualifier);
        record(
          n.qualifier.text,
          symbol ? resolveAliasedSymbol(symbol, checker) : undefined,
        );
      }
    }

    ts.forEachChild(n, visit);
  }

  visit(node);
  return referencedTypes;
}

function getRightmostIdentifier(
  qualifiedName: ts.QualifiedName,
): ts.Identifier {
  return qualifiedName.right;
}

/**
 * Gets the declaration text, stripping leading comments.
 */
function getDeclarationText(
  declaration: ts.Node,
  sourceFile: ts.SourceFile,
): string {
  const fullText = sourceFile.getFullText();

  const commentRanges = ts.getLeadingCommentRanges(
    fullText,
    declaration.getFullStart(),
  );

  let start = declaration.getFullStart();

  if (commentRanges && commentRanges.length > 0) {
    const lastComment = commentRanges[commentRanges.length - 1];
    if (lastComment) {
      start = lastComment.end;
    }
  }

  const declarationText = fullText.slice(start, declaration.getEnd()).trim();

  return declarationText;
}
