/**
 * Tree manipulation utilities for DatoCMS structured text documents.
 *
 * Provides a set of low-level utilities for visiting, transforming, and querying
 * structured text trees. Works with all tree variants (regular, request, nested).
 */

/**
 * Recursively extract all possible node types that can appear in a tree structure
 */
type AllNodesInTree<T, Depth extends number = 10> = Depth extends 0
  ? T extends readonly unknown[]
    ? never
    : T
  : T extends readonly (infer U)[]
    ? AllNodesInTree<U, Prev<Depth>>
    : T extends { children: infer Children }
      ? T | AllNodesInTree<Children, Prev<Depth>>
      : T;

type Prev<T extends number> = T extends 0
  ? 0
  : T extends 1
    ? 0
    : T extends 2
      ? 1
      : T extends 3
        ? 2
        : T extends 4
          ? 3
          : T extends 5
            ? 4
            : T extends 6
              ? 5
              : T extends 7
                ? 6
                : T extends 8
                  ? 7
                  : T extends 9
                    ? 8
                    : T extends 10
                      ? 9
                      : number;

/**
 * Path through the Structured Text tree structure
 */
export type TreePath = readonly (string | number)[];

/**
 * Generic predicate function type for Structured Text tree node filtering
 */
export type NodePredicate<T, R> = (
  node: AllNodesInTree<T>,
  parent: AllNodesInTree<T> | null,
  path: TreePath,
) => R;

/**
 * Check if a value has children property that is an array
 */
function hasChildren(node: unknown): node is { children: readonly unknown[] } {
  return (
    typeof node === 'object' &&
    node !== null &&
    'children' in node &&
    Array.isArray(node.children)
  );
}

/**
 * Visit every node in the Structured Text tree, calling the visitor function for each.
 * Uses pre-order traversal (parent is visited before its children).
 *
 * @template T - The type of the root node in the Structured Text tree
 * @param node - The root node to start visiting from
 * @param visitor - Synchronous function called for each node. Receives the node, its parent, and path through the Structured Text tree
 */
export function visitNodes<T>(
  node: T,
  visitor: NodePredicate<T, void>,
  parent: AllNodesInTree<T> | null = null,
  path: TreePath = [],
): void {
  // Visit current node
  visitor(node as AllNodesInTree<T>, parent, path);

  // Recursively visit children
  if (hasChildren(node)) {
    for (let index = 0; index < node.children.length; index++) {
      const child = node.children[index];
      visitNodes(child as T, visitor, node as AllNodesInTree<T>, [
        ...path,
        'children',
        index,
      ]);
    }
  }
}

/**
 * Visit every node in the Structured Text tree, calling the visitor function for each.
 * Uses pre-order traversal (parent is visited before its children).
 *
 * @template T - The type of the root node in the Structured Text tree
 * @param node - The root node to start visiting from
 * @param visitor - Asynchronous function called for each node. Receives the node, its parent, and path through the Structured Text tree
 * @returns Promise that resolves when all nodes have been visited
 */
export async function visitNodesAsync<T>(
  node: T,
  visitor: NodePredicate<T, Promise<void>>,
  parent: AllNodesInTree<T> | null = null,
  path: TreePath = [],
): Promise<void> {
  // Visit current node
  await visitor(node as AllNodesInTree<T>, parent, path);

  // Recursively visit children
  if (hasChildren(node)) {
    for (let index = 0; index < node.children.length; index++) {
      const child = node.children[index];
      await visitNodesAsync(child as T, visitor, node as AllNodesInTree<T>, [
        ...path,
        'children',
        index,
      ]);
    }
  }
}

/**
 * Transform nodes in the Structured Text tree by applying a mapping function.
 * Creates a new tree structure with transformed nodes while preserving the Structured Text tree hierarchy.
 *
 * @template T - The type of nodes in the input Structured Text tree
 * @template R - The type of nodes in the output tree
 * @param node - The root node to start mapping from
 * @param mapper - Synchronous function that transforms each node. Receives the node, its parent, and path
 * @returns The transformed tree
 */
