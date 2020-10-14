import React, { } from "react";
import "./Landing.css";
import { VerifyCert } from "./VerifyCert";
import { Introduction } from "./Introduction";

export const LandingPage: React.FC = () => {

  return (
    <div>
      <VerifyCert />
      <Introduction />
    </div>
  );
};

