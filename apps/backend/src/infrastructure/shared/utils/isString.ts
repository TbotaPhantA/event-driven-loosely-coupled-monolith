export const isString = (stringCandidate: string | any): stringCandidate is string =>
  typeof stringCandidate === 'string';
