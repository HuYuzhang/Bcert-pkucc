/* eslint-disable max-len */
import React, { useState } from "react";
import { decryptFileContent, downloadBuffer, downloadFromIPFS } from "src/utils/file";
import { useBSSession } from "src/stores/BlockstackSessionStore";

export const DownloadCert: React.FC = () => {

  const { session } = useBSSession();
  const [hash, setHash] = useState("");

  const downloadFile = async () => {

    try {
      // download file
      console.log(`Starting download file ${hash} from IPFS...`);
      const content = await downloadFromIPFS(hash);

      // decrypt file
      console.log("Download complete. Starting decrypting file...");
      const decrypted = decryptFileContent(content, session.loadUserData().appPrivateKey);

      // init download
      console.log("Decryption complete. Initiating download...");
      downloadBuffer(decrypted);

    } catch (e) {
      console.error(e);
    }
  };

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
          <button className="ok" type="submit" onClick={downloadFile}>下载</button>
        </div>
      </div>
    </div>
  );
};
