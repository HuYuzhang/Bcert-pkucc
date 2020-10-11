import React, { } from "react";
import "./Landing.css";
import { VerifyCert } from "./VerifyCert";
import { DownloadCert } from "./DownloadCert";
import { Introduction } from "./Introduction";

export const LandingPage: React.FC = () => {

  return (
    <div>
      <VerifyCert />
      <DownloadCert />
      <Introduction />
    </div>
  );
};

