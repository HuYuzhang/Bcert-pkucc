import React, { useEffect, useRef } from "react";
import { BrowserRouter, useHistory } from "react-router-dom";
import { BlockstackSessionStore, useBSSession } from "./stores/BlockstackSessionStore";
import { createStore, StoreProvider } from "simstate";
import Landing from "./pages/Landing";

function App() {

  const session = useBSSession();
  const history = useHistory();

  useEffect(() => {
    if(!session.isUserSignedIn() && session.isSignInPending()) {
      session.handlePendingSignIn()
        .then((userData) => {
          if(!userData.username) {
            throw new Error("This app requires a username.");
          }
          history.push(`/kingdom/${userData.username}`);
        });
    }
  }, []);

  return (
    <main>
      {session.isUserSignedIn()
        // ? <SignedIn />
        ? "logged in"
        : <Landing />

      }
    </main>
  );
}

const bsSessionStore = createStore(BlockstackSessionStore);

const RootApp = () => {
  return (
    <BrowserRouter>
      <StoreProvider stores={[bsSessionStore]}>
        <App />
      </StoreProvider>
    </BrowserRouter>
  );
};

export default RootApp;
