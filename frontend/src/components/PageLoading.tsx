import React from "react";
import { Spinner } from "reactstrap";
import "./PageLoading.css";

export interface Props {
  show: boolean;
}

export const PageLoading: React.FC<Props> = ({ show, children }) =>  {
  if (!show) { return <>{children}</>; }

  return (
    <>
      <div className="loading"></div>
      {children}
    </>
  );
};
