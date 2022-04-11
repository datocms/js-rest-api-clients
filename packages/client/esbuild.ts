import esbuild from 'esbuild';

esbuild
  .build({
    entryPoints: ['src/index.ts'],
    outdir: 'dist/browser',
    bundle: true,
    sourcemap: true,
    minify: true,
    splitting: true,
    format: 'esm',
    target: ['esnext'],
  })
  .catch(() => process.exit(1));