export function mapNodes<T, R>(
  node: T,
  mapper: NodePredicate<T, R>,
  parent: AllNodesInTree<T> | null = null,
  path: TreePath = [],
): R {
  // Transform current node
  const transformedNode = mapper(node as AllNodesInTree<T>, parent, path);

  // If the original node has children, recursively transform them
  if (
    hasChildren(node) &&
    typeof transformedNode === 'object' &&
    transformedNode !== null
  ) {
    const transformedChildren = node.children.map((child, index) =>
      mapNodes(child as T, mapper, node as AllNodesInTree<T>, [
        ...path,
        'children',
        index,
      ]),
    );

    return {
      ...transformedNode,
      children: transformedChildren,
    } as R;
  }

  return transformedNode;
}

/**
 * Transform nodes in the Structured Text tree by applying a mapping function.
 * Creates a new tree structure with transformed nodes while preserving the Structured Text tree hierarchy.
 *
 * @template T - The type of nodes in the input Structured Text tree
 * @template R - The type of nodes in the output tree
 * @param node - The root node to start mapping from
 * @param mapper - Asynchronous function that transforms each node. Receives the node, its parent, and path
 * @returns Promise that resolves to the transformed tree
 */
export async function mapNodesAsync<T, R>(
  node: T,
  mapper: NodePredicate<T, Promise<R>>,
  parent: AllNodesInTree<T> | null = null,
  path: TreePath = [],
): Promise<R> {
  // Transform current node
  const transformedNode = await mapper(node as AllNodesInTree<T>, parent, path);

  // If the original node has children, recursively transform them
  if (
    hasChildren(node) &&
    typeof transformedNode === 'object' &&
    transformedNode !== null
  ) {
    const transformedChildren = await Promise.all(
      node.children.map((child, index) =>
        mapNodesAsync(child as T, mapper, node as AllNodesInTree<T>, [
          ...path,
          'children',
          index,
        ]),
      ),
    );

    return {
      ...transformedNode,
      children: transformedChildren,
    } as R;
  }

  return transformedNode;
}

/**
 * Find all nodes that match the predicate function using depth-first search.
 * Returns an array containing all matching nodes along with their paths through the Structured Text tree.
 *
 * @template T - The type of nodes in the Structured Text tree
 * @param node - The root node to start searching from
 * @param predicate - Synchronous function that tests each node. Should return true for desired nodes
 * @returns Array of objects, each containing a matching node and its path
 */
export function findAllNodes<T>(
  node: T,
  predicate: NodePredicate<T, boolean>,
  parent: AllNodesInTree<T> | null = null,
  path: TreePath = [],
): Array<{ node: AllNodesInTree<T>; path: TreePath }> {
  const results: Array<{ node: AllNodesInTree<T>; path: TreePath }> = [];

  visitNodes(
    node,
    (currentNode, currentParent, currentPath) => {
      if (predicate(currentNode, currentParent, currentPath)) {
        results.push({ node: currentNode, path: currentPath });
      }
    },
    parent,
    path,
  );

  return results;
}

/**
 * Find all nodes that match the predicate function using depth-first search.
 * Returns an array containing all matching nodes along with their paths through the Structured Text tree.
 *
 * @template T - The type of nodes in the Structured Text tree
 * @param node - The root node to start searching from
 * @param predicate - Asynchronous function that tests each node. Should return true for desired nodes
 * @returns Promise that resolves to an array of objects, each containing a matching node and its path
 */
export async function findAllNodesAsync<T>(
  node: T,
  predicate: NodePredicate<T, Promise<boolean>>,
  parent: AllNodesInTree<T> | null = null,
  path: TreePath = [],
): Promise<Array<{ node: AllNodesInTree<T>; path: TreePath }>> {
  const results: Array<{ node: AllNodesInTree<T>; path: TreePath }> = [];

  await visitNodesAsync(
    node,
    async (currentNode, currentParent, currentPath) => {
      if (await predicate(currentNode, currentParent, currentPath)) {
        results.push({ node: currentNode, path: currentPath });
      }
    },
    parent,
    path,
  );

  return results;
}

/**
 * Filter nodes in the Structured Text tree, removing those that don't match the predicate.
 * Creates a new tree structure containing only nodes that pass the predicate test.
 * Maintains the Structured Text tree hierarchy - if a parent node is kept, its structure is preserved.
 *
 * @template T - The type of nodes in the Structured Text tree
 * @param node - The root node to start filtering from
 * @param predicate - Synchronous function that tests each node. Nodes returning false are removed
 * @returns The filtered tree, or null if root node is filtered out
 */
