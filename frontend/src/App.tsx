import React, { useEffect, useState } from "react";
import { BrowserRouter } from "react-router-dom";
import { BlockstackSessionStore, useBSSession } from "./stores/BlockstackSessionStore";
import { createStore, StoreProvider } from "simstate";
import { LandingPage } from "./pages/Landing";
import { Header } from "./components/Header";
import { Footer } from "./components/Footer";
import { SignedInPage } from "./pages/SignedIn";
import { PageLoading } from "./components/PageLoading";

function App() {

  const { session, handlePendingSignIn } = useBSSession();

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if(!session.isUserSignedIn() && session.isSignInPending()) {
      setLoading(true);
      handlePendingSignIn().finally(() => {
        setLoading(false);
      });
    }
  }, []);

  return (
    <PageLoading show={loading}>
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
    </PageLoading>
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
