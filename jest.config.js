module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  testTimeout: 60000,
  testMatch: ['**/*.test.ts'],
  transformIgnorePatterns: [
    '/packages/cma-client-node/node_modules/(?!(got|p-cancelable|@szmarczak|lowercase-keys)/)',
  ],
  // collectCoverage: true,
  // collectCoverageFrom: [
  //   'packages/**/*.[jt]s?(x)',
  //   '!**/node_modules/**',
  //   '!**/__test__/**',
  //   '!**/dist/**',
  //   '!**/rollup.config.js',
  // ],
  // roots: ['packages/'],
  // testPathIgnorePatterns: ['/dist/'],
  // transform: {
  //   '^.+\\.tsx?$': 'ts-jest',
  // },
};