export function filterNodes<T>(
  node: T,
  predicate: NodePredicate<T, boolean>,
  parent: AllNodesInTree<T> | null = null,
  path: TreePath = [],
): T | null {
  // If current node doesn't match predicate, return null
  if (!predicate(node as AllNodesInTree<T>, parent, path)) {
    return null;
  }

  // If node has no children, return it as-is
  if (!hasChildren(node)) {
    return node;
  }

  // Filter children recursively
  const childrenResults = node.children.map((child, index) =>
    filterNodes(child as T, predicate, node as AllNodesInTree<T>, [
      ...path,
      'children',
      index,
    ]),
  );
  const filteredChildren = childrenResults.filter(
    (child): child is NonNullable<typeof child> => child !== null,
  );

  return {
    ...node,
    children: filteredChildren,
  } as T;
}

/**
 * Filter nodes in the Structured Text tree, removing those that don't match the predicate.
 * Creates a new tree structure containing only nodes that pass the predicate test.
 * Maintains the Structured Text tree hierarchy - if a parent node is kept, its structure is preserved.
 *
 * @template T - The type of nodes in the Structured Text tree
 * @param node - The root node to start filtering from
 * @param predicate - Asynchronous function that tests each node. Nodes returning false are removed
 * @returns Promise that resolves to the filtered tree, or null if root node is filtered out
 */
export async function filterNodesAsync<T>(
  node: T,
  predicate: NodePredicate<T, Promise<boolean>>,
  parent: AllNodesInTree<T> | null = null,
  path: TreePath = [],
): Promise<T | null> {
  // If current node doesn't match predicate, return null
  if (!(await predicate(node as AllNodesInTree<T>, parent, path))) {
    return null;
  }

  // If node has no children, return it as-is
  if (!hasChildren(node)) {
    return node;
  }

  // Filter children recursively
  const childrenResults = await Promise.all(
    node.children.map((child, index) =>
      filterNodesAsync(child as T, predicate, node as AllNodesInTree<T>, [
        ...path,
        'children',
        index,
      ]),
    ),
  );
  const filteredChildren = childrenResults.filter(
    (child): child is NonNullable<typeof child> => child !== null,
  );

  return {
    ...node,
    children: filteredChildren,
  } as T;
}

/**
 * Reduce the Structured Text tree to a single value by applying a reducer function to each node.
 * Uses pre-order traversal (parent is processed before its children).
 * The reducer function is called for each node with the current accumulator value.
 *
 * @template T - The type of nodes in the Structured Text tree
 * @template R - The type of the accumulated result
 * @param node - The root node to start reducing from
 * @param reducer - Synchronous function that processes each node and updates the accumulator
 * @param initialValue - The initial value for the accumulator
 * @returns The final accumulated value
 */
export function reduceNodes<T, R>(
  node: T,
  reducer: (
    accumulator: R,
    node: AllNodesInTree<T>,
    parent: AllNodesInTree<T> | null,
    path: TreePath,
  ) => R,
  initialValue: R,
  parent: AllNodesInTree<T> | null = null,
  path: TreePath = [],
): R {
  let accumulator = initialValue;

  visitNodes(
    node,
    (currentNode, currentParent, currentPath) => {
      accumulator = reducer(
        accumulator,
        currentNode,
        currentParent,
        currentPath,
      );
    },
    parent,
    path,
  );

  return accumulator;
}

/**
 * Reduce the Structured Text tree to a single value by applying a reducer function to each node.
 * Uses pre-order traversal (parent is processed before its children).
 * The reducer function is called for each node with the current accumulator value.
 *
 * @template T - The type of nodes in the Structured Text tree
 * @template R - The type of the accumulated result
 * @param node - The root node to start reducing from
 * @param reducer - Asynchronous function that processes each node and updates the accumulator
 * @param initialValue - The initial value for the accumulator
 * @returns Promise that resolves to the final accumulated value
 */
