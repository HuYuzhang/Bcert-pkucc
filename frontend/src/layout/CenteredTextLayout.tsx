import React from "react";
import "./CenteredTextLayout.css";

export const CenteredTextLayout: React.FC = ({ children }) => {
  return (
    <div className="d-flex align-items-center justify-content-center centeredtextlayout">
      <p>
        {children}
      </p>
    </div>
  );
};
