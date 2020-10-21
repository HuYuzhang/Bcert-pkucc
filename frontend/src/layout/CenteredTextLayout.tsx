import React from "react";
import { Helmet } from "react-helmet";
import { siteName } from "src/utils/helmet";
import "./CenteredTextLayout.css";

export const CenteredTextLayout: React.FC = ({ children }) => {
  return (
    <div className="d-flex align-items-center justify-content-center centeredtextlayout">
      <Helmet>
        <title>{siteName}</title>
      </Helmet>
      <p>
        {children}
      </p>
    </div>
  );
};