export async function reduceNodesAsync<T, R>(
  node: T,
  reducer: (
    accumulator: R,
    node: AllNodesInTree<T>,
    parent: AllNodesInTree<T> | null,
    path: TreePath,
  ) => Promise<R>,
  initialValue: R,
  parent: AllNodesInTree<T> | null = null,
  path: TreePath = [],
): Promise<R> {
  let accumulator = initialValue;

  await visitNodesAsync(
    node,
    async (currentNode, currentParent, currentPath) => {
      accumulator = await reducer(
        accumulator,
        currentNode,
        currentParent,
        currentPath,
      );
    },
    parent,
    path,
  );

  return accumulator;
}

/**
 * Check if any node in the Structured Text tree matches the predicate function.
 * Returns true as soon as the first matching node is found (short-circuit evaluation).
 *
 * @template T - The type of nodes in the Structured Text tree
 * @param node - The root node to start searching from
 * @param predicate - Synchronous function that tests each node. Should return true for matching nodes
 * @returns True if any node matches, false otherwise
 */
export function someNode<T>(
  node: T,
  predicate: NodePredicate<T, boolean>,
  parent: AllNodesInTree<T> | null = null,
  path: TreePath = [],
): boolean {
  // Check current node
  if (predicate(node as AllNodesInTree<T>, parent, path)) {
    return true;
  }

  // Recursively check children
  if (hasChildren(node)) {
    for (let index = 0; index < node.children.length; index++) {
      const child = node.children[index];
      if (
        someNode(child as T, predicate, node as AllNodesInTree<T>, [
          ...path,
          'children',
          index,
        ])
      ) {
        return true;
      }
    }
  }

  return false;
}

/**
 * Check if any node in the Structured Text tree matches the predicate function.
 * Returns true as soon as the first matching node is found (short-circuit evaluation).
 *
 * @template T - The type of nodes in the Structured Text tree
 * @param node - The root node to start searching from
 * @param predicate - Asynchronous function that tests each node. Should return true for matching nodes
 * @returns Promise that resolves to true if any node matches, false otherwise
 */
export async function someNodeAsync<T>(
  node: T,
  predicate: NodePredicate<T, Promise<boolean>>,
  parent: AllNodesInTree<T> | null = null,
  path: TreePath = [],
): Promise<boolean> {
  // Check current node
  if (await predicate(node as AllNodesInTree<T>, parent, path)) {
    return true;
  }

  // Recursively check children
  if (hasChildren(node)) {
    for (let index = 0; index < node.children.length; index++) {
      const child = node.children[index];
      if (
        await someNodeAsync(child as T, predicate, node as AllNodesInTree<T>, [
          ...path,
          'children',
          index,
        ])
      ) {
        return true;
      }
    }
  }

  return false;
}

/**
 * Check if every node in the Structured Text tree matches the predicate function.
 * Returns false as soon as the first non-matching node is found (short-circuit evaluation).
 *
 * @template T - The type of nodes in the Structured Text tree
 * @param node - The root node to start testing from
 * @param predicate - Synchronous function that tests each node. Should return true for valid nodes
 * @returns True if all nodes match, false otherwise
 */
export function everyNode<T>(
  node: T,
  predicate: NodePredicate<T, boolean>,
  parent: AllNodesInTree<T> | null = null,
  path: TreePath = [],
): boolean {
  return !someNode(
    node,
    (
      currentNode: AllNodesInTree<T>,
      currentParent: AllNodesInTree<T> | null,
      currentPath: TreePath,
    ) => {
      return !predicate(currentNode, currentParent, currentPath);
    },
    parent,
    path,
  );
}

/**
 * Check if every node in the Structured Text tree matches the predicate function.
 * Returns false as soon as the first non-matching node is found (short-circuit evaluation).
 *
 * @template T - The type of nodes in the Structured Text tree
 * @param node - The root node to start testing from
 * @param predicate - Asynchronous function that tests each node. Should return true for valid nodes
 * @returns Promise that resolves to true if all nodes match, false otherwise
 */
export async function everyNodeAsync<T>(
  node: T,
  predicate: NodePredicate<T, Promise<boolean>>,
  parent: AllNodesInTree<T> | null = null,
  path: TreePath = [],
): Promise<boolean> {
  return !(await someNodeAsync(
    node,
    async (
      currentNode: AllNodesInTree<T>,
      currentParent: AllNodesInTree<T> | null,
      currentPath: TreePath,
    ) => {
      return !(await predicate(currentNode, currentParent, currentPath));
    },
    parent,
    path,
  ));
}
