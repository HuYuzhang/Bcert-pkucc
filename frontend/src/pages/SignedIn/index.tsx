import React from "react";
import { Banner } from "./Banner";
import { CertList } from "./CertList";
import "./SignedIn.css";

export const SignedInPage: React.FC = () => {
  return (
    <div className="signInPage">
      <Banner />
      <CertList />
    </div>
  );
};
