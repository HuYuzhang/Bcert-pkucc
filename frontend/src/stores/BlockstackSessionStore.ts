import { UserSession } from "blockstack";
import { useCallback, useRef, useState } from "react";
import { appConfig } from "src/utils/constants";
import { useStore } from "simstate";

const session = new UserSession({ appConfig });

export function BlockstackSessionStore() {

  const [, setRefreshToken] = useState(false);
  const refresh = useCallback(() => {
    setRefreshToken((f) => !f);
  }, []);

  const signOut = useCallback(() => {
    session.signUserOut();
    refresh();
  }, []);

  const handlePendingSignIn = useCallback(async () => {
    const userData = await session.handlePendingSignIn();
    if(!userData.username) {
      alert("This app requires a username.");
    } else {
      refresh();
    }
  }, []);

  return {
    session: useRef(session).current,
    signOut,
    handlePendingSignIn,
  };
}

export function useBSSession() {
  return useStore(BlockstackSessionStore);
}
