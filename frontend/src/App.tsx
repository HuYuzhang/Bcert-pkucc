import React, { useEffect, useRef } from 'react';
import logo from './logo.svg';
import './App.css';
import { UserSession } from "blockstack";


function App() {

  const session = useRef(new UserSession()).current;

  useEffect(() => {
    if(!session.isUserSignedIn() && session.isSignInPending()) {
      session.handlePendingSignIn()
      .then((userData) => {
        if(!userData.username) {
          throw new Error("This app requires a username.")
        }
        window.location = `/kingdom/${userData.username}`
      });
    }
  }, []);

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.tsx</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

export default App;
