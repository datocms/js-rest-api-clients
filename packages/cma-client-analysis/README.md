[![Node.js CI](https://github.com/datocms/js-rest-api-clients/actions/workflows/node.js.yml/badge.svg)](https://github.com/datocms/js-rest-api-clients/actions/workflows/node.js.yml)

# DatoCMS CMA Client Analysis

Static-analysis utilities for `@datocms/cma-client-node`, built on the TypeScript Compiler API. Inspects the `Client` class to extract method signatures, resolve referenced types, and produce ready-to-render TypeScript snippets — useful for generating API reference docs, AI tooling, or any introspection of the CMA client surface.

## Installation

```bash
npm install @datocms/cma-client-analysis @datocms/cma-client-node @datocms/rest-api-reference typescript
```

`@datocms/cma-client-node`, `@datocms/rest-api-reference`, and `typescript` are peer dependencies — the package introspects whichever versions of them are installed in your tree, so the output is always in sync with the client you actually run.

## Usage

```typescript
import {
  getCmaClientProgram,
  extractAllMethodNames,
  extractMethodSignature,
  extractResourcesEndpointMethods,
  extractTypeDependencies,
} from '@datocms/cma-client-analysis';

// Build a TypeScript program over @datocms/cma-client-node's .d.ts entry.
// Expensive (~hundreds of ms): build once, thread through every extract* call.
const { program, checker, clientClass } = getCmaClientProgram();

// All method names available on a resource.
extractAllMethodNames(checker, clientClass, 'items');
// → ['list', 'find', 'create', 'rawList', 'rawFind', 'rawCreate', ...]

// Full signature for one method, including referenced type symbols.
const signature = extractMethodSignature(checker, clientClass, 'items', 'create');
// → { methodName, parameters, returnType, referencedTypeSymbols, ... }

// All client methods that implement a given REST endpoint, matched by docUrl.
import { findResourcesEntityByNamespace, findResourcesEndpointByRel, parseResourcesSchema } from '@datocms/rest-api-reference';
import resourcesJson from '@datocms/cma-client/resources.json';

const resourcesSchema = parseResourcesSchema(resourcesJson);
const entity = findResourcesEntityByNamespace(resourcesSchema, 'menuItems');
const endpoint = findResourcesEndpointByRel(entity!, 'create');

const methods = extractResourcesEndpointMethods(checker, clientClass, endpoint!);
// → [
//     { name: 'create',    functionDefinition: 'create(body: MenuItemCreateSchema): Promise<MenuItem>',                  referencedTypes: Set { ... } },
//     { name: 'rawCreate', functionDefinition: 'rawCreate(body: MenuItemCreateSchema): Promise<MenuItemCreateTargetSchema>', referencedTypes: Set { ... } },
//   ]

// Inline TypeScript declarations for a set of referenced types, walking up to a depth.
const { expandedTypes, notExpandedTypes } = extractTypeDependencies(
  checker,
  program,
  Array.from(signature!.referencedTypeSymbols.keys()),
  signature!.referencedTypeSymbols,
  { maxDepth: 2 },
);
```

## Caching

`getCmaClientProgram()` is *not* cached — every call rebuilds the program. The cost (parsing the full client `.d.ts` graph) is non-trivial, so:

- **One-shot processes** (CLIs, scripts): call once at startup, thread the result through.
- **Long-running processes** (servers, MCP): wrap the call in your own memoization.

This keeps the lifetime decision in the consumer's hands instead of pinning it to module-level state.
