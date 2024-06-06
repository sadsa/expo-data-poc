import * as React from 'react';
import { storage } from '~/services/storage';

type UseStateHook<T> = [[boolean, T | null], (value: T | null) => void];

function useAsyncState<T>(
  initialValue: [boolean, T | null] = [true, null]
): UseStateHook<T> {
  return React.useReducer(
    (
      state: [boolean, T | null],
      action: T | null = null
    ): [boolean, T | null] => [false, action],
    initialValue
  ) as UseStateHook<T>;
}

export function useStorageState(key: string): UseStateHook<string> {
  // Public
  const [state, setState] = useAsyncState<string>();

  // Get
  React.useEffect(() => {
    storage.getItemAsync(key).then(setState);
  }, [key, setState]);

  // Set
  const setValue = React.useCallback(
    (value: string | null) => {
      setState(value);
      storage.setItemAsync(key, value);
    },
    [key, setState]
  );

  return [state, setValue];
}
