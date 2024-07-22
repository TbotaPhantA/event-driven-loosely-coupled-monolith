export default {
  "setupFiles": [
    "<rootDir>/setup-tests.ts",
  ],
  "setupFilesAfterEnv": [],
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
  "testEnvironment": "allure-jest/node"
}
