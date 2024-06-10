import * as React from 'react';
import { useStorageState } from '../hooks/use-storage-state';
import { sessionService } from '~/services/session';
import { env } from '~/env';

const SessionContext = React.createContext<{
  signIn: (username: string, password: string) => Promise<void>;
  signOut: () => void;
  sessionId?: string | null;
  environmentId?: string | null;
  isLoading: boolean;
}>({
  signIn: async () => {},
  signOut: () => null,
  sessionId: null,
  environmentId: null,
  isLoading: false
});

// This hook can be used to access the user info.
export function useSession() {
  const value = React.useContext(SessionContext);
  if (env.NODE_ENV !== 'production') {
    if (!value) {
      throw new Error('useSession must be wrapped in a <SessionProvider />');
    }
  }

  return value;
}

export function SessionProvider(props: React.PropsWithChildren) {
  const [[isLoadingSessionId, sessionId], setSessionId] =
    useStorageState('sessionId');
  const [[isLoadingEnvironmentId, environmentId], setEnvironmentId] =
    useStorageState('environmentId');

  return (
    <SessionContext.Provider
      value={{
        signIn: async (username: string, password: string) => {
          const { sessionId, environmentId } = await sessionService.login(
            username,
            password
          );
          setSessionId(sessionId);
          setEnvironmentId(environmentId);
        },
        signOut: () => {
          setSessionId(null);
          setEnvironmentId(null);
        },
        sessionId,
        environmentId,
        isLoading: isLoadingSessionId || isLoadingEnvironmentId
      }}
    >
      {props.children}
    </SessionContext.Provider>
  );
}
