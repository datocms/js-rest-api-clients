import ts from 'typescript';

/**
 * Transformations performed by applyGenerics:
 *
 * 1. Dropped exports
 *    - Removes entire type aliases/interfaces for: DatoApi, ItemAttributes, ItemTypeData, Item.
 *
 * 2. Simple renames
 *    - Field → FieldStableShell
 *    - FieldAttributes → FieldAttributesStableShell
 *    - FieldCreateSchema → FieldCreateSchemaStableShell
 *    - FieldUpdateSchema → FieldUpdateSchemaStableShell
 *
 * 3. Item target schemas
 *    (e.g. ItemInstancesTargetSchema, ItemCreateTargetSchema, …)
 *    - Add two generics:
 *        <D extends ItemTypeDefinition = ItemTypeDefinition,
 *         NestedMode extends boolean = false>
 *    - Wrap definition in conditional type:
 *        NestedMode extends false ? …Item<D>… : …ItemInNestedResponse<D>…
 *    - Special rule: if the top-level property is "included",
 *      bare Item references inside it remain plain `Item` (no generic).
 *
 * 4. Item schemas
 *    (ItemValidateExistingSchema, ItemValidateNewSchema, ItemCreateSchema, ItemUpdateSchema)
 *    - Add generic:
 *        <D extends ItemTypeDefinition = ItemTypeDefinition>
 *    - Replace `attributes: { [k: string]: unknown }` with:
 *        attributes: ToItemAttributesInRequest<D>
 *    - If a top-level index signature {[k: string]: unknown} is present,
 *      remove it and instead intersect the type with:
 *        ToItemAttributesInRequest<D>
 *    - Replace ItemTypeData with ItemTypeData<D>
 *
 * 5. ItemRelationships
 *    - Add generic:
 *        <D extends ItemTypeDefinition = ItemTypeDefinition>
 *    - Replace ItemTypeData with ItemTypeData<D>
 */

