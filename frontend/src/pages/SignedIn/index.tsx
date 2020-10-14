import React from "react";
import { Container, Row } from "reactstrap";
import { Banner } from "./Banner";
import { CertList } from "./CertList";
import { DownloadCert } from "./DownloadCert";
import "./SignedIn.css";

export const SignedInPage: React.FC = () => {
  return (
    <Container fluid className="signInPage">
      <Row width="12">
        <Banner />
      </Row>
      <Row width="12" className="my-4">
        <CertList />
      </Row>
      <Row width="12" className="my-4">
        <DownloadCert />
      </Row>
    </Container>
  );
};
