export function toError(errorish: unknown): Error {
  if (errorish instanceof Error) {
    return errorish;
  }

  return new Error(String(errorish));
}
