module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  testTimeout: 240000,
  testMatch: ["**/*.test.ts"],
  moduleNameMapper: {
    "^(\\.{1,2}/.*)\\.js$": "$1",
  },
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
