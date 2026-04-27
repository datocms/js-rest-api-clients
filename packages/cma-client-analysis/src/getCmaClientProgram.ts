import * as ts from 'typescript';

export type CmaClientProgram = {
  program: ts.Program;
  checker: ts.TypeChecker;
  clientClass: ts.ClassDeclaration;
};

/**
 * Builds a TypeScript program over `@datocms/cma-client-node`'s `.d.ts`
 * entry, returning the program, its type checker, and the `Client` class
 * declaration ready for introspection.
 *
 * **Cost.** Building the program parses the full client type surface — order
 * of hundreds of milliseconds. The result is intentionally *not* cached here:
 * lifetime is the consumer's call (one-shot CLI vs. long-running server).
 * Call once and thread the result through the `extract*` functions.
 *
 * Resolves the entry point through the `@datocms/cma-client-node/types`
 * sub-export so we don't depend on the package's internal `dist/` layout.
 */
export function getCmaClientProgram(): CmaClientProgram {
  const { program, checker } = createCmaClientProgram();
  const clientClass = findClientClass(program);

  if (!clientClass) {
    throw new Error(
      `Could not find Client class in @datocms/cma-client-node — CWD: ${process.cwd()}`,
    );
  }

  return { program, checker, clientClass };
}

function createCmaClientProgram(): {
  program: ts.Program;
  checker: ts.TypeChecker;
} {
  const entryPoint = require.resolve('@datocms/cma-client-node/types');

  const compilerOptions: ts.CompilerOptions = {
    target: ts.ScriptTarget.Latest,
    module: ts.ModuleKind.ESNext,
    moduleResolution: ts.ModuleResolutionKind.Node10,
    strict: false,
    esModuleInterop: true,
    skipLibCheck: true,
    noEmit: true,
    baseUrl: '.',
    paths: {},
  };

  const program = ts.createProgram([entryPoint], compilerOptions);
  const checker = program.getTypeChecker();

  return { program, checker };
}

function findClientClass(program: ts.Program): ts.ClassDeclaration | undefined {
  for (const sourceFile of program.getSourceFiles()) {
    if (sourceFile.fileName.includes('cma-client-node/dist/types/Client.d')) {
      const visit = (node: ts.Node): ts.ClassDeclaration | undefined => {
        if (ts.isClassDeclaration(node) && node.name?.text === 'Client') {
          return node;
        }
        return ts.forEachChild(node, visit);
      };

      const clientClass = visit(sourceFile);
      if (clientClass) return clientClass;
    }
  }

  return undefined;
}
