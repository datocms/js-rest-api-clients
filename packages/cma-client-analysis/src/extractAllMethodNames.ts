import ts from 'typescript';

/**
 * Extracts all method names from a resource class on the Client.
 *
 * @param checker - TypeScript type checker
 * @param clientClass - The Client class declaration
 * @param resourceName - The resource property name (e.g., "uploads", "items")
 * @returns Array of method names available on the resource
 */
export function extractAllMethodNames(
  checker: ts.TypeChecker,
  clientClass: ts.ClassDeclaration,
  resourceName: string,
): string[] {
  let resourceProperty = clientClass.members.find(
    (member) =>
      ts.isPropertyDeclaration(member) &&
      ts.isIdentifier(member.name) &&
      member.name.text === resourceName,
  ) as ts.PropertyDeclaration | undefined;

  if (!resourceProperty) {
    const classType = checker.getTypeAtLocation(clientClass);
    const resourceSymbol = classType.getProperty(resourceName);

    if (!resourceSymbol) return [];

    const declarations = resourceSymbol.getDeclarations();
    if (!declarations || declarations.length === 0) return [];

    const declaration = declarations[0];
    if (!declaration || !ts.isPropertyDeclaration(declaration)) return [];

    resourceProperty = declaration;
  }

  if (!resourceProperty?.type) return [];

  const resourceType = checker.getTypeAtLocation(resourceProperty.type);

  const methodNames: string[] = [];
  const properties = resourceType.getProperties();

  for (const prop of properties) {
    const propType = checker.getTypeOfSymbol(prop);
    if (propType.getCallSignatures().length > 0) {
      methodNames.push(prop.getName());
    }
  }

  return methodNames;
}
