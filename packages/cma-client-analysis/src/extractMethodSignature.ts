import ts from 'typescript';
import { isPrimitiveOrBuiltInType, shouldIncludeTypeName } from './typeFilters';

export interface MethodSignatureInfo {
  methodName: string;
  parameters: ParameterInfo[];
  returnType: string;
  documentation?: string;
  /** The action URL extracted from "Read more:" in JSDoc */
  actionUrl?: string;
  /** TypeScript symbols for referenced types (for accurate type extraction) */
  referencedTypeSymbols: Map<string, ts.Symbol>;
  /** All overload signatures if the method has multiple overloads */
  overloads?: SignatureOverload[];
}

export interface SignatureOverload {
  parameters: ParameterInfo[];
  returnType: string;
}

export interface ParameterInfo {
  name: string;
  type: string;
  isOptional: boolean;
  documentation?: string;
}

/**
 * Extracts the action URL from a JSDoc "Read more:" line.
 */
function extractActionUrlFromDocs(
  documentation: string | undefined,
): string | undefined {
  if (!documentation) return undefined;
  const match = documentation.match(/Read more:\s*(https?:\/\/[^\s]+)/);
  return match?.[1];
}

/**
 * Finds a resource property (e.g. `uploads`, `itemTypes`) on the Client class,
 * checking both the class itself and its base class.
 */
export function findResourceProperty(
  checker: ts.TypeChecker,
  clientClass: ts.ClassDeclaration,
  resourceName: string,
): ts.PropertyDeclaration | undefined {
  let resourceProperty = clientClass.members.find(
    (member) =>
      ts.isPropertyDeclaration(member) &&
      ts.isIdentifier(member.name) &&
      member.name.text === resourceName,
  ) as ts.PropertyDeclaration | undefined;

  if (!resourceProperty) {
    const classType = checker.getTypeAtLocation(clientClass);
    const resourceSymbol = classType.getProperty(resourceName);
    if (!resourceSymbol) return undefined;

    const declarations = resourceSymbol.getDeclarations();
    const declaration = declarations?.[0];
    if (!declaration || !ts.isPropertyDeclaration(declaration)) {
      return undefined;
    }

    resourceProperty = declaration;
  }

  return resourceProperty.type ? resourceProperty : undefined;
}

export function extractMethodSignature(
  checker: ts.TypeChecker,
  clientClass: ts.ClassDeclaration,
  resourceName: string,
  methodName: string,
): MethodSignatureInfo | undefined {
  const resourceProperty = findResourceProperty(
    checker,
    clientClass,
    resourceName,
  );
  if (!resourceProperty?.type) return undefined;

  const resourceType = checker.getTypeAtLocation(resourceProperty.type);

  const methodSymbol = resourceType.getProperty(methodName);
  if (!methodSymbol) return undefined;

  const methodType = checker.getTypeOfSymbol(methodSymbol);
  const signatures = methodType.getCallSignatures();
  if (signatures.length === 0) return undefined;

  const methodDocs = methodSymbol.getDocumentationComment(checker);
  const documentation =
    methodDocs.length > 0
      ? methodDocs.map((doc) => doc.text).join('\n')
      : undefined;

  const referencedTypeSymbols = new Map<string, ts.Symbol>();
  const overloads: SignatureOverload[] = [];

  for (const signature of signatures) {
    const parameters: ParameterInfo[] = signature
      .getParameters()
      .map((param) => {
        const paramType = checker.getTypeOfSymbol(param);
        const paramDeclaration = param.valueDeclaration;

        const isOptional = paramDeclaration
          ? ts.isParameter(paramDeclaration) &&
            (paramDeclaration.questionToken !== undefined ||
              paramDeclaration.initializer !== undefined)
          : false;

        const paramDocs = param.getDocumentationComment(checker);
        const paramDocText =
          paramDocs.length > 0
            ? paramDocs.map((doc) => doc.text).join('\n')
            : undefined;

        return {
          name: param.getName(),
          type: checker.typeToString(paramType),
          isOptional,
          documentation: paramDocText,
        };
      });

    const returnType = checker.typeToString(signature.getReturnType());

    overloads.push({ parameters, returnType });

    for (const param of signature.getParameters()) {
      const paramType = checker.getTypeOfSymbol(param);
      collectReferencedTypeNames(paramType, checker, referencedTypeSymbols);
    }

    collectReferencedTypeNames(
      signature.getReturnType(),
      checker,
      referencedTypeSymbols,
    );
  }

  const firstSignature = overloads[0];
  if (!firstSignature) return undefined;

  return {
    methodName,
    parameters: firstSignature.parameters,
    returnType: firstSignature.returnType,
    documentation,
    actionUrl: extractActionUrlFromDocs(documentation),
    referencedTypeSymbols,
    overloads: overloads.length > 1 ? overloads : undefined,
  };
}

/**
 * Collects all type names and symbols referenced by a given type.
 * Only collects named type references, not methods or properties.
 */
function collectReferencedTypeNames(
  type: ts.Type,
  checker: ts.TypeChecker,
  symbolMap: Map<string, ts.Symbol>,
  visited: Set<ts.Type> = new Set(),
): void {
  if (visited.has(type)) return;
  visited.add(type);

  if (isPrimitiveOrBuiltInType(type, checker)) return;

  const symbol = type.aliasSymbol || type.getSymbol();

  if (symbol) {
    const name = symbol.getName();
    if (shouldIncludeTypeName(name, symbol, checker)) {
      symbolMap.set(name, symbol);
    }
  }

  if (type.isUnion()) {
    for (const subType of type.types) {
      collectReferencedTypeNames(subType, checker, symbolMap, visited);
    }
  }

  if (type.isIntersection()) {
    for (const subType of type.types) {
      collectReferencedTypeNames(subType, checker, symbolMap, visited);
    }
  }

  if (checker.isArrayType(type)) {
    const typeArgs = checker.getTypeArguments(type as ts.TypeReference);
    if (typeArgs) {
      for (const typeArg of typeArgs) {
        collectReferencedTypeNames(typeArg, checker, symbolMap, visited);
      }
    }
  }

  const typeRef = type as ts.TypeReference;
  if (typeRef.target && checker.getTypeArguments) {
    const typeArgs = checker.getTypeArguments(typeRef);
    if (typeArgs) {
      for (const typeArg of typeArgs) {
        collectReferencedTypeNames(typeArg, checker, symbolMap, visited);
      }
    }
  }
}

/**
 * Formats a method signature into readable TypeScript code.
 */
export function formatMethodSignature(sig: MethodSignatureInfo): string {
  const formattedParams = sig.parameters
    .map((param) => {
      const optional = param.isOptional ? '?' : '';
      return `${param.name}${optional}: ${param.type}`;
    })
    .join(', ');

  return `${sig.methodName}(${formattedParams}): ${sig.returnType}`;
}
