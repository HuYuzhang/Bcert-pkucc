import React, { useEffect, useState } from "react";
import { ListGroup, ListGroupItem } from "reactstrap";
import { CertRecord } from "src/models/CertRecord";
import { useBSSession } from "src/stores/BlockstackSessionStore";
import { downloadFileFromIPFS, getCertsInRemote } from "src/utils/file";

interface CertLinkProps {
  cert: CertRecord;
  privateKey: string;
  setPreparingDownloading: (f: boolean) => void;
}

const CertLink: React.FC<CertLinkProps> = ({
  cert,
  privateKey,
  setPreparingDownloading,
}) => {

  const onClick = () => {
    setPreparingDownloading(true);
    downloadFileFromIPFS(cert.hash, privateKey)
      .finally(() => setPreparingDownloading(false));
  };

  return (
    <ListGroupItem action tag="button" onClick={onClick} title="点击下载">
      {cert.major} {cert.issuer} ({cert.date})
    </ListGroupItem>
  );
};

interface Props {
  refreshToken: any;
  setPreparingDownload: (s: boolean) => void;
}

export const CertList: React.FC<Props> = ({ refreshToken, setPreparingDownload }) => {

  const { session } = useBSSession();

  const [loading, setLoading] = useState(false);
  const [certs, setCerts] = useState<CertRecord[] | undefined>(undefined);


  useEffect(() => {
    setLoading(true);
    getCertsInRemote(session)
      .then((data) => setCerts(data))
      .finally(() => setLoading(false));
  }, [refreshToken]);

  return (
    <ListGroup>
      {loading
        ? "加载中……"
        : ((certs ?? []).map((c, i) => (
          <CertLink
            setPreparingDownloading={setPreparingDownload}
            key={i}
            cert={c}
            privateKey={session.loadUserData().appPrivateKey}
          />
        )))
      }
    </ListGroup>
  );
};
