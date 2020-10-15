import React from "react";
import { Container, Row } from "reactstrap";
import {
  useBSSession,
  useHandlingPendingSignInEffect,
} from "src/stores/BlockstackSessionStore";
import { Banner } from "./Banner";
import { DownloadCert } from "./DownloadCert";
import "./SignedIn.css";

export const SignedInPage: React.FC = () => {

  const { session } = useBSSession();

  useHandlingPendingSignInEffect();

  if (!session.isUserSignedIn()) {
    return (
      <Container fluid>
        <p>
          用户未登录
        </p>
        <p>
          正在重定向至登录界面……
        </p>
      </Container>
    );
  }

  return (
    <Container fluid className="signInPage">
      <Row width="12">
        <Banner />
      </Row>
      <Row width="12">
        <DownloadCert />
      </Row>
    </Container>
  );
};
