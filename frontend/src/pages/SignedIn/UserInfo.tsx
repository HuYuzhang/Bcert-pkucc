import React, { useMemo } from "react";
import { useBSSession } from "src/stores/BlockstackSessionStore";
import { ec as EC } from "elliptic";

const ec = new EC("secp256k1");

export const UserInfo: React.FC = () => {
  const { session } = useBSSession();

  const { username, appPrivateKey } = session.loadUserData();

  const publicKey = useMemo(() =>
    ec.keyFromPrivate(appPrivateKey).getPublic("hex"), [appPrivateKey]);

  return (
    <div>
      您的用户ID：{username} <br/>
      您的App Private Key：{appPrivateKey} <br/>
      您的App Public Key：{publicKey} <br/>
    </div>
  );
};
