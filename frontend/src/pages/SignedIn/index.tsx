import React from "react";
import { Col, Container, Row } from "reactstrap";
import { Banner } from "./Banner";
import { CertList } from "./CertList";
import "./SignedIn.css";
import { UserInfo } from "./UserInfo";

export const SignedInPage: React.FC = () => {
  return (
    <Container fluid className="signInPage">
      <Row width="12">
        <Banner />
      </Row>
      <Row width="12" className="my-4">
        <CertList />
      </Row>
    </Container>
  );
};
