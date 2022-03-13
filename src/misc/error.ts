import { useCallback, useState } from "react";

export type SetError = (error: Error | null) => void;

export function useError(): [Error | null, SetError] {
  const [error, setError] = useState<Error | null>(null);

  const onError = useCallback<SetError>((newError) => {
    if (newError) {
      console.error(newError);
    }

    setError(newError);
  }, [setError]);

  return [error, onError];
}

export function toError(errorish: unknown): Error {
  if (errorish instanceof Error) {
    return errorish;
  }

  return new Error(String(errorish));
}
