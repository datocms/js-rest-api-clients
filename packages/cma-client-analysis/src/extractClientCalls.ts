import ts from 'typescript';

export type ClientCall = {
  resource: string;
  method: string;
};

/**
 * Walks a script's AST and returns every distinct `client.<resource>.<method>(
 * ... )` call expression. Used to gate script execution on the agent having
 * verified each method through the api-reference chain.
 *
 * Only literal `client.x.y(...)` chains are matched — aliases like
 * `const c = client; c.items.find()` are NOT tracked.
 */
export function extractClientCalls(source: string): ClientCall[] {
  const seen = new Map<string, ClientCall>();

  const sourceFile = ts.createSourceFile(
    'script.ts',
    source,
    ts.ScriptTarget.Latest,
    true,
  );

  function visit(node: ts.Node) {
    if (ts.isCallExpression(node)) {
      const callee = node.expression;
      if (ts.isPropertyAccessExpression(callee)) {
        const inner = callee.expression;
        if (
          ts.isPropertyAccessExpression(inner) &&
          ts.isIdentifier(inner.expression) &&
          inner.expression.text === 'client'
        ) {
          const resource = inner.name.text;
          const method = callee.name.text;
          const key = `${resource}.${method}`;
          if (!seen.has(key)) {
            seen.set(key, { resource, method });
          }
        }
      }
    }
    ts.forEachChild(node, visit);
  }

  visit(sourceFile);

  return [...seen.values()];
}
