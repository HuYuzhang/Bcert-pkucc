/* eslint-disable max-len */
import { downloadCertPath } from "src/api";
import React, { useState } from "react";

export const DownloadCert: React.FC = () => {

  const [hash, setHash] = useState("");

  return (
    <div className="ipfs">
      <div className="ipfscentre">
        <div className="ipfsleft">
          <p className="ipfstitle">
            证书原件下载
          </p>
          <p className="ipfsexplain">
            本系统中所有的证书在颁发时均使用用户的公钥加密并上传至IPFS系统，并将其哈希值随pdf文件一并发送至证书持有者邮箱。
          </p>
          <p className="ipfsexplain">
            若证书丢失或损毁，在右侧输入证书的哈希值即可在IPFS平台下载证书原件，并将自动使用用户的私钥进行解密。
          </p>
        </div>
        <div className="ipfsright">
          <input
            type="text" name="hash" value={hash} onChange={(e) => setHash(e.target.value)}
            className="number" placeholder="证书hash值"
          />
          <form method="get" action={downloadCertPath(hash)}>
            <button className="ok" type="submit">下载</button>
          </form>
        </div>
      </div>
    </div>
  );
};
