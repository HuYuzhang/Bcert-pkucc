import { decrypt, PrivateKey } from "eciesjs";
import { ipfsDownloadPath } from "src/api";

export async function downloadFromIPFS(hash: string): Promise<ArrayBuffer> {
  const url = ipfsDownloadPath(hash);

  const resp = await fetch(url);

  const blob = await resp.blob();

  return await blob.arrayBuffer();

}

// export async function downloadFromIPFS(hash: string): Promise<Uint8Array> {
//   const ipfs = ipfsHttpClient(ipfsRoot);

//   let content: Uint8Array | undefined = undefined;

//   for await (const file of ipfs.get(hash)) {
//     if (content) {
//       throw new Error(`hash ${hash} points to multiple files.`);
//     }
//     content = await getFileContent(ipfs.content);
//     console.log(file, content);
//   }
//   if (!content) {
//     throw new Error(`hash ${hash} does not point to any file.`);
//   }
//   return content;
// }

export function decryptFileContent(content: ArrayBuffer, privateKey: string): Buffer {

  const keyObj = new PrivateKey(Buffer.from(privateKey, "hex"));

  const decrypted = decrypt(keyObj.toHex(), Buffer.from(content));

  return decrypted;
}

export function downloadBuffer(buffer: Buffer) {
  const link = document.createElement("a");
  const blob = new Blob([new Uint8Array(buffer)], { type: "application/pdf" });
  link.href = window.URL.createObjectURL(blob);
  link.download = "cert.pdf";
  link.click();
}

