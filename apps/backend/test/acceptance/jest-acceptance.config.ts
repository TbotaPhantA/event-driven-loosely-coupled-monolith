export default {
  "setupFiles": [
    "<rootDir>/setup-tests.ts",
  ],
  "setupFilesAfterEnv": [
    "<rootDir>/acceptance/globalBeforeAndAfterAll.ts",
  ],
  "moduleFileExtensions": [
    "js",
    "json",
    "ts"
  ],
  "rootDir": "../../test",
  "testRegex": ".*\\.spec\\.ts$",
  "transform": {
    "^.+\\.(t|j)s$": "ts-jest"
  },
  "collectCoverageFrom": [
    "**/*.(t|j)s"
  ],
  "coverageDirectory": "../coverage",
  "testEnvironment": "node"
}
