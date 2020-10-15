import { UserSession } from "blockstack";
import { decrypt, PrivateKey } from "eciesjs";
import { ipfsDownloadPath } from "src/api";
import { CertRecord } from "src/models/CertRecord";

export async function downloadFromIPFS(hash: string): Promise<ArrayBuffer> {
  const url = ipfsDownloadPath(hash);

  const resp = await fetch(url);

  if (resp.status >= 300) {
    throw new Error("Download File from IPFS failed");
  }

  const blob = await resp.blob();

  return await blob.arrayBuffer();

}

export function decryptFileContent(content: ArrayBuffer, privateKey: string): Buffer {

  const keyObj = new PrivateKey(Buffer.from(privateKey, "hex"));

  const decrypted = decrypt(keyObj.toHex(), Buffer.from(content));

  return decrypted;
}

export function downloadBuffer(buffer: Buffer, filename: string) {
  const link = document.createElement("a");
  const blob = new Blob([new Uint8Array(buffer)], { type: "application/pdf" });
  link.href = window.URL.createObjectURL(blob);
  link.download = filename;
  link.click();
}

export async function getCertRecordFromIPFS(hash: string, privateKey: string) {
  // download file
  console.log(`Starting download file ${hash} from IPFS...`);
  const content = await downloadFromIPFS(hash);

  // decrypt file
  console.log("Download complete. Starting decrypting file...");
  const decrypted = decryptFileContent(content, privateKey);

  // get CertRecord
  return await CertRecord.fromPdfContent(decrypted, hash);
}

export async function downloadFileFromIPFS(hash: string, privateKey: string) {

  // download file
  console.log(`Starting download file ${hash} from IPFS...`);
  const content = await downloadFromIPFS(hash);

  // decrypt file
  console.log("Download complete. Starting decrypting file...");
  const decrypted = decryptFileContent(content, privateKey);

  // get CertRecord
  const cert = await CertRecord.fromPdfContent(decrypted, hash);

  // init download
  console.log("Decryption complete. Initiating download...");
  downloadBuffer(decrypted, cert.fileName() + ".pdf");

  return cert;
}

const CERTS_RECORD_FILE_PATH = "/certs.txt";

export async function getCertsInRemote(session: UserSession): Promise<CertRecord[]> {
  try {
    const data = await session.getFile(CERTS_RECORD_FILE_PATH) as string;
    return JSON.parse(data);
  } catch (e) {
    return [];
  }
}

export async function saveHashToRemote(session: UserSession, record: CertRecord)
: Promise<"Success" | "NotOwner" | "Dup"> {
  const { username } = session.loadUserData();

  console.log("Current user:", username);

  console.log("The pdf's owner", record.did);

  // check whether the did is the owner
  if (record.did === username) {
    console.log("The downloaded file belongs to the signed-in user.");
    // upload the hash to the gaia

    // download the existing certs
    const certs = [] as CertRecord[];
    try {
      const downloaded = await session.getFile(CERTS_RECORD_FILE_PATH) as string;
      certs.push(...JSON.parse(downloaded));
      console.log("Existing items", certs);
    } catch (e) {
      console.log("First time upload.");
    }
    // check for dup
    if (certs.every((c) => !c.equals(record))) {
      certs.push(record);
      console.log("Add new item", record);

      console.log("Uploading records");
      await session.putFile(CERTS_RECORD_FILE_PATH, JSON.stringify(certs));
      console.log("New records uploaded");
      return "Success";
    } else {
      console.log("The item already exists.");
      return "Dup";

    }
  } else {
    console.log("The downloaded file does not belong to the signed-in user.");
    return "NotOwner";
  }
}
