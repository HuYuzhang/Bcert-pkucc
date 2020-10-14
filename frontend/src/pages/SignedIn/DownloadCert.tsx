/* eslint-disable max-len */
import { downloadCertPath, ipfsRoot } from "src/api";
import React, { useState } from "react";
import ipfsHttpClient from "ipfs-http-client";

async function getFileContent(iterator: AsyncIterable<Uint8Array>): Promise<Uint8Array> {

  const content = [] as Uint8Array[];
  let size = 0;
  for await (const chunk of iterator) {
    content.push(chunk as Uint8Array);
    size += content.length;
  }

  const fileContent = new Uint8Array(size);
  let offset = 0;
  content.forEach((item) => {
    fileContent.set(item, offset);
    offset += item.length;
  });

  return fileContent;

}

export const DownloadCert: React.FC = () => {

  const [hash, setHash] = useState("");

  const downloadFile = async () => {
    const ipfs = ipfsHttpClient(ipfsRoot);

    try {
      for await (const file of ipfs.get(hash)) {
        const content = await getFileContent(ipfs.content);
        console.log(file, content);
      }
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
