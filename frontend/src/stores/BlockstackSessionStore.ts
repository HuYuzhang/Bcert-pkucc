import { getPublicKeyFromPrivate, UserSession } from "blockstack";
import { useCallback, useEffect, useRef, useState } from "react";
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

  const getPublicKey = () => {
    return getPublicKeyFromPrivate(session.loadUserData().appPrivateKey);
  };

  const handlePendingSignIn = useCallback(async () => {
    const userData = await session.handlePendingSignIn();
    if(!userData.username) {
      alert("This app requires a username.");
    }

    // remove the querystring
    if (window !== undefined) {
      const path = window.location.href;
      const noQuerystring = path.split("?")[0];
      window.history.pushState({}, document.title, noQuerystring);
    }

    return userData;
  }, []);



  return {
    session: useRef(session).current,
    signOut,
    handlePendingSignIn,
    getPublicKey,
  };
}

export function useBSSession() {
  return useStore(BlockstackSessionStore);
}

export const useHandlingPendingSignInEffect = () => {

  const { session } = useBSSession();

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if(!session.isUserSignedIn()) {
      if (session.isSignInPending()) {
        setLoading(true);
        session.handlePendingSignIn()
          .finally(() => {
            setLoading(false);
          });
      } else {
        session.redirectToSignIn(window.location.href);
      }
    }
  }, []);

  return loading;
};
