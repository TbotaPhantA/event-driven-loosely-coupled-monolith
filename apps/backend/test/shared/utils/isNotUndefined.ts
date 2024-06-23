export function assertIsNotUndefined<T>(something: T | undefined): asserts something is T {
  if (something === undefined) {
    throw new Error('Assert is not undefined has failed!');
  }
}
