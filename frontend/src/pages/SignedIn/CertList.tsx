import React, { useEffect, useState } from "react";
import { ListGroup, ListGroupItem } from "reactstrap";
import { CertRecord } from "src/models/CertRecord";
import { useBSSession } from "src/stores/BlockstackSessionStore";
import { downloadFileFromIPFS, getCertsInRemote } from "src/utils/file";

const CertLink: React.FC<{ cert: CertRecord; privateKey: string }>
= ({ cert, privateKey }) => {

  const onClick = () => {
    downloadFileFromIPFS(cert.hash, privateKey);
  };

  return (
    <ListGroupItem action tag="button" onClick={onClick} title="点击下载">
      {cert.major} {cert.issuer} ({cert.date})
    </ListGroupItem>
  );
};

interface Props {
  refreshToken: any;
}

export const CertList: React.FC<Props> = ({ refreshToken }) => {

  const { session } = useBSSession();

  const { username } = session.loadUserData();

  const [loading, setLoading] = useState(false);
  const [certs, setCerts] = useState<CertRecord[] | undefined>(undefined);

  useEffect(() => {
    setLoading(true);
    getCertsInRemote(session)
      .then((data) => setCerts(data))
      .finally(() => setLoading(false));
  }, [refreshToken]);

  return (
    <div className="col-lg-12 text-center">
      <h2>Student {username}</h2>

      <p>
        您已经保存的证书（点击下载）：
      </p>

      <ListGroup>
        {loading
          ? "加载中……"
          : ((certs ?? []).map((c, i) => (
            <CertLink
              key={i}
              cert={c}
              privateKey={session.loadUserData().appPrivateKey}
            />
          )))
        }
      </ListGroup>
    </div>
  );
};
