import assert from 'node:assert';
import {
  type CmaClientProgram,
  extractAllMethodNames,
  extractMethodSignature,
  extractTypeDependencies,
  getCmaClientProgram,
} from '../src';

describe('TypeScript Compiler API - Unit Tests', () => {
  // Building the program parses the full client .d.ts graph (~hundreds of ms).
  // The library intentionally does not cache; we hoist it here so all tests in
  // this file share one program.
  let cma: CmaClientProgram;
  beforeAll(() => {
    cma = getCmaClientProgram();
  });

  describe('extractAllMethodNames', () => {
    it('should extract all method names from items resource', () => {
      const { checker, clientClass } = cma;

      const methodNames = extractAllMethodNames(checker, clientClass, 'items');

      expect(methodNames).toBeDefined();
      expect(methodNames.length).toBeGreaterThan(0);
      expect(methodNames).toContain('list');
      expect(methodNames).toContain('find');
      expect(methodNames).toContain('create');
      expect(methodNames).toContain('rawList');
      expect(methodNames).toContain('rawFind');
      expect(methodNames).toContain('rawCreate');
    }, 10000);

    it('should extract all method names from uploads resource including special methods', () => {
      const { checker, clientClass } = cma;

      const methodNames = extractAllMethodNames(
        checker,
        clientClass,
        'uploads',
      );

      expect(methodNames).toBeDefined();
      expect(methodNames.length).toBeGreaterThan(0);
      expect(methodNames).toContain('create');
      expect(methodNames).toContain('createFromLocalFile');
      expect(methodNames).toContain('createFromUrl');
      expect(methodNames).toContain('update');
      expect(methodNames).toContain('updateFromLocalFile');
      expect(methodNames).toContain('updateFromUrl');
    }, 10000);

    it('should return empty array for invalid resource', () => {
      const { checker, clientClass } = cma;

      const methodNames = extractAllMethodNames(
        checker,
        clientClass,
        'invalid_resource_xyz',
      );

      expect(methodNames).toEqual([]);
    }, 10000);
  });

  describe('extractMethodSignature', () => {
    it('should extract signature for items.list', () => {
      const { checker, clientClass } = cma;

      const signature = extractMethodSignature(
        checker,
        clientClass,
        'items',
        'list',
      );

      expect(signature).toBeDefined();
      assert(signature);

      expect(signature.methodName).toBe('list');
      expect(signature.parameters).toBeDefined();
      expect(signature.returnType).toBeDefined();
      expect(signature.returnType).toContain('Promise');
      expect(signature.referencedTypeSymbols).toBeDefined();
      expect(signature.referencedTypeSymbols.size).toBeGreaterThan(0);
    }, 10000);

    it('should extract signature for items.find with parameters', () => {
      const { checker, clientClass } = cma;

      const signature = extractMethodSignature(
        checker,
        clientClass,
        'items',
        'find',
      );

      expect(signature).toBeDefined();
      assert(signature);
      expect(signature.methodName).toBe('find');
      expect(signature.parameters.length).toBeGreaterThan(0);

      const hasItemIdParam = signature.parameters.some(
        (p) => p.name === 'itemId' || p.name.includes('id'),
      );
      expect(hasItemIdParam).toBe(true);
    }, 10000);

    it('should extract signature for items.create with body parameter', () => {
      const { checker, clientClass } = cma;

      const signature = extractMethodSignature(
        checker,
        clientClass,
        'items',
        'create',
      );

      expect(signature).toBeDefined();
      assert(signature);
      expect(signature.methodName).toBe('create');
      expect(signature.parameters.length).toBeGreaterThan(0);
    }, 10000);

    it('should extract signature for items.rawList', () => {
      const { checker, clientClass } = cma;

      const signature = extractMethodSignature(
        checker,
        clientClass,
        'items',
        'rawList',
      );

      expect(signature).toBeDefined();
      assert(signature);
      expect(signature.methodName).toBe('rawList');
      expect(signature.returnType).toContain('Promise');
    }, 10000);

    it('should extract signature for items.listPagedIterator', () => {
      const { checker, clientClass } = cma;

      const signature = extractMethodSignature(
        checker,
        clientClass,
        'items',
        'listPagedIterator',
      );

      expect(signature).toBeDefined();
      assert(signature);
      expect(signature.methodName).toBe('listPagedIterator');
    }, 10000);

    it('should extract signature for Node-specific uploads.createFromLocalFile', () => {
      const { checker, clientClass } = cma;

      const signature = extractMethodSignature(
        checker,
        clientClass,
        'uploads',
        'createFromLocalFile',
      );

      expect(signature).toBeDefined();
      assert(signature);
      expect(signature.methodName).toBe('createFromLocalFile');
      expect(signature.parameters.length).toBeGreaterThan(0);

      expect(signature.returnType).toBeDefined();
    }, 10000);

    it('should return null for invalid resource', () => {
      const { checker, clientClass } = cma;

      const signature = extractMethodSignature(
        checker,
        clientClass,
        'invalid_resource_xyz',
        'list',
      );

      expect(signature).toBeFalsy();
    }, 10000);

    it('should return null for invalid method', () => {
      const { checker, clientClass } = cma;

      const signature = extractMethodSignature(
        checker,
        clientClass,
        'items',
        'invalid_method_xyz',
      );

      expect(signature).toBeFalsy();
    }, 10000);
  });

  describe('extractTypeDependencies', () => {
    it('should handle empty type list', () => {
      const { program, checker } = cma;
      const result = extractTypeDependencies(checker, program, []);
      expect(result.expandedTypes).toBe('');
      expect(result.notExpandedTypes).toEqual([]);
    }, 10000);

    it('itemTypes.list with maxDepth 0 (no types)', () => {
      const { program, checker, clientClass } = cma;
      const signature = extractMethodSignature(
        checker,
        clientClass,
        'itemTypes',
        'list',
      );
      assert(signature);
      const result = extractTypeDependencies(
        checker,
        program,
        Array.from(signature.referencedTypeSymbols.keys()),
        signature.referencedTypeSymbols,
        { maxDepth: 0 },
      );
      expect(result).toMatchSnapshot();
    }, 10000);

    it('itemTypes.list with maxDepth 1', () => {
      const { program, checker, clientClass } = cma;
      const signature = extractMethodSignature(
        checker,
        clientClass,
        'itemTypes',
        'list',
      );
      assert(signature);
      const result = extractTypeDependencies(
        checker,
        program,
        Array.from(signature.referencedTypeSymbols.keys()),
        signature.referencedTypeSymbols,
        { maxDepth: 1 },
      );
      expect(result).toMatchSnapshot();
    }, 10000);

    it('itemTypes.list with maxDepth 2 (default)', () => {
      const { program, checker, clientClass } = cma;
      const signature = extractMethodSignature(
        checker,
        clientClass,
        'itemTypes',
        'list',
      );
      assert(signature);
      const result = extractTypeDependencies(
        checker,
        program,
        Array.from(signature.referencedTypeSymbols.keys()),
        signature.referencedTypeSymbols,
      );
      expect(result).toMatchSnapshot();
    }, 10000);

    it('itemTypes.list with expandTypes: [*]', () => {
      const { program, checker, clientClass } = cma;
      const signature = extractMethodSignature(
        checker,
        clientClass,
        'itemTypes',
        'list',
      );
      assert(signature);
      const result = extractTypeDependencies(
        checker,
        program,
        Array.from(signature.referencedTypeSymbols.keys()),
        signature.referencedTypeSymbols,
        { maxDepth: 2, expandTypes: ['*'] },
      );
      expect(result).toMatchSnapshot();
    }, 10000);

    it('itemTypes.rawList with maxDepth 2', () => {
      const { program, checker, clientClass } = cma;
      const signature = extractMethodSignature(
        checker,
        clientClass,
        'itemTypes',
        'rawList',
      );
      assert(signature);
      const result = extractTypeDependencies(
        checker,
        program,
        Array.from(signature.referencedTypeSymbols.keys()),
        signature.referencedTypeSymbols,
      );
      expect(result).toMatchSnapshot();
    }, 10000);

    it('uploads.create with maxDepth 2', () => {
      const { program, checker, clientClass } = cma;
      const signature = extractMethodSignature(
        checker,
        clientClass,
        'uploads',
        'create',
      );
      assert(signature);
      const result = extractTypeDependencies(
        checker,
        program,
        Array.from(signature.referencedTypeSymbols.keys()),
        signature.referencedTypeSymbols,
      );
      expect(result).toMatchSnapshot();
    }, 10000);

    it('items.list with maxDepth 2', () => {
      const { program, checker, clientClass } = cma;
      const signature = extractMethodSignature(
        checker,
        clientClass,
        'items',
        'list',
      );
      assert(signature);
      const result = extractTypeDependencies(
        checker,
        program,
        Array.from(signature.referencedTypeSymbols.keys()),
        signature.referencedTypeSymbols,
      );
      expect(result).toMatchSnapshot();
    }, 10000);

    it('items.find with maxDepth 2', () => {
      const { program, checker, clientClass } = cma;
      const signature = extractMethodSignature(
        checker,
        clientClass,
        'items',
        'find',
      );
      assert(signature);
      const result = extractTypeDependencies(
        checker,
        program,
        Array.from(signature.referencedTypeSymbols.keys()),
        signature.referencedTypeSymbols,
      );
      expect(result).toMatchSnapshot();
    }, 10000);
  });

  describe('Integration: Full extraction pipeline', () => {
    it('should extract complete method definition for items.create', () => {
      const { program, checker, clientClass } = cma;

      const signature = extractMethodSignature(
        checker,
        clientClass,
        'items',
        'create',
      );

      expect(signature).toBeDefined();
      assert(signature);
      if (!signature) return;

      const { expandedTypes } = extractTypeDependencies(
        checker,
        program,
        Array.from(signature.referencedTypeSymbols.keys()),
        signature.referencedTypeSymbols,
      );

      expect(signature.methodName).toBe('create');
      expect(signature.parameters.length).toBeGreaterThan(0);
      expect(signature.returnType).toBeDefined();
      expect(expandedTypes).toBeDefined();
      expect(expandedTypes.length).toBeGreaterThan(0);
    }, 10000);

    it('should handle complex types with generics', () => {
      const { program, checker, clientClass } = cma;

      const signature = extractMethodSignature(
        checker,
        clientClass,
        'items',
        'rawList',
      );

      expect(signature).toBeDefined();
      assert(signature);
      expect(signature.returnType).toContain('Promise');

      const { expandedTypes } = extractTypeDependencies(
        checker,
        program,
        Array.from(signature.referencedTypeSymbols.keys()),
        signature.referencedTypeSymbols,
      );

      expect(expandedTypes).toBeDefined();
    }, 10000);
  });

  describe('Field-value expansion gaps (reproducing issues)', () => {
    // Issue 1 — external-package filter.
    //
    // StructuredTextFieldValueInRequest<B, I> (used by every item.create /
    // item.update payload with a Structured Text field) eventually aliases
    // to Document<...> from `datocms-structured-text-utils`. The expander
    // filters every declaration whose file path does not contain
    // `@datocms`, so the Document type (and the whole DAST grammar —
    // Root, Paragraph, Heading, Span, Link, ItemLink, InlineItem, Block,
    // InlineBlock, List, Code, Blockquote...) is silently dropped. Callers
    // see DocumentInRequest as an opaque reference to Document<...> and
    // have to guess the node shape.
    it("items.create with ['*'] SHOULD expand Document from datocms-structured-text-utils", () => {
      const { program, checker, clientClass } = cma;
      const signature = extractMethodSignature(
        checker,
        clientClass,
        'items',
        'create',
      );
      assert(signature);

      const result = extractTypeDependencies(
        checker,
        program,
        Array.from(signature.referencedTypeSymbols.keys()),
        signature.referencedTypeSymbols,
        { expandTypes: ['*'] },
      );

      // Sanity: the @datocms-side alias does expand today.
      expect(result.expandedTypes).toContain('DocumentInRequest');

      expect(result.expandedTypes).toMatch(/\btype Document\b/);
      expect(result.expandedTypes).toContain("schema: 'dast'");
      expect(result.expandedTypes).toMatch(/\btype Root\b/);
      expect(result.expandedTypes).toMatch(/\btype Paragraph\b/);
      expect(result.expandedTypes).toMatch(/\btype Span\b/);
    }, 20000);

    // Default-depth visibility — the flip side of Issues 1 and 2.
    it('items.create at default depth lists Document and ItemRelationships as notExpandedTypes', () => {
      const { program, checker, clientClass } = cma;
      const signature = extractMethodSignature(
        checker,
        clientClass,
        'items',
        'create',
      );
      assert(signature);

      const result = extractTypeDependencies(
        checker,
        program,
        Array.from(signature.referencedTypeSymbols.keys()),
        signature.referencedTypeSymbols,
        { maxDepth: 3 },
      );

      expect(result.notExpandedTypes).toContain('Document');
      expect(result.notExpandedTypes).toContain('Root');
      expect(result.notExpandedTypes).toContain('Paragraph');
      expect(result.notExpandedTypes).toContain('Span');

      expect(result.notExpandedTypes).toContain('ItemRelationships');
      expect(result.notExpandedTypes).toContain('NewBlockInRequest');
      expect(result.notExpandedTypes).toContain('BlockInRequest');
    }, 20000);

    // Issue 2 — qualified names through `import * as` namespace imports.
    //
    // NewBlockInRequest<D> (reached from items.create via BlockInRequest,
    // which is the block-creation branch of every rich_text / single_block /
    // structured_text field in a request) declares:
    //
    //   relationships: RawApiTypes.ItemRelationships<D>;
    //
    // `RawApiTypes` here is a namespace IMPORT, not a `declare namespace`.
    // findReferencedTypes resolves qualified references via the checker, so
    // the dependency walk now follows through the import alias.
    it("items.create with ['*'] SHOULD expand RawApiTypes.ItemRelationships reached via NewBlockInRequest", () => {
      const { program, checker, clientClass } = cma;
      const signature = extractMethodSignature(
        checker,
        clientClass,
        'items',
        'create',
      );
      assert(signature);

      const result = extractTypeDependencies(
        checker,
        program,
        Array.from(signature.referencedTypeSymbols.keys()),
        signature.referencedTypeSymbols,
        { expandTypes: ['*'] },
      );

      expect(result.expandedTypes).toMatch(/\btype NewBlockInRequest\b/);
      expect(result.expandedTypes).toMatch(
        /relationships:\s*RawApiTypes\.ItemRelationships/,
      );

      expect(result.expandedTypes).toMatch(/\btype ItemRelationships\b/);
      expect(result.expandedTypes).toMatch(
        /ItemRelationships[\s\S]*?item_type:\s*\{\s*data:\s*ItemTypeData/,
      );
    }, 20000);
  });

  describe('ApiTypes vs RawApiTypes disambiguation', () => {
    it('should correctly identify itemTypes.list uses ApiTypes version', () => {
      const { checker, clientClass } = cma;

      const signature = extractMethodSignature(
        checker,
        clientClass,
        'itemTypes',
        'list',
      );

      expect(signature).toBeDefined();
      assert(signature);

      expect(signature.referencedTypeSymbols).toBeDefined();
      expect(signature.referencedTypeSymbols.size).toBeGreaterThan(0);

      expect(
        signature.referencedTypeSymbols.has('ItemTypeInstancesTargetSchema'),
      ).toBe(true);

      const symbol = signature.referencedTypeSymbols.get(
        'ItemTypeInstancesTargetSchema',
      );
      expect(symbol).toBeDefined();
      assert(symbol);

      const declarations = symbol.getDeclarations();
      expect(declarations).toBeDefined();
      assert(declarations && declarations.length > 0);

      const sourceFile = declarations[0]?.getSourceFile().fileName;
      expect(sourceFile).toContain('ApiTypes.d.ts');
      expect(sourceFile).not.toContain('RawApiTypes.d.ts');
    }, 10000);

    it('should correctly identify itemTypes.rawList uses RawApiTypes version', () => {
      const { checker, clientClass } = cma;

      const signature = extractMethodSignature(
        checker,
        clientClass,
        'itemTypes',
        'rawList',
      );

      expect(signature).toBeDefined();
      assert(signature);

      expect(signature.referencedTypeSymbols).toBeDefined();
      expect(signature.referencedTypeSymbols.size).toBeGreaterThan(0);

      expect(
        signature.referencedTypeSymbols.has('ItemTypeInstancesTargetSchema'),
      ).toBe(true);

      const symbol = signature.referencedTypeSymbols.get(
        'ItemTypeInstancesTargetSchema',
      );
      expect(symbol).toBeDefined();
      assert(symbol);

      const declarations = symbol.getDeclarations();
      expect(declarations).toBeDefined();
      assert(declarations && declarations.length > 0);

      const sourceFile = declarations[0]?.getSourceFile().fileName;
      expect(sourceFile).toContain('RawApiTypes.d.ts');
      expect(sourceFile).toMatch(/\/RawApiTypes\.d\.ts$/);
    }, 10000);

    it('should extract different type definitions for list vs rawList', () => {
      const { program, checker, clientClass } = cma;

      const listSignature = extractMethodSignature(
        checker,
        clientClass,
        'itemTypes',
        'list',
      );
      assert(listSignature);
      const listResult = extractTypeDependencies(
        checker,
        program,
        Array.from(listSignature.referencedTypeSymbols.keys()),
        listSignature.referencedTypeSymbols,
      );

      const rawListSignature = extractMethodSignature(
        checker,
        clientClass,
        'itemTypes',
        'rawList',
      );
      assert(rawListSignature);
      const rawListResult = extractTypeDependencies(
        checker,
        program,
        Array.from(rawListSignature.referencedTypeSymbols.keys()),
        rawListSignature.referencedTypeSymbols,
      );

      expect({ listResult, rawListResult }).toMatchSnapshot();
    }, 10000);

    it('should preserve symbol information through extraction pipeline', () => {
      const { checker, clientClass } = cma;

      const listSignature = extractMethodSignature(
        checker,
        clientClass,
        'itemTypes',
        'list',
      );
      const rawListSignature = extractMethodSignature(
        checker,
        clientClass,
        'itemTypes',
        'rawList',
      );

      expect(listSignature).toBeDefined();
      expect(rawListSignature).toBeDefined();
      assert(listSignature);
      assert(rawListSignature);

      expect(
        listSignature.referencedTypeSymbols.has(
          'ItemTypeInstancesTargetSchema',
        ),
      ).toBe(true);
      expect(
        rawListSignature.referencedTypeSymbols.has(
          'ItemTypeInstancesTargetSchema',
        ),
      ).toBe(true);

      const listSymbol = listSignature.referencedTypeSymbols.get(
        'ItemTypeInstancesTargetSchema',
      );
      const rawListSymbol = rawListSignature.referencedTypeSymbols.get(
        'ItemTypeInstancesTargetSchema',
      );

      expect(listSymbol).toBeDefined();
      expect(rawListSymbol).toBeDefined();
      assert(listSymbol);
      assert(rawListSymbol);

      expect(listSymbol).not.toBe(rawListSymbol);

      const listDecls = listSymbol.getDeclarations();
      const rawListDecls = rawListSymbol.getDeclarations();

      expect(listDecls).toBeDefined();
      expect(rawListDecls).toBeDefined();
      assert(listDecls && listDecls.length > 0);
      assert(rawListDecls && rawListDecls.length > 0);

      const listFile = listDecls[0]?.getSourceFile().fileName;
      const rawListFile = rawListDecls[0]?.getSourceFile().fileName;

      expect(listFile).not.toBe(rawListFile);
      expect(listFile).toContain('ApiTypes.d.ts');
      expect(rawListFile).toContain('RawApiTypes.d.ts');
    }, 10000);
  });
});
