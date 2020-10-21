import React, { } from "react";
import "./Landing.css";
import { VerifyCert } from "./VerifyCert";
import { Introduction } from "./Introduction";
import { Helmet } from "react-helmet";
import { siteName } from "src/utils/helmet";

export const LandingPage: React.FC = () => {

  return (
    <div>
      <Helmet>
        <title>{siteName}</title>
      </Helmet>
      <VerifyCert />
      <Introduction />
    </div>
  );
};

