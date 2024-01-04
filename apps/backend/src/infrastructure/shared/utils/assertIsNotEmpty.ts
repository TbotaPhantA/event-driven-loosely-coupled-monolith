export function assertIsNotEmpty <T>(value: T | undefined | null): asserts value is T {
  if (!value) {
    throw new Error('value should not be undefined');
  }
}
