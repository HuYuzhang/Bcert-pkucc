import React, { useEffect, useState } from "react";
import { BrowserRouter, useHistory } from "react-router-dom";
import { BlockstackSessionStore, useBSSession } from "./stores/BlockstackSessionStore";
import { createStore, StoreProvider } from "simstate";
import { LandingPage } from "./pages/Landing";
import { Header } from "./components/Header";
import { Footer } from "./components/Footer";
import { SignedInPage } from "./pages/SignedIn";

function App() {

  const { session, handlePendingSignIn } = useBSSession();

  useEffect(() => {
    if(!session.isUserSignedIn() && session.isSignInPending()) {
      handlePendingSignIn();
    }
  }, []);

  return (
    <div>
      <Header />
      <main>
        {session.isUserSignedIn()
          ? <SignedInPage />
          : <LandingPage />
        }
      </main>
      <Footer />
    </div>
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
