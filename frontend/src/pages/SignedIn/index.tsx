import React, { useEffect } from "react";
import { Container, Row } from "reactstrap";
import { useBSSession } from "src/stores/BlockstackSessionStore";
import { useRefreshToken } from "src/utils/useRefreshToken";
import { Banner } from "./Banner";
import { CertList } from "./CertList";
import { DownloadCert } from "./DownloadCert";
import "./SignedIn.css";

export const SignedInPage: React.FC = () => {

  const { session } = useBSSession();
  const [token, refresh] = useRefreshToken();


  useEffect(() => {
    if (!session.isUserSignedIn()) {
      session.redirectToSignIn();
    }
  });

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
      <Row width="12" className="my-4">
        <CertList refreshToken={token} />
      </Row>
      <Row width="12" className="my-4">
        <DownloadCert refreshCerts={refresh} />
      </Row>
    </Container>
  );
};
