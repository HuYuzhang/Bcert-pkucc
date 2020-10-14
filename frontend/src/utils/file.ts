import { decrypt, PrivateKey } from "eciesjs";

import ipfsHttpClient from "ipfs-http-client";
import { ipfsRoot } from "src/api";


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

export async function downloadFromIPFS(hash: string): Promise<Uint8Array> {
  const ipfs = ipfsHttpClient(ipfsRoot);

  let content: Uint8Array | undefined = undefined;

  for await (const file of ipfs.get(hash)) {
    if (content) {
      throw new Error(`hash ${hash} points to multiple files.`);
    }
    content = await getFileContent(ipfs.content);
    console.log(file, content);
  }
  if (!content) {
    throw new Error(`hash ${hash} does not point to any file.`);
  }
  return content;
}

export function decryptFileContent(content: Uint8Array, privateKey: string): Buffer {

  const keyObj = new PrivateKey(Buffer.from(privateKey, "hex"));

  const encryptedBuffer = Buffer.from(content);

  const decrypted = decrypt(keyObj.toHex(), encryptedBuffer);

  return decrypted;
}

export function downloadBuffer(buffer: Buffer) {
  const link = document.createElement("a");
  const blob = new Blob([new Uint8Array(buffer)], { type: "application/pdf" });
  link.href = window.URL.createObjectURL(blob);
  link.download = "cert.pdf";
  link.click();
}

