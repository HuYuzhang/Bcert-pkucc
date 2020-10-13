import React, { useMemo } from "react";
import { useBSSession } from "src/stores/BlockstackSessionStore";
import { getPublicKeyFromPrivate } from "blockstack";

export const UserInfo: React.FC = () => {
  const { session } = useBSSession();

  const { username, appPrivateKey } = session.loadUserData();

  const publicKey = useMemo(() =>
    getPublicKeyFromPrivate(appPrivateKey), [appPrivateKey]);

  return (
    <div>
      您的用户ID：{username} <br/>
      您的App Private Key：{appPrivateKey} <br/>
      您的App Public Key：{publicKey} <br/>
    </div>
  );
};