export function applyGenerics(sourceCode: string): string {
  const sourceFile = ts.createSourceFile(
    'temp.ts',
    sourceCode,
    ts.ScriptTarget.Latest,
    true,
    ts.ScriptKind.TS,
  );

  // 1. Simple rename map (without ItemValidate*Schema entries)
  const renameTypeExportMap: Record<string, string> = {
    Field: 'FieldStableShell',
    FieldAttributes: 'FieldAttributesStableShell',
    FieldCreateSchema: 'FieldCreateSchemaStableShell',
    FieldUpdateSchema: 'FieldUpdateSchemaStableShell',
  };

  // 2. Types we want to remove completely
  const dropTypeExports = new Set([
    'DatoApi',
    'ItemAttributes',
    'ItemTypeData',
    'Item',
  ]);

  // ItemRelationships
  const itemRelationships = new Set(['ItemRelationships']);

  // 3. Item target schemas
  const itemTargetSchemas = new Set([
    'ItemInstancesTargetSchema',
    'UploadReferencesTargetSchema',
    'ItemSelfTargetSchema',
    'ItemCreateTargetSchema',
    'ItemDuplicateJobSchema',
    'ItemUpdateTargetSchema',
    'ItemDestroyJobSchema',
    'ItemPublishTargetSchema',
    'ItemUnpublishTargetSchema',
    'ItemReferencesTargetSchema',
    'ItemVersionRestoreJobSchema',
    'ScheduledPublicationDestroyTargetSchema',
    'ScheduledUnpublishingDestroyTargetSchema',
  ]);

  // 4. Item schemas
  const itemSchemas = new Set([
    'ItemValidateExistingSchema',
    'ItemValidateNewSchema',
    'ItemCreateSchema',
    'ItemUpdateSchema',
  ]);

  const genericParamD = ts.factory.createTypeParameterDeclaration(
    undefined,
    ts.factory.createIdentifier('D'),
    ts.factory.createTypeReferenceNode('ItemTypeDefinition', undefined),
    ts.factory.createTypeReferenceNode('ItemTypeDefinition', undefined),
  );

  const genericParamNested = ts.factory.createTypeParameterDeclaration(
    undefined,
    ts.factory.createIdentifier('NestedMode'),
    ts.factory.createTypeReferenceNode('boolean', undefined),
    ts.factory.createLiteralTypeNode(ts.factory.createFalse()),
  );

  // --- Utility: Replace Item depending on context ---
  function replaceItemInType(
    typeNode: ts.TypeNode,
    replacementFactory: (withNested: boolean) => ts.TypeReferenceNode,
    context: ts.TransformationContext,
    insideIncluded = false,
    withNested = false,
  ): ts.TypeNode {
    const visit: ts.Visitor = (node: ts.Node): ts.Node => {
      if (
        ts.isTypeReferenceNode(node) &&
        ts.isIdentifier(node.typeName) &&
        node.typeName.text === 'Item'
      ) {
        if (insideIncluded) {
          return ts.factory.createTypeReferenceNode('Item', undefined);
        }
        return replacementFactory(withNested);
      }

      if (
        ts.isPropertySignature(node) &&
        ts.isIdentifier(node.name) &&
        node.name.text === 'included'
      ) {
        return ts.factory.updatePropertySignature(
          node,
          node.modifiers,
          node.name,
          node.questionToken,
          replaceItemInType(
            node.type!,
            replacementFactory,
            context,
            true,
            withNested,
          ),
        );
      }

      return ts.visitEachChild(node, visit, context);
    };
    return ts.visitNode(typeNode, visit) as ts.TypeNode;
  }

  function transformItemTargetSchema(
    node: ts.TypeAliasDeclaration,
    context: ts.TransformationContext,
  ): ts.TypeAliasDeclaration {
    const falseCase = replaceItemInType(
      node.type,
      () =>
        ts.factory.createTypeReferenceNode('Item', [
          ts.factory.createTypeReferenceNode('D', undefined),
        ]),
      context,
      false,
      false,
    );

    const trueCase = replaceItemInType(
      node.type,
      () =>
        ts.factory.createTypeReferenceNode('ItemInNestedResponse', [
          ts.factory.createTypeReferenceNode('D', undefined),
        ]),
      context,
      false,
      true,
    );

    const conditionalType = ts.factory.createConditionalTypeNode(
      ts.factory.createTypeReferenceNode('NestedMode', undefined),
      ts.factory.createLiteralTypeNode(ts.factory.createFalse()),
      falseCase,
      trueCase,
    );

    return ts.factory.updateTypeAliasDeclaration(
      node,
      node.modifiers,
      ts.factory.createIdentifier(node.name.text),
      [genericParamD, genericParamNested],
      conditionalType,
    );
  }

  function transformItemRelationships(
    node: ts.TypeAliasDeclaration,
    context: ts.TransformationContext,
  ): ts.TypeAliasDeclaration {
    const visit: ts.Visitor = (child: ts.Node): ts.Node | undefined => {
      // Replace ItemTypeData with ItemTypeData<D>
      if (
        ts.isTypeReferenceNode(child) &&
        ts.isIdentifier(child.typeName) &&
        child.typeName.text === 'ItemTypeData'
      ) {
        return ts.factory.createTypeReferenceNode('ItemTypeData', [
          ts.factory.createTypeReferenceNode('D', undefined),
        ]);
      }

      return ts.visitEachChild(child, visit, context);
    };

    const transformedType = ts.visitNode(node.type, visit) as ts.TypeNode;

    const finalType: ts.TypeNode = transformedType;

    return ts.factory.updateTypeAliasDeclaration(
      node,
      node.modifiers,
      ts.factory.createIdentifier(node.name.text),
      [genericParamD],
      finalType,
    );
  }

  function transformItemSchema(
    node: ts.TypeAliasDeclaration,
    context: ts.TransformationContext,
  ): ts.TypeAliasDeclaration {
    const visit: ts.Visitor = (child: ts.Node): ts.Node | undefined => {
      // Replace attributes: { [k: string]: unknown } with ToItemAttributesInRequest<D>
      if (
        ts.isPropertySignature(child) &&
        ts.isIdentifier(child.name) &&
        child.name.text === 'attributes' &&
        child.type &&
        ts.isTypeLiteralNode(child.type) &&
        child.type.members.length === 1 &&
        ts.isIndexSignatureDeclaration(child.type.members[0]!)
      ) {
        return ts.factory.updatePropertySignature(
          child,
          child.modifiers,
          child.name,
          child.questionToken,
          ts.factory.createTypeReferenceNode('ToItemAttributesInRequest', [
            ts.factory.createTypeReferenceNode('D', undefined),
          ]),
        );
      }

      // Replace ItemTypeData with ItemTypeData<D>
      if (
        ts.isTypeReferenceNode(child) &&
        ts.isIdentifier(child.typeName) &&
        child.typeName.text === 'ItemTypeData'
      ) {
        return ts.factory.createTypeReferenceNode('ItemTypeData', [
          ts.factory.createTypeReferenceNode('D', undefined),
        ]);
      }

      return ts.visitEachChild(child, visit, context);
    };

    const transformedType = ts.visitNode(node.type, visit) as ts.TypeNode;

    let finalType: ts.TypeNode = transformedType;

    // Add __itemTypeId?: D['itemTypeId'] property
    const itemTypeIdProperty = ts.factory.createPropertySignature(
      undefined,
      ts.factory.createIdentifier('__itemTypeId'),
      ts.factory.createToken(ts.SyntaxKind.QuestionToken),
      ts.factory.createIndexedAccessTypeNode(
        ts.factory.createTypeReferenceNode('D', undefined),
        ts.factory.createLiteralTypeNode(
          ts.factory.createStringLiteral('itemTypeId'),
        ),
      ),
    );

    // If the type is a TypeLiteral with a top-level {[k: string]: unknown},
    // remove it and instead intersect ToItemAttributesInRequest<D>
    if (ts.isTypeLiteralNode(transformedType)) {
      const membersWithoutIndex = transformedType.members.filter(
        (m) => !ts.isIndexSignatureDeclaration(m),
      );

      const hadIndexSignature =
        membersWithoutIndex.length !== transformedType.members.length;

      if (hadIndexSignature) {
        finalType = ts.factory.createIntersectionTypeNode([
          ts.factory.createTypeLiteralNode([
            ...membersWithoutIndex,
            itemTypeIdProperty,
          ]),
          ts.factory.createTypeReferenceNode('ToItemAttributesInRequest', [
            ts.factory.createTypeReferenceNode('D', undefined),
          ]),
        ]);
      } else {
        // No index signature, just add the property to existing members
        finalType = ts.factory.createTypeLiteralNode([
          ...transformedType.members,
          itemTypeIdProperty,
        ]);
      }
    } else {
      // If it's not a type literal, intersect with a type containing __itemTypeId
      finalType = ts.factory.createIntersectionTypeNode([
        transformedType,
        ts.factory.createTypeLiteralNode([itemTypeIdProperty]),
      ]);
    }

    return ts.factory.updateTypeAliasDeclaration(
      node,
      node.modifiers,
      ts.factory.createIdentifier(node.name.text),
      [genericParamD],
      finalType,
    );
  }

  const transformerFactory: ts.TransformerFactory<ts.SourceFile> = (
    context,
  ) => {
    const visit: ts.Visitor = (node) => {
      if (
        (ts.isTypeAliasDeclaration(node) || ts.isInterfaceDeclaration(node)) &&
        node.modifiers?.some((m) => m.kind === ts.SyntaxKind.ExportKeyword)
      ) {
        const name = node.name.text;

        if (dropTypeExports.has(name)) {
          return undefined;
        }

        if (renameTypeExportMap[name]) {
          return ts.factory.updateTypeAliasDeclaration(
            node as ts.TypeAliasDeclaration,
            node.modifiers,
            ts.factory.createIdentifier(renameTypeExportMap[name]!),
            (node as ts.TypeAliasDeclaration).typeParameters,
            (node as ts.TypeAliasDeclaration).type,
          );
        }

        if (itemTargetSchemas.has(name) && ts.isTypeAliasDeclaration(node)) {
          return transformItemTargetSchema(node, context);
        }

        if (itemSchemas.has(name) && ts.isTypeAliasDeclaration(node)) {
          return transformItemSchema(node, context);
        }

        if (itemRelationships.has(name) && ts.isTypeAliasDeclaration(node)) {
          return transformItemRelationships(node, context);
        }
      }
      return ts.visitEachChild(node, visit, context);
    };
    return (node) => ts.visitNode(node, visit);
  };

  const result = ts.transform(sourceFile, [transformerFactory]);
  const transformed = result.transformed[0];
  const printer = ts.createPrinter({ newLine: ts.NewLineKind.LineFeed });

  const output = printer.printFile(transformed as ts.SourceFile);
  result.dispose();
  return output;
}
