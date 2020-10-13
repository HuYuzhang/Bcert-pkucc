import React, { useMemo } from "react";
import { useBSSession } from "src/stores/BlockstackSessionStore";
import { getPublicKeyFromPrivate } from "blockstack";
import { Button, Card, CardBody, CardText, CardTitle } from "reactstrap";

import { decrypt, PrivateKey } from "eciesjs";

function hexEncode(str: string){
  return Buffer.from(str, "hex");
}

export const UserInfo: React.FC = () => {
  const { session } = useBSSession();

  const { username, appPrivateKey } = session.loadUserData();

  const publicKey = useMemo(() =>
    getPublicKeyFromPrivate(appPrivateKey), [appPrivateKey]);

  const onClick = async () => {

    /**
     * python 使用ECIES加密
     *
>>> content = "content to encrypt"
>>> from ecies import encrypt, decrypt
>>> encrypted = encrypt(public_key, content.encode("utf-8")) # 加密信息
>>> import base64
>>> base64.b64encode(encrypted)
     *
     */

    // js 解密
    const privateKey = new PrivateKey(hexEncode(appPrivateKey));

    // eslint-disable-next-line max-len
    const encrypted = "BO89in9SVh8Dp+0AekJkqRFOpdbTbu8d+JQ6qeUVKPa7snZsIPedXu1ceIjgqXYmkOQgcgqLadGg62o9vZrw5AyBmVpz1s0UuSWBODf4dpBhX/uG/7cHhzWmt67NkShdxgoixa0BCLpmc7kXLBFsC7MbmQ=='";

    const encryptedBuffer = Buffer.from(encrypted, "base64");

    const decrypted = decrypt(privateKey.toHex(), encryptedBuffer).toString("utf-8");

    console.log(decrypted);


  };

  const copyPublicKey = () => {
    const input = document.createElement("textarea");
    input.innerHTML = publicKey;
    document.body.appendChild(input);
    input.select();
    document.execCommand("copy");
    document.body.removeChild(input);
  };

  return (
    <Card>
      <CardTitle>我的信息</CardTitle>
      <CardBody>
        <CardText>
          您的用户ID：{username} <br/>
        </CardText>
        <Button onClick={copyPublicKey}>
          复制公钥
        </Button>
      </CardBody>
    </Card>
  );
};
