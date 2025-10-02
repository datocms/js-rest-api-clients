module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  testTimeout: 480000,
  testMatch: ["**/*.test.ts"],
  transformIgnorePatterns: [
    "/packages/cma-client-node/node_modules/(?!(got|p-cancelable|@szmarczak|lowercase-keys)/)",
  ],
  setupFiles: ["dotenv/config"],
  globalSetup: "./jest-helpers/globalSetup.ts",
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
