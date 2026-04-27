import type { ResourcesEndpoint } from '@datocms/rest-api-reference';
import type ts from 'typescript';
import { extractAllMethodNames } from './extractAllMethodNames';
import {
  extractMethodSignature,
  formatMethodSignature,
} from './extractMethodSignature';

/**
 * Represents a method extracted from the JS Client for a specific endpoint.
 */
export type ExtractedResourcesEndpointMethod = {
  /** The method name */
  name: string;
  /** The formatted TypeScript function signature */
  functionDefinition: string;
  /** Set of type names referenced in the method signature */
  referencedTypes: Set<string>;
};

/**
 * Extracts all client method signatures whose JSDoc `Read more:` URL matches
 * the given endpoint's `docUrl` — i.e. the methods that implement that REST
 * action (e.g. `create`, `rawCreate`, `createFromUrl`).
 *
 * Pass the `checker`/`clientClass` you obtained from `getCmaClientProgram()`
 * — building one is expensive, so callers are expected to thread the same
 * program through every `extract*` invocation.
 */
export function extractResourcesEndpointMethods(
  checker: ts.TypeChecker,
  clientClass: ts.ClassDeclaration,
  endpoint: ResourcesEndpoint,
): ExtractedResourcesEndpointMethod[] {
  const methods: ExtractedResourcesEndpointMethod[] = [];
  const expectedDocUrl = endpoint.docUrl;

  const allMethodNames = extractAllMethodNames(
    checker,
    clientClass,
    endpoint.namespace,
  );

  for (const methodName of allMethodNames) {
    const signature = extractMethodSignature(
      checker,
      clientClass,
      endpoint.namespace,
      methodName,
    );

    if (!signature) continue;
    if (signature.actionUrl !== expectedDocUrl) continue;

    methods.push({
      name: methodName,
      functionDefinition: formatMethodSignature(signature),
      referencedTypes: new Set(signature.referencedTypeSymbols.keys()),
    });
  }

  return methods;
}
